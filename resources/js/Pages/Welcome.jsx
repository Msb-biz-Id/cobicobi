import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

// Modular Home Components (Sesuai Referensi Template Kampus Vue)
import HeroSlider from '@/Components/Home/HeroSlider';
import RectorWelcome from '@/Components/Home/RectorWelcome';
import FeaturesSection from '@/Components/Home/FeaturesSection';
import ProgramsSection from '@/Components/Home/ProgramsSection';
import StaffSection from '@/Components/Home/StaffSection';
import FacilitiesSection from '@/Components/Home/FacilitiesSection';
import ExtracurricularSection from '@/Components/Home/ExtracurricularSection';
import GalleriesSection from '@/Components/Home/GalleriesSection';
import InfoSection from '@/Components/Home/InfoSection';
import CTASection from '@/Components/Home/CTASection';

export default function Welcome({
    webSetting,
    campusSetting,
    latestPosts = [],
    upcomingEvents = [],
    latestAnnouncements = [],
    categories = [],
    studyPrograms = [],
    staffMembers = [],
    facilities = [],
    extracurriculars = [],
    galleries = [],
}) {
    const siteTitle = webSetting?.site_title || 'Institut Teknologi dan Bisnis Tuban';
    const slogan = webSetting?.slogan || 'Excellence in Technology, Business & Innovation';

    // Default urutan section jika belum dikonfigurasi di Panel Kampus
    const defaultSections = [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'welcome', enabled: true, order: 2 },
        { id: 'features', enabled: true, order: 3 },
        { id: 'programs', enabled: true, order: 4 },
        { id: 'staff', enabled: true, order: 5 },
        { id: 'facilities', enabled: true, order: 6 },
        { id: 'extracurriculars', enabled: true, order: 7 },
        { id: 'galleries', enabled: true, order: 8 },
        { id: 'info', enabled: true, order: 9 },
        { id: 'cta', enabled: true, order: 10 },
    ];

    const configuredSections = campusSetting?.home_sections && campusSetting.home_sections.length > 0
        ? campusSetting.home_sections
        : defaultSections;

    // Urutkan section berdasarkan order dan filter yang enabled
    const activeSections = [...configuredSections]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .filter((s) => s.enabled !== false);

    // Renderer untuk setiap section modular
    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'hero':
                return (
                    <HeroSlider
                        key="hero"
                        slides={campusSetting?.hero_slides}
                        stats={campusSetting?.hero_stats}
                    />
                );

            case 'welcome':
                return (
                    <RectorWelcome
                        key="welcome"
                        rectorData={{
                            rector_name: campusSetting?.rector_name,
                            rector_title: campusSetting?.rector_title,
                            rector_image_url: campusSetting?.rector_image_url,
                            rector_quote: campusSetting?.rector_quote,
                            rector_speech: campusSetting?.rector_speech,
                            rector_video_url: campusSetting?.rector_video_url,
                        }}
                    />
                );

            case 'features':
                return (
                    <FeaturesSection
                        key="features"
                        models={campusSetting?.about_development_models}
                    />
                );

            case 'programs':
                return (
                    <ProgramsSection
                        key="programs"
                        programs={studyPrograms}
                    />
                );

            case 'staff':
                return (
                    <StaffSection
                        key="staff"
                        staff={staffMembers}
                    />
                );

            case 'facilities':
                return (
                    <FacilitiesSection
                        key="facilities"
                        facilities={facilities}
                    />
                );

            case 'extracurriculars':
                return (
                    <ExtracurricularSection
                        key="extracurriculars"
                        extracurriculars={extracurriculars}
                    />
                );

            case 'galleries':
                return (
                    <GalleriesSection
                        key="galleries"
                        galleries={galleries}
                    />
                );

            case 'info':
                return (
                    <InfoSection
                        key="info"
                        posts={latestPosts}
                        events={upcomingEvents}
                        announcements={latestAnnouncements}
                    />
                );

            case 'cta':
                return (
                    <CTASection
                        key="cta"
                        siteTitle={siteTitle}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <PublicLayout>
            <Head title={`Beranda - ${siteTitle}`} />

            {/* Modular Page Builder Render */}
            <main className="min-h-screen">
                {activeSections.map((sec) => renderSection(sec.id))}
            </main>
        </PublicLayout>
    );
}
