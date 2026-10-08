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

        return Inertia::render('Events/Edit', [
            'event' => null,
            'categories' => $categories,
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        $baseSlug = !empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (Event::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $data['slug'] = $slug;
        $data['user_id'] = $request->user()?->id;

        if (isset($data['description'])) {
            $data['description'] = \App\Services\HtmlSanitizer::clean($data['description']);
        }

        $event = Event::create($data);

        return redirect()
            ->route('events.show', $event)
            ->with('success', 'Event kampus berhasil dibuat.');
    }

    public function show(Event $event): Response
    {
        $event->load('user:id,name');

        return Inertia::render('Events/Show', [
            'event' => $event,
        ]);
    }

    public function publicShow(Event $event): Response
    {
        if ($event->status !== 'published') {
            abort(404);
        }

        $event->load('user:id,name');

        return Inertia::render('Events/Show', [
            'event' => $event,
            'isPublicView' => true,
        ]);
    }

    public function edit(Event $event): Response
    {
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

        return Inertia::render('Events/Edit', [
            'event' => $event,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $data = $request->validated();

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

        if (isset($data['description'])) {
            $data['description'] = \App\Services\HtmlSanitizer::clean($data['description']);
        }

        $event->update($data);

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
