<?php

use App\Http\Controllers\Admin\WebSettingController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\HashtagController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\StaffProfileController;
use App\Http\Controllers\StaffProfileSelfController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\FacultyPublicController;
use App\Http\Controllers\Public\StudyProgramPublicController;
use App\Http\Controllers\Public\InstitutionalUnitPublicController;
use App\Http\Controllers\Public\FacilityPublicController;
use App\Http\Controllers\Public\ExtracurricularPublicController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\RssFeedController;
use App\Http\Controllers\Admin\StructuralPositionController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\StudyProgramController;
use App\Http\Controllers\Admin\InstitutionalUnitController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\ExtracurricularController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Public\GalleryPublicController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Portal Publik, Arsip & Detail dalam Bahasa Indonesia (Bebas ID di URL)
Route::get('/', [PublicController::class, 'home'])->name('home');

// Fakultas & Program Studi (Lengkap dengan Prospek Karir & Slide Dosen)
Route::get('/fakultas', [FacultyPublicController::class, 'index'])->name('public.faculties.index');
Route::get('/fakultas/{faculty:slug}', [FacultyPublicController::class, 'show'])->name('public.faculties.show');

Route::get('/program-studi', [StudyProgramPublicController::class, 'index'])->name('public.study-programs.index');
Route::get('/program-studi/{studyProgram:slug}', [StudyProgramPublicController::class, 'show'])->name('public.study-programs.show');

// Unit Kerja, UPT, Lembaga & Biro
Route::get('/unit', [InstitutionalUnitPublicController::class, 'index'])->name('public.institutional-units.index');
Route::get('/unit/{institutionalUnit:slug}', [InstitutionalUnitPublicController::class, 'show'])->name('public.institutional-units.show');

// Fasilitas Kampus
Route::get('/fasilitas', [FacilityPublicController::class, 'index'])->name('public.facilities.index');
Route::get('/fasilitas/{facility:slug}', [FacilityPublicController::class, 'show'])->name('public.facilities.show');

// Ekstrakurikuler & UKM (Unit Kegiatan Mahasiswa)
Route::get('/ekstrakurikuler', [ExtracurricularPublicController::class, 'index'])->name('public.extracurriculars.index');
Route::get('/ekstrakurikuler/{extracurricular:slug}', [ExtracurricularPublicController::class, 'show'])->name('public.extracurriculars.show');

// Galeri & Lensa Dokumentasi Kampus
Route::get('/galeri', [GalleryPublicController::class, 'index'])->name('public.galleries.index');
Route::get('/galeri/{gallery:slug}', [GalleryPublicController::class, 'show'])->name('public.galleries.show');

// Agenda & Kegiatan Kampus
Route::get('/agenda', [PublicController::class, 'events'])->name('public.events.index');
Route::get('/agenda/{event:slug}', [PublicController::class, 'eventDetail'])->name('public.events.show');

// Berita & Warta Kampus
Route::get('/berita', [PublicController::class, 'posts'])->name('public.posts.index');
Route::get('/berita/{post:slug}', [PublicController::class, 'postDetail'])->name('public.posts.show');

// Pengumuman & Berkas Unduhan Resmi (Bebas ID)
Route::get('/pengumuman', [PublicController::class, 'announcements'])->name('public.announcements.index');
Route::get('/pengumuman/{announcement:slug}', [PublicController::class, 'announcementDetail'])->name('public.announcements.show');
Route::get('/pengumuman/{announcement:slug}/unduh/{index}', [AnnouncementController::class, 'download'])->name('announcements.download');

// Direktori Civitas: Dosen & Tenaga Kependidikan
Route::get('/dosen-dan-tendik', [PublicController::class, 'lecturers'])->name('public.lecturers.index');
Route::get('/dosen-dan-tendik/{staffProfile:slug}', [PublicController::class, 'lecturerDetail'])->name('public.lecturers.show');

// Kategori, Topik (Tag) & Laman Statis
Route::get('/kategori/{category:slug}', [PublicController::class, 'categoryArchive'])->name('public.categories.show');
Route::get('/topik/{hashtag:slug}', [PublicController::class, 'tagArchive'])->name('public.tags.show');
Route::get('/laman/{page:slug}', [PublicController::class, 'pageDetail'])->name('public.pages.show');

// Kirim Pesan Kontak
Route::post('/kontak/kirim', [ContactFormController::class, 'store'])
    ->middleware(['throttle:contact-submission'])
    ->name('contact.submit');

// Redirect 301 untuk Kompatibilitas Tautan Lama
Route::redirect('/events', '/agenda', 301);
Route::redirect('/posts', '/berita', 301);
Route::redirect('/announcements', '/pengumuman', 301);
Route::redirect('/lecturers', '/dosen-dan-tendik', 301);
Route::redirect('/contact/submit', '/kontak/kirim', 301);

// XML Sitemap Komprehensif Seluruh Entitas Kampus
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('public.sitemap');
Route::get('/sitemap', [SitemapController::class, 'index']);

// RSS 2.0 Feeds (Multi-Saluran)
Route::get('/feed', [RssFeedController::class, 'main'])->name('public.feed.main');
Route::get('/rss', [RssFeedController::class, 'main']);
Route::get('/rss.xml', [RssFeedController::class, 'main']);
Route::get('/feed/berita', [RssFeedController::class, 'posts'])->name('public.feed.posts');
Route::get('/feed/posts', [RssFeedController::class, 'posts']);
Route::get('/feed/pengumuman', [RssFeedController::class, 'announcements'])->name('public.feed.announcements');
Route::get('/feed/announcements', [RssFeedController::class, 'announcements']);
Route::get('/feed/agenda', [RssFeedController::class, 'events'])->name('public.feed.events');
Route::get('/feed/events', [RssFeedController::class, 'events']);
Route::get('/feed/kategori/{category:slug}', [RssFeedController::class, 'category'])->name('public.feed.category');

Route::middleware(['auth', 'verified', 'log.admin.activity'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'activeUsers' => User::where('is_active', true)->count(),
                'inactiveUsers' => User::where('is_active', false)->count(),
                'admins' => User::whereIn('role', ['superadmin', 'admin'])->count(),
            ],
        ]);
    })->middleware('permission:dashboard.view')->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->middleware('permission:users.view')->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->middleware('permission:users.create')->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->middleware('permission:users.update')->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete')->name('users.destroy');

    Route::get('/roles-permissions', [RolePermissionController::class, 'index'])
        ->middleware(['permission:roles.view', 'permission:permissions.view'])
        ->name('roles-permissions.index');
    Route::post('/roles-permissions/roles', [RolePermissionController::class, 'storeRole'])->middleware('permission:roles.create')->name('roles.store');
    Route::put('/roles-permissions/roles/{role}', [RolePermissionController::class, 'updateRole'])->middleware('permission:roles.update')->name('roles.update');
    Route::delete('/roles-permissions/roles/{role}', [RolePermissionController::class, 'destroyRole'])->middleware('permission:roles.delete')->name('roles.destroy');
    Route::put('/roles-permissions/roles/{role}/permissions', [RolePermissionController::class, 'syncRolePermissions'])->middleware('permission:roles.update')->name('roles.permissions.sync');
    Route::post('/roles-permissions/permissions', [RolePermissionController::class, 'storePermission'])->middleware('permission:permissions.create')->name('permissions.store');
    Route::put('/roles-permissions/permissions/{permission}', [RolePermissionController::class, 'updatePermission'])->middleware('permission:permissions.update')->name('permissions.update');
    Route::delete('/roles-permissions/permissions/{permission}', [RolePermissionController::class, 'destroyPermission'])->middleware('permission:permissions.delete')->name('permissions.destroy');

    Route::get('/menus', [MenuController::class, 'index'])->middleware('permission:menus.view')->name('menus.index');
    Route::post('/menus', [MenuController::class, 'store'])->middleware('permission:menus.update')->name('menus.store');
    Route::post('/menus/batch', [MenuController::class, 'batchStore'])->middleware('permission:menus.update')->name('menus.batch');
    Route::put('/menus/reorder', [MenuController::class, 'reorder'])->middleware('permission:menus.update')->name('menus.reorder');
    Route::put('/menus/{menu}', [MenuController::class, 'update'])->middleware('permission:menus.update')->name('menus.update');
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])->middleware('permission:menus.update')->name('menus.destroy');

    Route::get('/hashtags', [HashtagController::class, 'index'])->middleware('permission:hashtags.view')->name('hashtags.index');
    Route::post('/hashtags', [HashtagController::class, 'store'])->middleware('permission:hashtags.create')->name('hashtags.store');
    Route::put('/hashtags/{hashtag}', [HashtagController::class, 'update'])->middleware('permission:hashtags.update')->name('hashtags.update');
    Route::delete('/hashtags/{hashtag}', [HashtagController::class, 'destroy'])->middleware('permission:hashtags.delete')->name('hashtags.destroy');

    Route::get('/categories', [CategoryController::class, 'index'])->middleware('permission:categories.view')->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->middleware('permission:categories.create')->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->middleware('permission:categories.update')->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->middleware('permission:categories.delete')->name('categories.destroy');

Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::get('/media/items', [MediaController::class, 'index'])->name('media.items');
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::put('/media/{media}', [MediaController::class, 'update'])->name('media.update');
    Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    Route::resource('galleries', GalleryController::class);

    Route::get('/notifications', [NotificationController::class, 'index'])->middleware('permission:notifications.view')->name('notifications.index');
    Route::post('/notifications', [NotificationController::class, 'store'])->middleware('permission:notifications.create')->name('notifications.store');
    Route::put('/notifications/{notification}', [NotificationController::class, 'update'])->middleware('permission:notifications.update')->name('notifications.update');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->middleware('permission:notifications.delete')->name('notifications.destroy');

    Route::get('/contact-messages', [ContactMessageController::class, 'index'])->middleware('permission:contact-messages.view')->name('contact-messages.index');
    Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show'])->middleware('permission:contact-messages.view')->name('contact-messages.show');
    Route::put('/contact-messages/{contactMessage}/mark-read', [ContactMessageController::class, 'markRead'])->middleware('permission:contact-messages.update')->name('contact-messages.mark-read');
    Route::put('/contact-messages/{contactMessage}/mark-unread', [ContactMessageController::class, 'markUnread'])->middleware('permission:contact-messages.update')->name('contact-messages.mark-unread');
    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy'])->middleware('permission:contact-messages.delete')->name('contact-messages.destroy');

    Route::prefix('admin')->group(function () {
        Route::get('/posts', [PostController::class, 'index'])->middleware('permission:posts.view')->name('posts.index');
        Route::get('/posts/create', [PostController::class, 'create'])->middleware('permission:posts.create')->name('posts.create');
        Route::post('/posts', [PostController::class, 'store'])->middleware('permission:posts.create')->name('posts.store');
        Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->middleware('permission:posts.update')->name('posts.edit');
        Route::put('/posts/{post}', [PostController::class, 'update'])->middleware('permission:posts.update')->name('posts.update');
        Route::put('/posts/{post}/submit-review', [PostController::class, 'submitReview'])->middleware('permission:posts.update')->name('posts.workflow.submit-review');
        Route::put('/posts/{post}/approve', [PostController::class, 'approve'])->middleware('permission:posts.update')->name('posts.workflow.approve');
        Route::put('/posts/{post}/publish', [PostController::class, 'publish'])->middleware('permission:posts.update')->name('posts.workflow.publish');
        Route::put('/posts/{post}/send-back', [PostController::class, 'sendBack'])->middleware('permission:posts.update')->name('posts.workflow.send-back');
        Route::get('/posts/{post}/revisions', [PostController::class, 'revisions'])->middleware('permission:posts.view')->name('posts.revisions');
        Route::put('/posts/{post}/rollback/{revision}', [PostController::class, 'rollback'])->middleware('permission:posts.update')->name('posts.rollback');
        Route::delete('/posts/{post}', [PostController::class, 'destroy'])->middleware('permission:posts.delete')->name('posts.destroy');
        Route::post('/posts/upload-image', [PostController::class, 'uploadImage'])->middleware('permission:posts.update')->name('posts.upload-image');

        Route::get('/pages', [PageController::class, 'index'])->middleware('permission:pages.view')->name('pages.index');
        Route::get('/pages/create', [PageController::class, 'create'])->middleware('permission:pages.create')->name('pages.create');
        Route::post('/pages', [PageController::class, 'store'])->middleware('permission:pages.create')->name('pages.store');
        Route::get('/pages/{page}/edit', [PageController::class, 'edit'])->middleware('permission:pages.update')->name('pages.edit');
        Route::put('/pages/{page}', [PageController::class, 'update'])->middleware('permission:pages.update')->name('pages.update');
        Route::put('/pages/{page}/submit-review', [PageController::class, 'submitReview'])->middleware('permission:pages.update')->name('pages.workflow.submit-review');
        Route::put('/pages/{page}/approve', [PageController::class, 'approve'])->middleware('permission:pages.update')->name('pages.workflow.approve');
        Route::put('/pages/{page}/publish', [PageController::class, 'publish'])->middleware('permission:pages.update')->name('pages.workflow.publish');
        Route::put('/pages/{page}/send-back', [PageController::class, 'sendBack'])->middleware('permission:pages.update')->name('pages.workflow.send-back');
        Route::get('/pages/{page}/revisions', [PageController::class, 'revisions'])->middleware('permission:pages.view')->name('pages.revisions');
        Route::put('/pages/{page}/rollback/{revision}', [PageController::class, 'rollback'])->middleware('permission:pages.update')->name('pages.rollback');
        Route::delete('/pages/{page}', [PageController::class, 'destroy'])->middleware('permission:pages.delete')->name('pages.destroy');
        Route::post('/pages/upload-image', [PageController::class, 'uploadImage'])->middleware('permission:pages.update')->name('pages.upload-image');

        Route::get('/events', [EventController::class, 'index'])->middleware('permission:events.view')->name('events.index');
        Route::get('/events/create', [EventController::class, 'create'])->middleware('permission:events.create')->name('events.create');
        Route::post('/events', [EventController::class, 'store'])->middleware('permission:events.create')->name('events.store');
        Route::get('/events/{event}', [EventController::class, 'show'])->middleware('permission:events.view')->name('events.show');
        Route::get('/events/{event}/edit', [EventController::class, 'edit'])->middleware('permission:events.update')->name('events.edit');
        Route::put('/events/{event}', [EventController::class, 'update'])->middleware('permission:events.update')->name('events.update');
        Route::delete('/events/{event}', [EventController::class, 'destroy'])->middleware('permission:events.delete')->name('events.destroy');

        Route::get('/announcements', [AnnouncementController::class, 'index'])->middleware('permission:announcements.view')->name('announcements.index');
        Route::get('/announcements/create', [AnnouncementController::class, 'create'])->middleware('permission:announcements.create')->name('announcements.create');
        Route::post('/announcements', [AnnouncementController::class, 'store'])->middleware('permission:announcements.create')->name('announcements.store');
        Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show'])->middleware('permission:announcements.view')->name('announcements.show');
        Route::get('/announcements/{announcement}/edit', [AnnouncementController::class, 'edit'])->middleware('permission:announcements.update')->name('announcements.edit');
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update'])->middleware('permission:announcements.update')->name('announcements.update');
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->middleware('permission:announcements.delete')->name('announcements.destroy');

        Route::get('/staff', [StaffProfileController::class, 'index'])->middleware('permission:staff.view')->name('staff.index');
        Route::get('/staff/create', [StaffProfileController::class, 'create'])->middleware('permission:staff.create')->name('staff.create');
        Route::post('/staff', [StaffProfileController::class, 'store'])->middleware('permission:staff.create')->name('staff.store');
        Route::get('/staff/{staff}/edit', [StaffProfileController::class, 'edit'])->middleware('permission:staff.update')->name('staff.edit');
        Route::put('/staff/{staff}', [StaffProfileController::class, 'update'])->middleware('permission:staff.update')->name('staff.update');
        Route::delete('/staff/{staff}', [StaffProfileController::class, 'destroy'])->middleware('permission:staff.delete')->name('staff.destroy');
        Route::post('/staff/{staff}/sync', [StaffProfileController::class, 'sync'])->middleware('permission:staff.update')->name('staff.sync');

        // Master Jabatan Struktural
        Route::get('/jabatan-struktural', [StructuralPositionController::class, 'index'])->middleware('permission:structural-positions.view')->name('admin.structural-positions.index');
        Route::post('/jabatan-struktural', [StructuralPositionController::class, 'store'])->middleware('permission:structural-positions.create')->name('admin.structural-positions.store');
        Route::put('/jabatan-struktural/{structuralPosition}', [StructuralPositionController::class, 'update'])->middleware('permission:structural-positions.update')->name('admin.structural-positions.update');
        Route::delete('/jabatan-struktural/{structuralPosition}', [StructuralPositionController::class, 'destroy'])->middleware('permission:structural-positions.delete')->name('admin.structural-positions.destroy');

        // Fakultas
        Route::get('/fakultas', [FacultyController::class, 'index'])->middleware('permission:faculties.view')->name('admin.faculties.index');
        Route::get('/fakultas/create', [FacultyController::class, 'create'])->middleware('permission:faculties.create')->name('admin.faculties.create');
        Route::post('/fakultas', [FacultyController::class, 'store'])->middleware('permission:faculties.create')->name('admin.faculties.store');
        Route::get('/fakultas/{faculty}/edit', [FacultyController::class, 'edit'])->middleware('permission:faculties.update')->name('admin.faculties.edit');
        Route::put('/fakultas/{faculty}', [FacultyController::class, 'update'])->middleware('permission:faculties.update')->name('admin.faculties.update');
        Route::delete('/fakultas/{faculty}', [FacultyController::class, 'destroy'])->middleware('permission:faculties.delete')->name('admin.faculties.destroy');

        // Program Studi
        Route::get('/program-studi', [StudyProgramController::class, 'index'])->middleware('permission:study-programs.view')->name('admin.study-programs.index');
        Route::get('/program-studi/create', [StudyProgramController::class, 'create'])->middleware('permission:study-programs.create')->name('admin.study-programs.create');
        Route::post('/program-studi', [StudyProgramController::class, 'store'])->middleware('permission:study-programs.create')->name('admin.study-programs.store');
        Route::get('/program-studi/{studyProgram}/edit', [StudyProgramController::class, 'edit'])->middleware('permission:study-programs.update')->name('admin.study-programs.edit');
        Route::put('/program-studi/{studyProgram}', [StudyProgramController::class, 'update'])->middleware('permission:study-programs.update')->name('admin.study-programs.update');
        Route::delete('/program-studi/{studyProgram}', [StudyProgramController::class, 'destroy'])->middleware('permission:study-programs.delete')->name('admin.study-programs.destroy');

        // Unit / UPT / Lembaga
        Route::get('/unit-lembaga', [InstitutionalUnitController::class, 'index'])->middleware('permission:institutional-units.view')->name('admin.institutional-units.index');
        Route::get('/unit-lembaga/create', [InstitutionalUnitController::class, 'create'])->middleware('permission:institutional-units.create')->name('admin.institutional-units.create');
        Route::post('/unit-lembaga', [InstitutionalUnitController::class, 'store'])->middleware('permission:institutional-units.create')->name('admin.institutional-units.store');
        Route::get('/unit-lembaga/{institutionalUnit}/edit', [InstitutionalUnitController::class, 'edit'])->middleware('permission:institutional-units.update')->name('admin.institutional-units.edit');
        Route::put('/unit-lembaga/{institutionalUnit}', [InstitutionalUnitController::class, 'update'])->middleware('permission:institutional-units.update')->name('admin.institutional-units.update');
        Route::delete('/unit-lembaga/{institutionalUnit}', [InstitutionalUnitController::class, 'destroy'])->middleware('permission:institutional-units.delete')->name('admin.institutional-units.destroy');

        // Fasilitas Kampus
        Route::get('/fasilitas', [FacilityController::class, 'index'])->middleware('permission:facilities.view')->name('admin.facilities.index');
        Route::get('/fasilitas/create', [FacilityController::class, 'create'])->middleware('permission:facilities.create')->name('admin.facilities.create');
        Route::post('/fasilitas', [FacilityController::class, 'store'])->middleware('permission:facilities.create')->name('admin.facilities.store');
        Route::get('/fasilitas/{facility}/edit', [FacilityController::class, 'edit'])->middleware('permission:facilities.update')->name('admin.facilities.edit');
        Route::put('/fasilitas/{facility}', [FacilityController::class, 'update'])->middleware('permission:facilities.update')->name('admin.facilities.update');
        Route::delete('/fasilitas/{facility}', [FacilityController::class, 'destroy'])->middleware('permission:facilities.delete')->name('admin.facilities.destroy');

        // Ekstrakurikuler & UKM
        Route::get('/ekstrakurikuler', [ExtracurricularController::class, 'index'])->middleware('permission:extracurriculars.view')->name('admin.extracurriculars.index');
        Route::get('/ekstrakurikuler/create', [ExtracurricularController::class, 'create'])->middleware('permission:extracurriculars.create')->name('admin.extracurriculars.create');
        Route::post('/ekstrakurikuler', [ExtracurricularController::class, 'store'])->middleware('permission:extracurriculars.create')->name('admin.extracurriculars.store');
        Route::get('/ekstrakurikuler/{extracurricular}/edit', [ExtracurricularController::class, 'edit'])->middleware('permission:extracurriculars.update')->name('admin.extracurriculars.edit');
        Route::put('/ekstrakurikuler/{extracurricular}', [ExtracurricularController::class, 'update'])->middleware('permission:extracurriculars.update')->name('admin.extracurriculars.update');
        Route::delete('/ekstrakurikuler/{extracurricular}', [ExtracurricularController::class, 'destroy'])->middleware('permission:extracurriculars.delete')->name('admin.extracurriculars.destroy');
    });

    Route::get('/settings/web', [WebSettingController::class, 'edit'])->middleware('permission:settings.web.view')->name('web-settings.edit');
    Route::post('/settings/web', [WebSettingController::class, 'update'])->middleware('permission:settings.web.update')->name('web-settings.update');

    Route::get('/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('permission:audit-logs.view')
        ->name('audit-logs.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profil', [ProfileController::class, 'edit']);
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profil', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profil', [ProfileController::class, 'destroy']);

    // Portal Mandiri: Biodata Dosen & Tendik serta Portofolio Publikasi (Bahasa Indonesia)
    Route::get('/profil/biodata', [StaffProfileSelfController::class, 'edit'])->name('profile.staff.edit');
    Route::get('/profile/staff', [StaffProfileSelfController::class, 'edit']);
    Route::put('/profil/biodata', [StaffProfileSelfController::class, 'update'])->name('profile.staff.update');
    Route::put('/profile/staff', [StaffProfileSelfController::class, 'update']);
    Route::post('/profil/biodata/sinkron-scholar', [StaffProfileSelfController::class, 'syncScholar'])->name('profile.staff.sync-scholar');
    Route::post('/profile/staff/sync-scholar', [StaffProfileSelfController::class, 'syncScholar']);
    Route::post('/profil/biodata/publikasi', [StaffProfileSelfController::class, 'storePublication'])->name('profile.staff.publications.store');
    Route::post('/profile/staff/publications', [StaffProfileSelfController::class, 'storePublication']);
    Route::put('/profil/biodata/publikasi/{publication}', [StaffProfileSelfController::class, 'updatePublication'])->name('profile.staff.publications.update');
    Route::put('/profile/staff/publications/{publication}', [StaffProfileSelfController::class, 'updatePublication']);
    Route::delete('/profil/biodata/publikasi/{publication}', [StaffProfileSelfController::class, 'destroyPublication'])->name('profile.staff.publications.destroy');
    Route::delete('/profile/staff/publications/{publication}', [StaffProfileSelfController::class, 'destroyPublication']);
});

require __DIR__.'/auth.php';
