<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class SuperProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            ['name' => 'Premium Laptop Pro', 'description' => 'High-performance laptop for professionals with 32GB RAM.', 'price' => 1299.99],
            ['name' => 'Wireless Noise-Canceling Headphones', 'description' => 'Immersive studio audio with active noise cancellation.', 'price' => 299.00],
            ['name' => 'Smartwatch Series X', 'description' => 'Advanced health tracking, ECG, and smartphone notifications.', 'price' => 399.50],
            ['name' => 'Mechanical Gaming Keyboard', 'description' => 'Customizable RGB backlit mechanical keyboard with tactile switches.', 'price' => 129.99],
            ['name' => 'Ultra-Slim Wireless Mouse', 'description' => 'Ergonomic multi-device mouse with laser tracking.', 'price' => 59.99],
            ['name' => '4K Ultra HD Monitor', 'description' => '32-inch borderless monitor with HDR10 support.', 'price' => 450.00],
            ['name' => 'Smartphone Pro Max', 'description' => 'Latest flagship smartphone with revolutionary triple camera.', 'price' => 1099.00],
            ['name' => 'Tablet Stylus Edition', 'description' => 'Perfect for digital artists and note-takers, 120Hz display.', 'price' => 799.00],
            ['name' => 'Portable NVMe SSD 2TB', 'description' => 'Lightning fast file transfers up to 1050MB/s.', 'price' => 249.99],
            ['name' => 'Wireless Charging Pad', 'description' => 'Fast 15W wireless charger with safety protection.', 'price' => 35.00],
            ['name' => 'Bluetooth Surround Speaker', 'description' => '360 degree sound, waterproof, 20-hour battery life.', 'price' => 149.95],
            ['name' => 'Fitness Action Camera', 'description' => '4K 60fps action recording with hyper-smooth stabilization.', 'price' => 299.99],
            ['name' => 'Gaming Console NextGen', 'description' => 'Ultimate gaming experience with ray tracing and 4K graphics.', 'price' => 499.00],
            ['name' => 'Smart Home Controller Hub', 'description' => 'Control all your smart devices seamlessly from one touch panel.', 'price' => 99.00],
            ['name' => 'LED Smart Desk Lamp', 'description' => 'Adjustable color temperature lamp with voice control.', 'price' => 45.50],
            ['name' => 'Ergonomic Office Chair', 'description' => 'Premium lumbar support chair with breathable mesh.', 'price' => 299.00],
            ['name' => 'Standing Desk Automatic', 'description' => 'Motorized height adjustable desk with memory presets.', 'price' => 550.00],
            ['name' => 'USB-C Docking Station', 'description' => '10-in-1 massive expansion dock with dual HDMI.', 'price' => 89.99],
            ['name' => 'Webcam 1080p AI Tracking', 'description' => 'Auto framing streaming camera with dual microphones.', 'price' => 119.00],
            ['name' => 'Studio Condenser Mic', 'description' => 'High-fidelity podcast microphone with shock mount.', 'price' => 179.99],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}
