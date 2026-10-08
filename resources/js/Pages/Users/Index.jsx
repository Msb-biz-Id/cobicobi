import { useEffect, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import Modal from '@/Components/UI/Modal';
import {
    Users,
    UserCheck,
    UserX,
    UserCog,
    Plus,
    Search,
    Edit3,
    Trash2,
    Shield,
    Upload,
} from 'lucide-react';
import Swal from 'sweetalert2';

const defaultCreateData = {
    name: '',
    email: '',
    phone_number: '',
    gender: 'male',
    profile_photo: null,
    role: '',
    is_active: true,
    password: '',
    password_confirmation: '',
};

const defaultEditData = {
    _method: 'put',
    name: '',
    email: '',
    phone_number: '',
    gender: 'male',
    profile_photo: null,
    role: '',
    is_active: true,
    password: '',
    password_confirmation: '',
};

export default function UsersIndex({ users, filters = {}, stats = {}, roles = [] }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [search, setSearch] = useState(filters.search ?? '');
    const [roleFilter, setRoleFilter] = useState(filters.role ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    const createForm = useForm(defaultCreateData);
    const editForm = useForm(defaultEditData);
    const defaultRole = roles?.[0]?.value ?? 'editor';

    useEffect(() => {
        if (!createForm.data.role) {
            createForm.setData('role', defaultRole);
        }
    }, [defaultRole]);

    const applyFilters = (e) => {
        if (e) e.preventDefault();
        router.get(
            route('users.index'),
            { search, role: roleFilter, status: statusFilter },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setRoleFilter('');
        setStatusFilter('');
        router.get(route('users.index'), {}, { preserveScroll: true, preserveState: true, replace: true });
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'User berhasil ditambahkan',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const openEdit = (user) => {
        setEditingUser(user);
        editForm.setData({
            ...defaultEditData,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number ?? '',
            gender: user.gender ?? 'male',
            role: user.role,
            is_active: user.is_active,
        });
        editForm.clearErrors();
        setEditOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.post(route('users.update', editingUser.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setEditOpen(false);
                setEditingUser(null);
                editForm.reset();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'User berhasil diperbarui',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const confirmDelete = async (user) => {
        const result = await Swal.fire({
            title: 'Hapus User?',
            text: `User ${user.name} akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (!result.isConfirmed) return;

        router.delete(route('users.destroy', user.id), { preserveScroll: true });
    };

    const roleBadgeVariant = (role) => {
        switch (role?.toLowerCase()) {
            case 'superadmin':
                return 'danger';
            case 'admin':
                return 'warning';
            case 'editor':
                return 'indigo';
            case 'author':
                return 'success';
            default:
                return 'neutral';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Staff & Users" />

            <div className="space-y-6">
                <PageHeader
                    title="User Management"
                    subtitle="Manage administrative accounts, role privileges, access permissions and profile security"
                    actions={
                        <Button
                            size="sm"
                            variant="primary"
                            icon={Plus}
                            onClick={() => {
                                createForm.reset();
                                createForm.setData('role', defaultRole);
                                createForm.clearErrors();
                                setCreateOpen(true);
                            }}
                        >
                            New User
                        </Button>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Total Accounts"
                        value={stats.total?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Active Staff"
                        value={stats.active?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={UserX}
                        label="Suspended Accounts"
                        value={stats.inactive?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={UserCog}
                        label="Admin & Superadmin"
                        value={stats.admin?.toLocaleString() ?? 0}
                    />
                </div>

                {/* Main Card */}
                <div className="surface-card overflow-hidden">
                    {/* Filters Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <form onSubmit={applyFilters} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                            <div className="relative sm:col-span-2">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="text"
                                    placeholder="Search name, email, phone number..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Roles</option>
                                {roles.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <Button type="submit" size="sm" variant="secondary">
                                    Filter
                                </Button>
                                {(search || roleFilter || statusFilter) && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    {users?.data?.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={Users}
                                title="No users found"
                                description="Try adjusting search terms or filters."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3.5 pl-5 pr-3">User & Profile</th>
                                        <th className="py-3.5 px-3">Contact</th>
                                        <th className="py-3.5 px-3">Role</th>
                                        <th className="py-3.5 px-3">Status</th>
                                        <th className="py-3.5 px-3">Joined Date</th>
                                        <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                        >
                                            <td className="py-3.5 pl-5 pr-3">
                                                <div className="flex items-center gap-3">
                                                    {user.profile_photo_url ? (
                                                        <img
                                                            src={user.profile_photo_url}
                                                            alt={user.name}
                                                            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                                        />
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                            {user.name.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-[11px] font-mono text-slate-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                                                {user.phone_number ? (
                                                    <span className="font-mono text-[11px]">
                                                        {user.phone_number}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <Badge variant={roleBadgeVariant(user.role)} size="sm">
                                                    {user.role}
                                                </Badge>
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <Badge
                                                    variant={user.is_active ? 'success' : 'neutral'}
                                                    size="sm"
                                                >
                                                    {user.is_active ? 'Active' : 'Disabled'}
                                                </Badge>
                                            </td>

                                            <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                                {user.created_at}
                                            </td>

                                            <td className="py-3.5 pl-3 pr-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(user)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                        title="Edit user"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => confirmDelete(user)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                        title="Delete user"
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
                    )}

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                        <Pagination links={users?.links} meta={users} />
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                show={createOpen}
                onClose={() => setCreateOpen(false)}
                title="Create New User Account"
                description="Assign role permissions and credentials for staff members"
            >
                <form onSubmit={submitCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                            error={createForm.errors.name}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={createForm.data.email}
                            onChange={(e) => createForm.setData('email', e.target.value)}
                            error={createForm.errors.email}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            placeholder="08xxxxxxxxxx"
                            value={createForm.data.phone_number}
                            onChange={(e) => createForm.setData('phone_number', e.target.value)}
                            error={createForm.errors.phone_number}
                        />
                        <Select
                            label="Gender"
                            value={createForm.data.gender}
                            onChange={(e) => createForm.setData('gender', e.target.value)}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Assigned Role"
                            value={createForm.data.role}
                            onChange={(e) => createForm.setData('role', e.target.value)}
                            options={roles.map((r) => ({ value: r.value, label: r.label }))}
                        />
                        <Select
                            label="Account Status"
                            value={createForm.data.is_active ? '1' : '0'}
                            onChange={(e) => createForm.setData('is_active', e.target.value === '1')}
                            options={[
                                { value: '1', label: 'Active (Can login)' },
                                { value: '0', label: 'Inactive (Suspended)' },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Password"
                            type="password"
                            value={createForm.data.password}
                            onChange={(e) => createForm.setData('password', e.target.value)}
                            error={createForm.errors.password}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            value={createForm.data.password_confirmation}
                            onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Profile Avatar (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => createForm.setData('profile_photo', e.target.files?.[0] ?? null)}
                            className="w-full rounded-xl border border-slate-200 bg-white text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 dark:border-slate-800 dark:bg-slate-900"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" loading={createForm.processing}>
                            Create Account
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={editOpen}
                onClose={() => setEditOpen(false)}
                title={`Edit User: ${editingUser?.name}`}
                description="Update user credentials, assigned privileges and account state"
            >
                <form onSubmit={submitEdit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            error={editForm.errors.name}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                            error={editForm.errors.email}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            value={editForm.data.phone_number}
                            onChange={(e) => editForm.setData('phone_number', e.target.value)}
                            error={editForm.errors.phone_number}
                        />
                        <Select
                            label="Gender"
                            value={editForm.data.gender}
                            onChange={(e) => editForm.setData('gender', e.target.value)}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Assigned Role"
                            value={editForm.data.role}
                            onChange={(e) => editForm.setData('role', e.target.value)}
                            options={roles.map((r) => ({ value: r.value, label: r.label }))}
                        />
                        <Select
                            label="Account Status"
                            value={editForm.data.is_active ? '1' : '0'}
                            onChange={(e) => editForm.setData('is_active', e.target.value === '1')}
                            options={[
                                { value: '1', label: 'Active (Can login)' },
                                { value: '0', label: 'Inactive (Suspended)' },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="New Password (Leave blank to keep)"
                            type="password"
                            value={editForm.data.password}
                            onChange={(e) => editForm.setData('password', e.target.value)}
                            error={editForm.errors.password}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={editForm.data.password_confirmation}
                            onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Update Profile Avatar
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => editForm.setData('profile_photo', e.target.files?.[0] ?? null)}
                            className="w-full rounded-xl border border-slate-200 bg-white text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 dark:border-slate-800 dark:bg-slate-900"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" loading={editForm.processing}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
