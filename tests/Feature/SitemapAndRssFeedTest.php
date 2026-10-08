<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapAndRssFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_xml_returns_successful_xml_response(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');
        $this->assertStringContainsString('<urlset', $response->getContent());
        $this->assertStringContainsString('/berita', $response->getContent());
        $this->assertStringContainsString('/fakultas', $response->getContent());
        $this->assertStringContainsString('/fasilitas', $response->getContent());
        $this->assertStringContainsString('/ekstrakurikuler', $response->getContent());
        $this->assertStringContainsString('/dosen-dan-tendik', $response->getContent());
    }

    public function test_main_rss_feed_returns_valid_xml(): void
    {
        $response = $this->get('/feed');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        $this->assertStringContainsString('<rss version="2.0"', $response->getContent());
        $this->assertStringContainsString('<channel>', $response->getContent());
    }

    public function test_posts_rss_feed_returns_valid_xml(): void
    {
        $response = $this->get('/feed/berita');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        $this->assertStringContainsString('<rss version="2.0"', $response->getContent());
    }

    public function test_announcements_rss_feed_returns_valid_xml(): void
    {
        $response = $this->get('/feed/pengumuman');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        $this->assertStringContainsString('<rss version="2.0"', $response->getContent());
    }

    public function test_events_rss_feed_returns_valid_xml(): void
    {
        $response = $this->get('/feed/agenda');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        $this->assertStringContainsString('<rss version="2.0"', $response->getContent());
    }
}
