<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nis' => $this->faker->unique()->numerify('##########'),
            'name' => $this->faker->name(),
            'class' => $this->faker->randomElement(['7A', '7B', '8A', '8B', '9A', '9B']),
            'address' => $this->faker->address(),
            'photo_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $this->faker->userName(),
        ];
    }
}
