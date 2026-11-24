<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop', 'description' => 'Fast laptop for students', 'price' => 650, 'emoji' => '💻'],
            ['name' => 'Smartphone', 'description' => '128GB, dual camera', 'price' => 320, 'emoji' => '📱'],
            ['name' => 'Headphones', 'description' => 'Wireless, noise cancelling', 'price' => 45, 'emoji' => '🎧'],
            ['name' => 'Backpack', 'description' => 'Waterproof, 20L', 'price' => 25, 'emoji' => '🎒'],
            ['name' => 'Sneakers', 'description' => 'Comfortable daily shoes', 'price' => 38, 'emoji' => '👟'],
            ['name' => 'Watch', 'description' => 'Smart watch with heart rate', 'price' => 75, 'emoji' => '⌚'],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}