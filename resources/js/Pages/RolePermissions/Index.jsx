import { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import Pagination from '@/Components/UI/Pagination';
import {
    ShieldCheck,
    KeyRound,
    ShieldPlus,
    UserCheck,
    Plus,
    Search,
    Edit3,
    Trash2,
    Check,
    Lock,
} from 'lucide-react';
import Swal from 'sweetalert2';

const baseRoleData = {
    name: '',
    slug: '',
    description: '',
    is_active: true,
};

const basePermissionData = {
    name: '',
    slug: '',
    group_name: 'general',
    description: '',
};

export default function RolePermissionsIndex({
    roles,
    permissions,
    permissionGroups = [],
    selectedRole,
    roleOptions = [],
    permissionGroupOptions = [],
    filters = {},
    stats = {},
}) {
    const [roleSearch, setRoleSearch] = useState(filters.role_search ?? '');
    const [permissionSearch, setPermissionSearch] = useState(filters.permission_search ?? '');
    const [permissionGroup, setPermissionGroup] = useState(filters.permission_group ?? '');
    const [selectedRoleId, setSelectedRoleId] = useState(filters.selected_role_id ?? '');

    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [editingPermission, setEditingPermission] = useState(null);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

    const roleForm = useForm(baseRoleData);
    const permissionForm = useForm(basePermissionData);
    const syncPermissionForm = useForm({ _method: 'put', permission_ids: [] });

    useEffect(() => {
        setSelectedRoleId(selectedRole?.id ?? '');
        setSelectedPermissionIds(selectedRole?.permission_ids ?? []);
    }, [selectedRole?.id]);

    const queryParams = useMemo(
        () => ({
            role_search: roleSearch,
            permission_search: permissionSearch,
            permission_group: permissionGroup,
            selected_role_id: selectedRoleId || undefined,
        }),
        [permissionGroup, permissionSearch, roleSearch, selectedRoleId],
    );

    const applyRoleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('roles-permissions.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const applyPermissionFilters = (e) => {
        if (e) e.preventDefault();
        router.get(route('roles-permissions.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openCreateRole = () => {
        setEditingRole(null);
        roleForm.reset();
        roleForm.clearErrors();
        setRoleModalOpen(true);
    };

    const openEditRole = (role) => {
        setEditingRole(role);
        roleForm.setData({
            name: role.name,
            slug: role.slug,
            description: role.description ?? '',
            is_active: role.is_active,
        });
        roleForm.clearErrors();
        setRoleModalOpen(true);
    };

    const openCreatePermission = () => {
        setEditingPermission(null);
        permissionForm.reset();
        permissionForm.clearErrors();
        setPermissionModalOpen(true);
    };

    const openEditPermission = (perm) => {
        setEditingPermission(perm);
        permissionForm.setData({
            name: perm.name,
            slug: perm.slug,
            group_name: perm.group_name,
            description: perm.description ?? '',
        });
        permissionForm.clearErrors();
        setPermissionModalOpen(true);
    };

    const submitRole = (e) => {
        e.preventDefault();
        if (editingRole) {
            roleForm.put(route('roles.update', editingRole.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setRoleModalOpen(false);
                    roleForm.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Role berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
            return;
        }

        roleForm.post(route('roles.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setRoleModalOpen(false);
                roleForm.reset();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Role baru berhasil dibuat',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const submitPermission = (e) => {
        e.preventDefault();
        if (editingPermission) {
            permissionForm.put(route('permissions.update', editingPermission.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setPermissionModalOpen(false);
                    permissionForm.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Permission berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
            return;
        }

        permissionForm.post(route('permissions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setPermissionModalOpen(false);
                permissionForm.reset();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Permission baru berhasil dibuat',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const deleteRole = async (role) => {
        const result = await Swal.fire({
            title: 'Hapus Role?',
            text: `Role "${role.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (result.isConfirmed) {
            router.delete(route('roles.destroy', role.id), { preserveScroll: true });
        }
    };

    const deletePermission = async (perm) => {
        const result = await Swal.fire({
            title: 'Hapus Permission?',
            text: `Permission "${perm.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (result.isConfirmed) {
            router.delete(route('permissions.destroy', perm.id), { preserveScroll: true });
        }
    };

    const changeSelectedRole = (val) => {
        setSelectedRoleId(val);
        router.get(
            route('roles-permissions.index'),
            { ...queryParams, selected_role_id: val || undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const togglePermission = (permId) => {
        setSelectedPermissionIds((curr) =>
            curr.includes(permId)
                ? curr.filter((id) => id !== permId)
                : [...curr, permId],
        );
    };

    const submitMapping = (e) => {
        e.preventDefault();
        if (!selectedRole?.id) return;

        syncPermissionForm
            .transform(() => ({ _method: 'put', permission_ids: selectedPermissionIds }))
            .post(route('roles.permissions.sync', selectedRole.id), {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Matrix hak akses role berhasil disimpan',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Roles & Permissions" />

            <div className="space-y-6">
                <PageHeader
                    title="Roles & Authorization"
                    subtitle="Configure security roles, granular permission capabilities, and access control matrix"
                    actions={
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary" icon={KeyRound} onClick={openCreatePermission}>
                                New Permission
                            </Button>
                            <Button size="sm" variant="primary" icon={Plus} onClick={openCreateRole}>
                                New Role
                            </Button>
                        </div>
                    }
                />

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={ShieldCheck}
                        label="System Roles"
                        value={stats.roles?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={KeyRound}
                        label="Permissions"
                        value={stats.permissions?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={ShieldPlus}
                        label="Mapped Privileges"
                        value={stats.mapped?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Users with Role"
                        value={stats.users_with_known_role?.toLocaleString() ?? 0}
                    />
                </div>

                {/* Role-Permission Matrix Section */}
                <div className="surface-card p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Role Permission Matrix
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Select a role to toggle which operational capabilities are granted.
                            </p>
                        </div>

                        <div className="w-full sm:w-72">
                            <select
                                value={selectedRoleId || ''}
                                onChange={(e) => changeSelectedRole(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">Select a Role to Manage...</option>
                                {roleOptions.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} ({r.slug})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {!selectedRole ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                            Please select a role from the dropdown above to inspect and edit permissions.
                        </div>
                    ) : (
                        <form onSubmit={submitMapping} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {permissionGroups.map((group) => (
                                    <div
                                        key={group.group}
                                        className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-3 dark:border-slate-800">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                {group.group}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400">
                                                {group.permissions.length} perms
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {group.permissions.map((p) => {
                                                const checked = selectedPermissionIds.includes(p.id);
                                                return (
                                                    <label
                                                        key={p.id}
                                                        className={`flex items-center gap-2.5 rounded-xl p-2 cursor-pointer transition text-xs ${
                                                            checked
                                                                ? 'bg-indigo-50/80 text-indigo-900 font-medium dark:bg-indigo-950/30 dark:text-indigo-200'
                                                                : 'hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => togglePermission(p.id)}
                                                            className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                                                        />
                                                        <div className="min-w-0">
                                                            <span className="block truncate">{p.name}</span>
                                                            <span className="block font-mono text-[10px] text-slate-400 truncate">
                                                                {p.slug}
                                                            </span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    icon={Check}
                                    loading={syncPermissionForm.processing}
                                >
                                    Save Privileges for {selectedRole.name}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Two Column Grid for Roles and Permissions List */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Roles Table */}
                    <div className="surface-card overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <form onSubmit={applyRoleSearch} className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={roleSearch}
                                    onChange={(e) => setRoleSearch(e.target.value)}
                                    placeholder="Search roles..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3.5 pl-5 pr-3">Role Name</th>
                                        <th className="py-3.5 px-3">Users</th>
                                        <th className="py-3.5 px-3">Permissions</th>
                                        <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {roles.data.map((r) => (
                                        <tr
                                            key={r.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                        >
                                            <td className="py-3.5 pl-5 pr-3">
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {r.name}
                                                </p>
                                                <p className="font-mono text-[11px] text-slate-400">
                                                    {r.slug}
                                                </p>
                                            </td>
                                            <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                                                {r.users_count}
                                            </td>
                                            <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                                                {r.permissions_count}
                                            </td>
                                            <td className="py-3.5 pl-3 pr-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditRole(r)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                        title="Edit role"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteRole(r)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                        title="Delete role"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                            <Pagination links={roles?.links} meta={roles} />
                        </div>
                    </div>

                    {/* Permissions Table */}
                    <div className="surface-card overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2 bg-slate-50/50 dark:bg-slate-900/40">
                            <form onSubmit={applyPermissionFilters} className="relative flex-1 w-full">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={permissionSearch}
                                    onChange={(e) => setPermissionSearch(e.target.value)}
                                    placeholder="Search permissions..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </form>
                            <select
                                value={permissionGroup}
                                onChange={(e) => {
                                    setPermissionGroup(e.target.value);
                                    router.get(
                                        route('roles-permissions.index'),
                                        { ...queryParams, permission_group: e.target.value },
                                        { preserveState: true, preserveScroll: true, replace: true },
                                    );
                                }}
                                className="w-full sm:w-40 rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Groups</option>
                                {permissionGroupOptions.map((grp) => (
                                    <option key={grp} value={grp}>
                                        {grp}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3.5 pl-5 pr-3">Permission</th>
                                        <th className="py-3.5 px-3">Group</th>
                                        <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {permissions.data.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                        >
                                            <td className="py-3.5 pl-5 pr-3">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {p.name}
                                                </p>
                                                <p className="font-mono text-[11px] text-slate-400">
                                                    {p.slug}
                                                </p>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <Badge variant="neutral" size="sm">
                                                    {p.group_name}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 pl-3 pr-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditPermission(p)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                        title="Edit permission"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deletePermission(p)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                        title="Delete permission"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                            <Pagination links={permissions?.links} meta={permissions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Modal */}
            <Modal
                show={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                title={editingRole ? 'Edit Role' : 'Create New Role'}
                description="Define role identifier and permissions group"
            >
                <form onSubmit={submitRole} className="space-y-4">
                    <Input
                        label="Role Name"
                        placeholder="e.g. Content Manager"
                        value={roleForm.data.name}
                        onChange={(e) => {
                            roleForm.setData('name', e.target.value);
                            if (!editingRole) {
                                roleForm.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }
                        }}
                        error={roleForm.errors.name}
                        required
                    />

                    <Input
                        label="Slug"
                        placeholder="e.g. content-manager"
                        value={roleForm.data.slug}
                        onChange={(e) => roleForm.setData('slug', e.target.value)}
                        error={roleForm.errors.slug}
                        required
                    />

                    <Textarea
                        label="Description"
                        rows={3}
                        value={roleForm.data.description}
                        onChange={(e) => roleForm.setData('description', e.target.value)}
                        error={roleForm.errors.description}
                    />

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setRoleModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" loading={roleForm.processing}>
                            {editingRole ? 'Update Role' : 'Create Role'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Permission Modal */}
            <Modal
                show={permissionModalOpen}
                onClose={() => setPermissionModalOpen(false)}
                title={editingPermission ? 'Edit Permission' : 'Create New Permission'}
                description="Define granular permission action and scope"
            >
                <form onSubmit={submitPermission} className="space-y-4">
                    <Input
                        label="Permission Name"
                        placeholder="e.g. Publish Articles"
                        value={permissionForm.data.name}
                        onChange={(e) => {
                            permissionForm.setData('name', e.target.value);
                            if (!editingPermission) {
                                permissionForm.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^-|-$)+/g, ''));
                            }
                        }}
                        error={permissionForm.errors.name}
                        required
                    />

                    <Input
                        label="Slug (e.g. posts.publish)"
                        placeholder="e.g. posts.publish"
                        value={permissionForm.data.slug}
                        onChange={(e) => permissionForm.setData('slug', e.target.value)}
                        error={permissionForm.errors.slug}
                        required
                    />

                    <Input
                        label="Group Name (e.g. posts, media, users)"
                        placeholder="e.g. posts"
                        value={permissionForm.data.group_name}
                        onChange={(e) => permissionForm.setData('group_name', e.target.value)}
                        error={permissionForm.errors.group_name}
                        required
                    />

                    <Textarea
                        label="Description"
                        rows={2}
                        value={permissionForm.data.description}
                        onChange={(e) => permissionForm.setData('description', e.target.value)}
                        error={permissionForm.errors.description}
                    />

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setPermissionModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" loading={permissionForm.processing}>
                            {editingPermission ? 'Update Permission' : 'Create Permission'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
