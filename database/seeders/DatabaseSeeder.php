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
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Pustaka',
            'email' => 'admin@pustaka.com',
            'password' => bcrypt('password'),
        ]);

        \App\Models\Student::factory(50)->create()->each(function ($student) {
            // Randomly create 1-10 attendance records for each student
            \App\Models\Attendance::factory(rand(1, 10))->create([
                'student_id' => $student->id,
                'scanned_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
            ]);
        });
    }
}
