<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Student;
use App\Models\Attendance;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class AttendanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Scanner');
    }

    public function scan(Request $request)
    {
        $request->validate([
            'nis' => 'required|string',
        ]);

        // Select only necessary fields to reduce memory usage and payload size
        $student = Student::select('id', 'name', 'class')->where('nis', $request->nis)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan!',
            ], 404);
        }

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'scanned_at' => now(),
        ]);

        // Invalidate Dashboard Cache
        Cache::forget('dashboard_week_count');
        Cache::forget('dashboard_chart_data');
        Cache::forget('dashboard_leaderboard');

        return response()->json([
            'success' => true,
            'student' => $student,
            'message' => 'Selamat Datang, ' . $student->name . '!',
        ]);
    }

    public function logs()
    {
        // Eager load only necessary fields for student
        $attendances = Attendance::with('student:id,nis,name,class')
            ->orderBy('scanned_at', 'desc')
            ->paginate(15);

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
        ]);
    }
}
