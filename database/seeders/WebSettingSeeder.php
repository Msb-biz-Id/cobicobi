<?php

namespace Database\Seeders;

use App\Models\WebSetting;
use Illuminate\Database\Seeder;

class WebSettingSeeder extends Seeder
{
    /**
     * Seed a default web identity so branding is never empty.
     */
    public function run(): void
    {
        $setting = WebSetting::query()->first() ?? new WebSetting();
        $setting->fill([
            'site_title' => 'Institut Teknologi dan Bisnis Tuban',
            'slogan' => 'Excellence in Technology, Business & Innovation',
            'short_description' => 'Pusat keunggulan akademik, riset teknologi terapan, dan pengembangan talenta kepemimpinan global berlandaskan integritas dan tridharma perguruan tinggi.',
            'address' => 'Jl. Manunggal No. 61, Sukolilo, Kec. Tuban, Kabupaten Tuban, Jawa Timur 62319',
            'city' => 'Tuban',
            'province' => 'Jawa Timur',
            'country' => 'Indonesia',
            'postal_code' => '62319',
            'contact_phone' => '(0356) 321876',
            'contact_email' => 'info@itbtuban.ac.id',
            'whatsapp_number' => '081234567890',
            'google_maps_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126715.4852656972!2d112.0135763!3d-6.8943187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e779a1f970bb513%3A0x3027a76e352bb40!2sTuban%2C%20Tuban%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
            'instagram_url' => 'https://instagram.com/itbtuban',
            'youtube_url' => 'https://youtube.com/@itbtuban',
            'facebook_url' => 'https://facebook.com/itbtuban',
            'x_url' => 'https://x.com/itbtuban',
        ]);
        $setting->save();
    }
}
