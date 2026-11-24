<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('username', 'kongbarang')->first() ?? new User();
        $admin->name = 'Kong Barang';
        $admin->username = 'kongbarang';
        $admin->email = 'kongbarang@shop.com';
        $admin->password = 'barang123';
        $admin->role = 'admin';
        $admin->save();
    }
}