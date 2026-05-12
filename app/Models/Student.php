<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['nis', 'nisn', 'name', 'class', 'address', 'photo_url', 'birth_place', 'birth_date'];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
