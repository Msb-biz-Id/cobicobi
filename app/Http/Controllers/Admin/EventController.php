<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Event::query()->with('user:id,name');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('venue_name', 'like', "%{$search}%")
                  ->orWhere('organizer', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $events = $query->orderBy('start_date', 'desc')
            ->paginate(12)
            ->withQueryString();

        $categories = [
            'Seminar',
            'Workshop',
            'Konferensi',
            'Kuliah Umum',
            'Wisuda',
            'Lomba & Kompetisi',
            'Dies Natalis',
            'Job Fair & Expo',
            'Webinar',
        ];

        return Inertia::render('Events/Index', [
            'events' => $events,
            'filters' => $request->only(['search', 'status', 'category']),
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Events/Edit', [
            'event' => null,
            'categories' => \App\Models\Category::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'hashtags' => \App\Models\Hashtag::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $hashtagIds = $data['hashtag_ids'] ?? [];

        if (!empty($data['new_hashtags'])) {
            foreach ($data['new_hashtags'] as $tagName) {
                $cleanName = trim($tagName);
                if ($cleanName !== '') {
                    $tag = \App\Models\Hashtag::firstOrCreate(
                        ['name' => $cleanName],
                        ['slug' => Str::slug($cleanName), 'is_active' => true]
                    );
                    $hashtagIds[] = $tag->id;
                }
            }
        }
        $hashtagIds = array_values(array_unique($hashtagIds));
        
        $baseSlug = !empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (Event::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $data['slug'] = $slug;
        $data['user_id'] = $request->user()?->id;

        if (!empty($data['category_id'])) {
            $cat = \App\Models\Category::find($data['category_id']);
            if ($cat) {
                $data['category'] = $cat->name;
            }
        }

        if (($data['status'] ?? '') === 'scheduled' && !empty($data['published_at'])) {
            // Keep scheduled & published_at
        } elseif (($data['status'] ?? '') === 'published') {
            $data['published_at'] = $data['published_at'] ?? now();
        }

        unset($data['hashtag_ids'], $data['new_hashtags']);

        if (isset($data['description'])) {
            $data['description'] = \App\Services\HtmlSanitizer::clean($data['description']);
        }

        $event = Event::create($data);
        $event->hashtags()->sync($hashtagIds);

        return redirect()
            ->route('events.show', $event)
            ->with('success', 'Event kampus berhasil dibuat.');
    }

    public function show(Event $event): Response
    {
        $event->load(['user:id,name', 'category:id,name', 'hashtags:id,name,slug']);

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }

    public function publicShow(Event $event): Response
    {
        if ($event->status !== 'published') {
            abort(404);
        }

        $event->load(['user:id,name', 'category:id,name', 'hashtags:id,name,slug']);

        return Inertia::render('Events/Show', [
            'event' => $event,
            'isPublicView' => true,
        ]);
    }

    public function edit(Event $event): Response
    {
        $event->load(['category:id,name', 'hashtags:id,name,slug']);

        $eventData = $event->toArray();
        $eventData['hashtag_ids'] = $event->hashtags->pluck('id')->all();
        $eventData['published_at'] = $event->published_at ? $event->published_at->format('Y-m-d\TH:i') : '';

        return Inertia::render('Events/Edit', [
            'event' => $eventData,
            'categories' => \App\Models\Category::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'hashtags' => \App\Models\Hashtag::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $data = $request->validated();
        $hashtagIds = $data['hashtag_ids'] ?? [];

        if (!empty($data['new_hashtags'])) {
            foreach ($data['new_hashtags'] as $tagName) {
                $cleanName = trim($tagName);
                if ($cleanName !== '') {
                    $tag = \App\Models\Hashtag::firstOrCreate(
                        ['name' => $cleanName],
                        ['slug' => Str::slug($cleanName), 'is_active' => true]
                    );
                    $hashtagIds[] = $tag->id;
                }
            }
        }
        $hashtagIds = array_values(array_unique($hashtagIds));

        if (!empty($data['slug'])) {
            $baseSlug = Str::slug($data['slug']);
            $slug = $baseSlug;
            $counter = 1;
            while (Event::where('slug', $slug)->where('id', '!=', $event->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $data['slug'] = $slug;
        }

        if (!empty($data['category_id'])) {
            $cat = \App\Models\Category::find($data['category_id']);
            if ($cat) {
                $data['category'] = $cat->name;
            }
        }

        if (($data['status'] ?? '') === 'scheduled' && !empty($data['published_at'])) {
            // Keep scheduled & published_at
        } elseif (($data['status'] ?? '') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = $event->published_at ?: now();
        }

        unset($data['hashtag_ids'], $data['new_hashtags']);

        if (isset($data['description'])) {
            $data['description'] = \App\Services\HtmlSanitizer::clean($data['description']);
        }

        $event->update($data);
        $event->hashtags()->sync($hashtagIds);

        return redirect()
            ->route('events.show', $event)
            ->with('success', 'Event kampus berhasil diperbarui.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return redirect()
            ->route('events.index')
            ->with('success', 'Event berhasil dihapus.');
    }
}
