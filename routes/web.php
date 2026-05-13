<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DashboardController;

Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/', function () {
    return redirect()->route('login');
});

// Kiosk Mode (Scanner) - Accessible if authenticated (or you can make it public if needed)
Route::middleware(['auth'])->group(function () {
    Route::get('/scanner', [AttendanceController::class, 'index'])->name('scanner');
    Route::post('/api/scan', [AttendanceController::class, 'scan'])->name('api.scan');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::patch('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    Route::get('/attendances', [AttendanceController::class, 'logs'])->name('attendances.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
