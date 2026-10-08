<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Superadmin',
                'slug' => 'superadmin',
                'description' => 'Akses penuh ke seluruh modul CMS',
                'is_active' => true,
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Kelola konten dan pengguna',
                'is_active' => true,
            ],
            [
                'name' => 'Editor',
                'slug' => 'editor',
                'description' => 'Review dan publish konten',
                'is_active' => true,
            ],
            [
                'name' => 'Author',
                'slug' => 'author',
                'description' => 'Membuat dan mengedit konten miliknya',
                'is_active' => true,
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'description' => 'Akses baca dashboard dan laporan',
                'is_active' => true,
            ],
            [
                'name' => 'Dosen',
                'slug' => 'dosen',
                'description' => 'Dosen / Tenaga Pendidik (Akses edit profil bio, portofolio & publikasi ilmiah)',
                'is_active' => true,
            ],
            [
                'name' => 'Tenaga Kependidikan',
                'slug' => 'tendik',
                'description' => 'Tenaga Kependidikan / Staf Akademik & Administrasi',
                'is_active' => true,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::query()->updateOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        $permissions = [
            ['name' => 'Dashboard View', 'slug' => 'dashboard.view', 'group_name' => 'dashboard'],
            ['name' => 'User View', 'slug' => 'users.view', 'group_name' => 'users'],
            ['name' => 'User Create', 'slug' => 'users.create', 'group_name' => 'users'],
            ['name' => 'User Update', 'slug' => 'users.update', 'group_name' => 'users'],
            ['name' => 'User Delete', 'slug' => 'users.delete', 'group_name' => 'users'],
            ['name' => 'Role View', 'slug' => 'roles.view', 'group_name' => 'roles'],
            ['name' => 'Role Create', 'slug' => 'roles.create', 'group_name' => 'roles'],
            ['name' => 'Role Update', 'slug' => 'roles.update', 'group_name' => 'roles'],
            ['name' => 'Role Delete', 'slug' => 'roles.delete', 'group_name' => 'roles'],
            ['name' => 'Permission View', 'slug' => 'permissions.view', 'group_name' => 'permissions'],
            ['name' => 'Permission Create', 'slug' => 'permissions.create', 'group_name' => 'permissions'],
            ['name' => 'Permission Update', 'slug' => 'permissions.update', 'group_name' => 'permissions'],
            ['name' => 'Permission Delete', 'slug' => 'permissions.delete', 'group_name' => 'permissions'],
            ['name' => 'Web Settings View', 'slug' => 'settings.web.view', 'group_name' => 'settings'],
            ['name' => 'Web Settings Update', 'slug' => 'settings.web.update', 'group_name' => 'settings'],
            ['name' => 'Blog Post View', 'slug' => 'posts.view', 'group_name' => 'posts'],
            ['name' => 'Blog Post Create', 'slug' => 'posts.create', 'group_name' => 'posts'],
            ['name' => 'Blog Post Update', 'slug' => 'posts.update', 'group_name' => 'posts'],
            ['name' => 'Blog Post Delete', 'slug' => 'posts.delete', 'group_name' => 'posts'],
            ['name' => 'Category View', 'slug' => 'categories.view', 'group_name' => 'posts'],
            ['name' => 'Category Create', 'slug' => 'categories.create', 'group_name' => 'posts'],
            ['name' => 'Category Update', 'slug' => 'categories.update', 'group_name' => 'posts'],
            ['name' => 'Category Delete', 'slug' => 'categories.delete', 'group_name' => 'posts'],
            ['name' => 'Hashtag View', 'slug' => 'hashtags.view', 'group_name' => 'posts'],
            ['name' => 'Hashtag Create', 'slug' => 'hashtags.create', 'group_name' => 'posts'],
            ['name' => 'Hashtag Update', 'slug' => 'hashtags.update', 'group_name' => 'posts'],
            ['name' => 'Hashtag Delete', 'slug' => 'hashtags.delete', 'group_name' => 'posts'],
            ['name' => 'Page View', 'slug' => 'pages.view', 'group_name' => 'pages'],
            ['name' => 'Page Create', 'slug' => 'pages.create', 'group_name' => 'pages'],
            ['name' => 'Page Update', 'slug' => 'pages.update', 'group_name' => 'pages'],
            ['name' => 'Page Delete', 'slug' => 'pages.delete', 'group_name' => 'pages'],
            ['name' => 'Media View', 'slug' => 'media.view', 'group_name' => 'media'],
            ['name' => 'Media Upload', 'slug' => 'media.upload', 'group_name' => 'media'],
            ['name' => 'Media Delete', 'slug' => 'media.delete', 'group_name' => 'media'],
            ['name' => 'Menu View', 'slug' => 'menus.view', 'group_name' => 'menus'],
            ['name' => 'Menu Update', 'slug' => 'menus.update', 'group_name' => 'menus'],
            ['name' => 'Notification View', 'slug' => 'notifications.view', 'group_name' => 'notifications'],
            ['name' => 'Notification Create', 'slug' => 'notifications.create', 'group_name' => 'notifications'],
            ['name' => 'Notification Update', 'slug' => 'notifications.update', 'group_name' => 'notifications'],
            ['name' => 'Notification Delete', 'slug' => 'notifications.delete', 'group_name' => 'notifications'],
            ['name' => 'Audit Log View', 'slug' => 'audit-logs.view', 'group_name' => 'audit'],
            ['name' => 'Contact Message View', 'slug' => 'contact-messages.view', 'group_name' => 'contact-messages'],
            ['name' => 'Contact Message Update', 'slug' => 'contact-messages.update', 'group_name' => 'contact-messages'],
            ['name' => 'Contact Message Delete', 'slug' => 'contact-messages.delete', 'group_name' => 'contact-messages'],
            ['name' => 'Analytics View', 'slug' => 'analytics.view', 'group_name' => 'analytics'],
            ['name' => 'Message View', 'slug' => 'messages.view', 'group_name' => 'messages'],
            ['name' => 'Event View', 'slug' => 'events.view', 'group_name' => 'events'],
            ['name' => 'Event Create', 'slug' => 'events.create', 'group_name' => 'events'],
            ['name' => 'Event Update', 'slug' => 'events.update', 'group_name' => 'events'],
            ['name' => 'Event Delete', 'slug' => 'events.delete', 'group_name' => 'events'],
            ['name' => 'Announcement View', 'slug' => 'announcements.view', 'group_name' => 'announcements'],
            ['name' => 'Announcement Create', 'slug' => 'announcements.create', 'group_name' => 'announcements'],
            ['name' => 'Announcement Update', 'slug' => 'announcements.update', 'group_name' => 'announcements'],
            ['name' => 'Announcement Delete', 'slug' => 'announcements.delete', 'group_name' => 'announcements'],
            ['name' => 'Staff Directory View', 'slug' => 'staff.view', 'group_name' => 'staff'],
            ['name' => 'Staff Directory Create', 'slug' => 'staff.create', 'group_name' => 'staff'],
            ['name' => 'Staff Directory Update', 'slug' => 'staff.update', 'group_name' => 'staff'],
            ['name' => 'Staff Directory Delete', 'slug' => 'staff.delete', 'group_name' => 'staff'],
            ['name' => 'Structural Position View', 'slug' => 'structural-positions.view', 'group_name' => 'academic'],
            ['name' => 'Structural Position Create', 'slug' => 'structural-positions.create', 'group_name' => 'academic'],
            ['name' => 'Structural Position Update', 'slug' => 'structural-positions.update', 'group_name' => 'academic'],
            ['name' => 'Structural Position Delete', 'slug' => 'structural-positions.delete', 'group_name' => 'academic'],
            ['name' => 'Faculty View', 'slug' => 'faculties.view', 'group_name' => 'academic'],
            ['name' => 'Faculty Create', 'slug' => 'faculties.create', 'group_name' => 'academic'],
            ['name' => 'Faculty Update', 'slug' => 'faculties.update', 'group_name' => 'academic'],
            ['name' => 'Faculty Delete', 'slug' => 'faculties.delete', 'group_name' => 'academic'],
            ['name' => 'Study Program View', 'slug' => 'study-programs.view', 'group_name' => 'academic'],
            ['name' => 'Study Program Create', 'slug' => 'study-programs.create', 'group_name' => 'academic'],
            ['name' => 'Study Program Update', 'slug' => 'study-programs.update', 'group_name' => 'academic'],
            ['name' => 'Study Program Delete', 'slug' => 'study-programs.delete', 'group_name' => 'academic'],
            ['name' => 'Institutional Unit View', 'slug' => 'institutional-units.view', 'group_name' => 'academic'],
            ['name' => 'Institutional Unit Create', 'slug' => 'institutional-units.create', 'group_name' => 'academic'],
            ['name' => 'Institutional Unit Update', 'slug' => 'institutional-units.update', 'group_name' => 'academic'],
            ['name' => 'Institutional Unit Delete', 'slug' => 'institutional-units.delete', 'group_name' => 'academic'],
            ['name' => 'Facility View', 'slug' => 'facilities.view', 'group_name' => 'facilities'],
            ['name' => 'Facility Create', 'slug' => 'facilities.create', 'group_name' => 'facilities'],
            ['name' => 'Facility Update', 'slug' => 'facilities.update', 'group_name' => 'facilities'],
            ['name' => 'Facility Delete', 'slug' => 'facilities.delete', 'group_name' => 'facilities'],
            ['name' => 'Extracurricular View', 'slug' => 'extracurriculars.view', 'group_name' => 'extracurriculars'],
            ['name' => 'Extracurricular Create', 'slug' => 'extracurriculars.create', 'group_name' => 'extracurriculars'],
            ['name' => 'Extracurricular Update', 'slug' => 'extracurriculars.update', 'group_name' => 'extracurriculars'],
            ['name' => 'Extracurricular Delete', 'slug' => 'extracurriculars.delete', 'group_name' => 'extracurriculars'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::query()->updateOrCreate(
                ['slug' => $permissionData['slug']],
                [
                    ...$permissionData,
                    'description' => $permissionData['name'],
                ]
            );
        }

        $allPermissionIds = Permission::query()->pluck('id')->all();
        $viewerPermissionIds = Permission::query()
            ->whereIn('slug', [
                'dashboard.view',
                'analytics.view',
                'messages.view',
                'posts.view',
                'categories.view',
                'hashtags.view',
                'pages.view',
                'media.view',
                'users.view',
                'roles.view',
                'permissions.view',
                'settings.web.view',
                'menus.view',
                'events.view',
                'announcements.view',
                'staff.view',
            ])
            ->pluck('id')
            ->all();
        $authorPermissionIds = Permission::query()
            ->whereIn('slug', [
                'dashboard.view',
                'posts.view',
                'posts.create',
                'posts.update',
                'categories.view',
                'hashtags.view',
                'pages.view',
                'media.view',
                'media.upload',
                'events.view',
                'events.create',
                'events.update',
                'announcements.view',
                'announcements.create',
                'announcements.update',
                'staff.view',
            ])
            ->pluck('id')
            ->all();
        $editorPermissionIds = Permission::query()
            ->whereIn('slug', [
                'dashboard.view',
                'posts.view',
                'posts.create',
                'posts.update',
                'posts.delete',
                'categories.view',
                'categories.create',
                'categories.update',
                'categories.delete',
                'hashtags.view',
                'hashtags.create',
                'hashtags.update',
                'hashtags.delete',
                'pages.view',
                'pages.create',
                'pages.update',
                'pages.delete',
                'media.view',
                'media.upload',
                'media.delete',
                'messages.view',
                'analytics.view',
                'events.view',
                'events.create',
                'events.update',
                'events.delete',
                'announcements.view',
                'announcements.create',
                'announcements.update',
                'announcements.delete',
                'staff.view',
                'staff.create',
                'staff.update',
            ])
            ->pluck('id')
            ->all();

        $dosenPermissionIds = Permission::query()
            ->whereIn('slug', [
                'dashboard.view',
                'media.view',
                'media.upload',
                'staff.view',
            ])
            ->pluck('id')
            ->all();

        $adminPermissionIds = Permission::query()
            ->whereNotIn('slug', ['roles.delete', 'permissions.delete', 'audit-logs.view'])
            ->pluck('id')
            ->all();

        Role::query()->where('slug', 'superadmin')->first()?->permissions()->sync($allPermissionIds);
        Role::query()->where('slug', 'admin')->first()?->permissions()->sync($adminPermissionIds);
        Role::query()->where('slug', 'editor')->first()?->permissions()->sync($editorPermissionIds);
        Role::query()->where('slug', 'author')->first()?->permissions()->sync($authorPermissionIds);
        Role::query()->where('slug', 'viewer')->first()?->permissions()->sync($viewerPermissionIds);
        Role::query()->where('slug', 'dosen')->first()?->permissions()->sync($dosenPermissionIds);
        Role::query()->where('slug', 'tendik')->first()?->permissions()->sync($dosenPermissionIds);
    }
}
