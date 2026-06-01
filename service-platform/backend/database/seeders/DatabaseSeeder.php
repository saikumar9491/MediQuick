<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a provider
        $provider = User::create([
            'name' => 'John ServicePro',
            'email' => 'provider@example.com',
            'phone' => '1234567890',
            'password' => Hash::make('password'),
            'role' => 'provider',
        ]);

        // Create some services
        Service::create([
            'provider_id' => $provider->id,
            'service_name' => 'Professional Home Cleaning',
            'price' => '49.99',
            'category' => 'Cleaning',
            'description' => 'Deep cleaning for your entire home including kitchen and bathrooms.',
            'rating' => 4.8,
            'reviews_count' => 124,
            'image_url' => 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800',
        ]);

        Service::create([
            'provider_id' => $provider->id,
            'service_name' => 'Expert Electrician',
            'price' => '35.00',
            'category' => 'Electrician',
            'description' => 'Fixing short circuits, installing new points, and general maintenance.',
            'rating' => 4.9,
            'reviews_count' => 89,
            'image_url' => 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
        ]);

        Service::create([
            'provider_id' => $provider->id,
            'service_name' => 'Emergency Plumbing',
            'price' => '40.00',
            'category' => 'Plumbing',
            'description' => 'Leaky pipes, clogged drains, and bathroom fittings fixed instantly.',
            'rating' => 4.7,
            'reviews_count' => 56,
            'image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        ]);
    }
}
