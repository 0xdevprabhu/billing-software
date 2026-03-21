<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
        ]);

        \App\Models\Product::insert([
            ['name' => 'Product A', 'description' => 'Description for Product A', 'price' => 150.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Product B', 'description' => 'Description for Product B', 'price' => 200.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Product C', 'description' => 'Description for Product C', 'price' => 50.00, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Product D', 'description' => 'Description for Product D', 'price' => 300.00, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
