import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AppSidebar from '@/Components/Layout/AppSidebar';
import AppHeader from '@/Components/Layout/AppHeader';
import CommandPalette from '@/Components/Layout/CommandPalette';
import Swal from 'sweetalert2';

export default function AuthenticatedLayout({ children }) {
    const { flash } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Toast notifications on flash message
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: flash.success,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
        if (flash?.error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: flash.error,
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
        }
    }, [flash]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800 antialiased dark:bg-[#090d16] dark:text-slate-100">
            {/* Sidebar */}
            <AppSidebar
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
                isMobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            {/* Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <AppHeader
                    onOpenMobileSidebar={() => setMobileOpen(true)}
                    onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>

            {/* Command Palette (Cmd + K) */}
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={(toggle) => {
                    if (toggle === true) setCommandPaletteOpen((prev) => !prev);
                    else setCommandPaletteOpen(false);
                }}
            />
        </div>
    );
}
