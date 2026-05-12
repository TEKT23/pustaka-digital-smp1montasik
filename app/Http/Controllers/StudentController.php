<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
        }

        if ($request->class) {
            $query->where('class', $request->class);
        }

        // Select only necessary fields
        $students = $query->select('id', 'nis', 'nisn', 'name', 'class', 'address', 'birth_place', 'birth_date')
            ->orderBy('name', 'asc')
            ->paginate(15)->withQueryString();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'class']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students',
            'nisn' => 'nullable|string',
            'name' => 'required|string',
            'class' => 'nullable|string',
            'address' => 'nullable|string',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date|before:today',
        ]);

        Student::create($validated);
        
        // Clear dashboard cache to update stats
        Cache::forget('dashboard_leaderboard');

        return redirect()->back()->with('success', 'Siswa berhasil ditambahkan!');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis,' . $student->id,
            'nisn' => 'nullable|string',
            'name' => 'required|string',
            'class' => 'nullable|string',
            'address' => 'nullable|string',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date|before:today',
        ]);

        $student->update($validated);

        // Clear leaderboard cache in case name/class changed
        Cache::forget('dashboard_leaderboard');

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui!');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        // Clear leaderboard cache as student is removed
        Cache::forget('dashboard_leaderboard');

        return redirect()->back()->with('success', 'Siswa berhasil dihapus!');
    }
}
