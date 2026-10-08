<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Category;
use App\Models\Event;
use App\Models\Post;
use App\Models\WebSetting;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class RssFeedController extends Controller
{
    /**
     * Feed RSS Utama (Kompilasi Berita, Pengumuman, dan Agenda Terkini)
     */
    public function main(): Response
    {
        $setting = WebSetting::first();
        $siteTitle = $setting?->site_title ?: config('app.name', 'Portal Kampus');
        $siteDesc = $setting?->meta_description ?: 'Portal Berita, Pengumuman Resmi, dan Agenda Civitas Akademika';

        $items = collect();

        // 1. Berita Terbaru
        Post::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->with(['category:id,name', 'user:id,name'])
            ->latest('published_at')
            ->take(20)
            ->get()
            ->each(function ($post) use (&$items) {
                $pubDate = $post->published_at ?? $post->created_at ?? Carbon::now();
                $items->push([
                    'title' => $post->title,
                    'link' => route('public.posts.show', $post->slug),
                    'author' => $post->user?->name ?? 'Redaksi Kampus',
                    'pubDate' => $pubDate->toRfc2822String(),
                    'timestamp' => $pubDate->timestamp,
                    'category' => $post->category?->name ?? 'Warta Kampus',
                    'description' => strip_tags($post->excerpt ?: Str::limit($post->content, 250)),
                    'content' => $post->content,
                    'enclosureUrl' => $post->thumbnail_url,
                    'enclosureType' => 'image/jpeg',
                ]);
            });

        // 2. Pengumuman Resmi
        Announcement::query()
            ->where('status', 'published')
            ->latest('published_at')
            ->take(10)
            ->get()
            ->each(function ($announcement) use (&$items) {
                $pubDate = $announcement->published_at ?? $announcement->created_at ?? Carbon::now();
                $items->push([
                    'title' => '[Pengumuman] ' . $announcement->title,
                    'link' => route('public.announcements.show', $announcement->slug),
                    'author' => $announcement->issuer ?: 'Biro Administrasi & Humas',
                    'pubDate' => $pubDate->toRfc2822String(),
                    'timestamp' => $pubDate->timestamp,
                    'category' => 'Pengumuman Resmi',
                    'description' => strip_tags($announcement->summary ?: Str::limit($announcement->content, 250)),
                    'content' => $announcement->content,
                    'enclosureUrl' => $announcement->cover_image_url,
                    'enclosureType' => 'image/jpeg',
                ]);
            });

        // 3. Agenda & Kegiatan Kampus
        Event::query()
            ->where('status', 'published')
            ->latest('start_date')
            ->take(10)
            ->get()
            ->each(function ($event) use (&$items) {
                $pubDate = $event->created_at ?? Carbon::now();
                $items->push([
                    'title' => '[Agenda] ' . $event->title,
                    'link' => route('public.events.show', $event->slug),
                    'author' => $event->organizer ?: 'Panitia Agenda Kampus',
                    'pubDate' => $pubDate->toRfc2822String(),
                    'timestamp' => $pubDate->timestamp,
                    'category' => 'Agenda & Kegiatan',
                    'description' => strip_tags($event->summary ?: Str::limit($event->description, 250)),
                    'content' => $event->description,
                    'enclosureUrl' => $event->cover_image_url,
                    'enclosureType' => 'image/jpeg',
                ]);
            });

        // Urutkan seluruh item berdasarkan timestamp publikasi terbaru
        $sortedItems = $items->sortByDesc('timestamp')->values()->all();

        return $this->buildRssResponse(
            title: "{$siteTitle} - Feed Terkini",
            description: $siteDesc,
            feedUrl: route('public.feed.main'),
            items: $sortedItems
        );
    }

    /**
     * Feed Berita & Artikel Kampus
     */
    public function posts(): Response
    {
        $setting = WebSetting::first();
        $siteTitle = $setting?->site_title ?: config('app.name', 'Portal Kampus');

        $posts = Post::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->with(['category:id,name', 'user:id,name'])
            ->latest('published_at')
            ->take(30)
            ->get();

        $items = $posts->map(function ($post) {
            $pubDate = $post->published_at ?? $post->created_at ?? Carbon::now();
            return [
                'title' => $post->title,
                'link' => route('public.posts.show', $post->slug),
                'author' => $post->user?->name ?? 'Redaksi Kampus',
                'pubDate' => $pubDate->toRfc2822String(),
                'category' => $post->category?->name ?? 'Warta Kampus',
                'description' => strip_tags($post->excerpt ?: Str::limit($post->content, 250)),
                'content' => $post->content,
                'enclosureUrl' => $post->thumbnail_url,
                'enclosureType' => 'image/jpeg',
            ];
        })->all();

        return $this->buildRssResponse(
            title: "{$siteTitle} - Warta & Berita Kampus",
            description: "Liputan kegiatan akademik, riset, dan prestasi civitas akademika di {$siteTitle}",
            feedUrl: route('public.feed.posts'),
            items: $items
        );
    }

    /**
     * Feed Pengumuman Resmi
     */
    public function announcements(): Response
    {
        $setting = WebSetting::first();
        $siteTitle = $setting?->site_title ?: config('app.name', 'Portal Kampus');

        $announcements = Announcement::query()
            ->where('status', 'published')
            ->latest('published_at')
            ->take(30)
            ->get();

        $items = $announcements->map(function ($item) {
            $pubDate = $item->published_at ?? $item->created_at ?? Carbon::now();
            return [
                'title' => $item->title,
                'link' => route('public.announcements.show', $item->slug),
                'author' => $item->issuer ?: 'Biro Administrasi & Humas',
                'pubDate' => $pubDate->toRfc2822String(),
                'category' => 'Pengumuman Resmi',
                'description' => strip_tags($item->summary ?: Str::limit($item->content, 250)),
                'content' => $item->content,
                'enclosureUrl' => $item->cover_image_url,
                'enclosureType' => 'image/jpeg',
            ];
        })->all();

        return $this->buildRssResponse(
            title: "{$siteTitle} - Pengumuman Resmi",
            description: "Edaran, instruksi rektorat, dan informasi resmi kampus terkini",
            feedUrl: route('public.feed.announcements'),
            items: $items
        );
    }

    /**
     * Feed Agenda & Acara
     */
    public function events(): Response
    {
        $setting = WebSetting::first();
        $siteTitle = $setting?->site_title ?: config('app.name', 'Portal Kampus');

        $events = Event::query()
            ->where('status', 'published')
            ->latest('start_date')
            ->take(30)
            ->get();

        $items = $events->map(function ($item) {
            $pubDate = $item->created_at ?? Carbon::now();
            return [
                'title' => $item->title,
                'link' => route('public.events.show', $item->slug),
                'author' => $item->organizer ?: 'Panitia Agenda Kampus',
                'pubDate' => $pubDate->toRfc2822String(),
                'category' => 'Agenda Kampus',
                'description' => strip_tags($item->summary ?: Str::limit($item->description, 250)),
                'content' => $item->description,
                'enclosureUrl' => $item->cover_image_url,
                'enclosureType' => 'image/jpeg',
            ];
        })->all();

        return $this->buildRssResponse(
            title: "{$siteTitle} - Agenda & Kegiatan Kampus",
            description: "Jadwal seminar, konferensi, lokakarya, dan perayaan civitas akademika",
            feedUrl: route('public.feed.events'),
            items: $items
        );
    }

    /**
     * Feed Berita Berdasarkan Kategori
     */
    public function category(Category $category): Response
    {
        $setting = WebSetting::first();
        $siteTitle = $setting?->site_title ?: config('app.name', 'Portal Kampus');

        $posts = Post::query()
            ->where('status', 'published')
            ->where('category_id', $category->id)
            ->whereNotNull('published_at')
            ->with(['user:id,name'])
            ->latest('published_at')
            ->take(30)
            ->get();

        $items = $posts->map(function ($post) use ($category) {
            $pubDate = $post->published_at ?? $post->created_at ?? Carbon::now();
            return [
                'title' => $post->title,
                'link' => route('public.posts.show', $post->slug),
                'author' => $post->user?->name ?? 'Redaksi Kampus',
                'pubDate' => $pubDate->toRfc2822String(),
                'category' => $category->name,
                'description' => strip_tags($post->excerpt ?: Str::limit($post->content, 250)),
                'content' => $post->content,
                'enclosureUrl' => $post->thumbnail_url,
                'enclosureType' => 'image/jpeg',
            ];
        })->all();

        return $this->buildRssResponse(
            title: "{$siteTitle} - Kategori: {$category->name}",
            description: $category->description ?: "Kumpulan berita dan artikel kategori {$category->name}",
            feedUrl: route('public.feed.category', $category->slug),
            items: $items
        );
    }

    /**
     * Response Helper untuk RSS XML Standar
     */
    protected function buildRssResponse(string $title, string $description, string $feedUrl, array $items): Response
    {
        $content = view('feeds.rss', [
            'title' => $title,
            'description' => $description,
            'feedUrl' => $feedUrl,
            'siteUrl' => url('/'),
            'lastBuildDate' => Carbon::now()->toRfc2822String(),
            'items' => $items,
        ])->render();

        return response($content, 200, [
            'Content-Type' => 'application/rss+xml; charset=utf-8',
        ]);
    }
}
