<?php

namespace App\Services;

use App\Models\StaffProfile;
use App\Models\StaffPublication;
use DOMDocument;
use DOMXPath;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ScholarSyncService
{
    /**
     * Extract Google Scholar User ID from a URL or raw string.
     */
    public function extractScholarId(?string $input): ?string
    {
        if (blank($input)) {
            return null;
        }

        $input = trim($input);

        // If it's a URL like https://scholar.google.com/citations?user=xyz123...
        if (str_contains($input, 'user=')) {
            $parsed = parse_url($input);
            if (!empty($parsed['query'])) {
                parse_str($parsed['query'], $queryParams);
                if (!empty($queryParams['user'])) {
                    return trim($queryParams['user']);
                }
            }
        }

        // If user already pasted just the alphanumeric user ID (typically 12 chars)
        if (preg_match('/^[a-zA-Z0-9_-]{8,24}$/', $input)) {
            return $input;
        }

        return null;
    }

    /**
     * Synchronize both Google Scholar and RSS feed for a staff profile.
     */
    public function syncProfile(StaffProfile $profile): array
    {
        $result = [
            'scholar_count' => 0,
            'rss_count' => 0,
            'metrics_updated' => false,
            'messages' => [],
            'errors' => [],
        ];

        // 1. Sync Google Scholar if ID or URL is present
        $scholarId = $profile->google_scholar_id ?: $this->extractScholarId($profile->google_scholar_url);
        if ($scholarId) {
            if (!$profile->google_scholar_id) {
                $profile->google_scholar_id = $scholarId;
            }

            try {
                $scholarData = $this->fetchScholarData($scholarId);
                
                // Update metrics
                if (!empty($scholarData['metrics'])) {
                    $profile->total_citations = $scholarData['metrics']['total_citations'] ?? $profile->total_citations;
                    $profile->h_index = $scholarData['metrics']['h_index'] ?? $profile->h_index;
                    $profile->i10_index = $scholarData['metrics']['i10_index'] ?? $profile->i10_index;
                    $result['metrics_updated'] = true;
                }

                // Sync publications
                $syncedCount = 0;
                foreach ($scholarData['publications'] as $pubItem) {
                    $publication = StaffPublication::updateOrCreate(
                        [
                            'staff_profile_id' => $profile->id,
                            'title' => $pubItem['title'],
                            'source' => 'scholar',
                        ],
                        [
                            'authors' => $pubItem['authors'] ?? null,
                            'publication_name' => $pubItem['publication_name'] ?? null,
                            'year' => $pubItem['year'] ?? null,
                            'url' => $pubItem['url'] ?? null,
                            'citations_count' => $pubItem['citations_count'] ?? 0,
                            'type' => $this->guessPublicationType($pubItem['publication_name'] ?? ''),
                        ]
                    );

                    if ($publication) {
                        $syncedCount++;
                    }
                }

                $result['scholar_count'] = $syncedCount;
                $result['messages'][] = "Berhasil mensinkronkan {$syncedCount} publikasi dari Google Scholar.";
            } catch (Exception $e) {
                Log::warning("Google Scholar sync failed for profile {$profile->id}: " . $e->getMessage());
                $result['errors'][] = 'Sinkronisasi Google Scholar: ' . $e->getMessage();
            }
        }

        // 2. Sync RSS / Atom Feed if provided
        if (!empty($profile->rss_feed_url)) {
            try {
                $rssCount = $this->fetchRssPublications($profile);
                $result['rss_count'] = $rssCount;
                $result['messages'][] = "Berhasil mengimpor {$rssCount} artikel dari RSS Feed.";
            } catch (Exception $e) {
                Log::warning("RSS sync failed for profile {$profile->id}: " . $e->getMessage());
                $result['errors'][] = 'Sinkronisasi RSS Feed: ' . $e->getMessage();
            }
        }

        $profile->last_synced_at = Carbon::now();
        $profile->save();

        return $result;
    }

    /**
     * Fetch profile publications and metrics from Google Scholar Citations page.
     */
    public function fetchScholarData(string $scholarId): array
    {
        $url = "https://scholar.google.com/citations?user={$scholarId}&hl=en&cstart=0&pagesize=100";

        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language' => 'en-US,en;q=0.9,id;q=0.8',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ])
        ->timeout(12)
        ->get($url);

        if (!$response->successful()) {
            throw new Exception("Gagal mengakses Google Scholar (HTTP {$response->status()}).");
        }

        $html = $response->body();
        if (str_contains($html, 'captcha') || str_contains($html, 'recaptcha')) {
            throw new Exception("Google Scholar mendeteksi captcha otomatis. Silakan coba beberapa saat lagi atau masukkan publikasi manual.");
        }

        return $this->parseScholarHtml($html);
    }

    /**
     * Parse HTML of Google Scholar page.
     */
    public function parseScholarHtml(string $html): array
    {
        $publications = [];
        $metrics = [
            'total_citations' => 0,
            'h_index' => 0,
            'i10_index' => 0,
        ];

        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
        $xpath = new DOMXPath($dom);
        libxml_clear_errors();

        // 1. Parse Citation Metrics Table (#gsc_rsb_st)
        $metricCells = $xpath->query('//table[@id="gsc_rsb_st"]//td[@class="gsc_rsb_std"]');
        if ($metricCells->length >= 6) {
            $metrics['total_citations'] = (int) filter_var($metricCells->item(0)->textContent, FILTER_SANITIZE_NUMBER_INT);
            $metrics['h_index'] = (int) filter_var($metricCells->item(2)->textContent, FILTER_SANITIZE_NUMBER_INT);
            $metrics['i10_index'] = (int) filter_var($metricCells->item(4)->textContent, FILTER_SANITIZE_NUMBER_INT);
        }

        // 2. Parse Article Rows (.gsc_a_tr)
        $rows = $xpath->query('//tr[@class="gsc_a_tr"]');
        foreach ($rows as $row) {
            $titleNode = $xpath->query('.//a[@class="gsc_a_at"]', $row)->item(0);
            if (!($titleNode instanceof \DOMElement)) {
                continue;
            }

            $title = trim($titleNode->textContent);
            $href = $titleNode->getAttribute('href');
            $fullUrl = $href ? (str_starts_with($href, 'http') ? $href : 'https://scholar.google.com' . $href) : null;

            // Details: Authors & Venue in .gs_gray
            $grayNodes = $xpath->query('.//div[@class="gs_gray"]', $row);
            $authors = $grayNodes->item(0) ? trim($grayNodes->item(0)->textContent) : null;
            $venue = $grayNodes->item(1) ? trim($grayNodes->item(1)->textContent) : null;

            // Citations count
            $citeNode = $xpath->query('.//a[@class="gsc_a_ac gs_ibl"]', $row)->item(0);
            $citations = 0;
            if ($citeNode && !empty($citeNode->textContent)) {
                $citations = (int) filter_var($citeNode->textContent, FILTER_SANITIZE_NUMBER_INT);
            }

            // Year
            $yearNode = $xpath->query('.//span[@class="gsc_a_h gsc_a_hc gs_ibl"]', $row)->item(0);
            $year = null;
            if ($yearNode && !empty($yearNode->textContent)) {
                $rawYear = (int) filter_var($yearNode->textContent, FILTER_SANITIZE_NUMBER_INT);
                if ($rawYear >= 1950 && $rawYear <= 2050) {
                    $year = $rawYear;
                }
            }

            if (!empty($title)) {
                $publications[] = [
                    'title' => $title,
                    'authors' => $authors,
                    'publication_name' => $venue,
                    'citations_count' => $citations,
                    'year' => $year,
                    'url' => $fullUrl,
                ];
            }
        }

        return [
            'metrics' => $metrics,
            'publications' => $publications,
        ];
    }

    /**
     * Fetch & parse an RSS or Atom feed URL for a staff profile.
     */
    public function fetchRssPublications(StaffProfile $profile): int
    {
        $response = Http::withHeaders([
            'User-Agent' => 'CMS-University-RSS-Reader/1.0',
        ])
        ->timeout(10)
        ->get($profile->rss_feed_url);

        if (!$response->successful()) {
            throw new Exception("Gagal mengunduh RSS Feed (HTTP {$response->status()}).");
        }

        $xmlString = $response->body();
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($xmlString, 'SimpleXMLElement', LIBXML_NOCDATA);
        libxml_clear_errors();

        if ($xml === false) {
            throw new Exception("Format XML pada RSS Feed tidak valid.");
        }

        $count = 0;

        // Check if standard RSS 2.0 (<channel><item>...)
        if (isset($xml->channel->item)) {
            foreach ($xml->channel->item as $item) {
                $title = trim((string) $item->title);
                $link = trim((string) $item->link);
                $pubDate = (string) $item->pubDate;
                $description = strip_tags((string) $item->description);
                $year = !empty($pubDate) ? (int) date('Y', strtotime($pubDate)) : null;

                if (!empty($title)) {
                    StaffPublication::updateOrCreate(
                        [
                            'staff_profile_id' => $profile->id,
                            'title' => $title,
                            'source' => 'rss',
                        ],
                        [
                            'url' => $link,
                            'year' => $year,
                            'description' => $description ? mb_substr($description, 0, 500) : null,
                            'type' => $this->guessPublicationType($title),
                        ]
                    );
                    $count++;
                }
            }
        }
        // Check if Atom format (<feed><entry>...)
        elseif (isset($xml->entry)) {
            foreach ($xml->entry as $entry) {
                $title = trim((string) $entry->title);
                $link = '';
                if (isset($entry->link['href'])) {
                    $link = (string) $entry->link['href'];
                }
                $updated = (string) ($entry->published ?? $entry->updated ?? '');
                $year = !empty($updated) ? (int) date('Y', strtotime($updated)) : null;

                if (!empty($title)) {
                    StaffPublication::updateOrCreate(
                        [
                            'staff_profile_id' => $profile->id,
                            'title' => $title,
                            'source' => 'rss',
                        ],
                        [
                            'url' => $link,
                            'year' => $year,
                            'type' => $this->guessPublicationType($title),
                        ]
                    );
                    $count++;
                }
            }
        }

        return $count;
    }

    /**
     * Guess publication type from venue name or title.
     */
    private function guessPublicationType(string $venueOrTitle): string
    {
        $lower = strtolower($venueOrTitle);

        if (str_contains($lower, 'conference') || str_contains($lower, 'proceeding') || str_contains($lower, 'prosiding') || str_contains($lower, 'seminar') || str_contains($lower, 'symposium')) {
            return 'conference';
        }

        if (str_contains($lower, 'book') || str_contains($lower, 'buku') || str_contains($lower, 'monograf') || str_contains($lower, 'chapter') || str_contains($lower, 'penerbit')) {
            return 'book';
        }

        if (str_contains($lower, 'patent') || str_contains($lower, 'paten') || str_contains($lower, 'hki') || str_contains($lower, 'hak cipta')) {
            return 'patent';
        }

        if (str_contains($lower, 'pengabdian') || str_contains($lower, 'community') || str_contains($lower, 'pkm')) {
            return 'community_service';
        }

        return 'journal';
    }
}
