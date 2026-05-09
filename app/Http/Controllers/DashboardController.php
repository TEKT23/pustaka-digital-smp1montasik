<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Student;
use App\Models\Attendance;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Keep today's count real-time as it's a simple lightweight query
        $todayCount = Attendance::whereDate('scanned_at', now())->count();
        
        // Cache heavy aggregation queries for 10 minutes to save server RAM/CPU in serverless environment
        $weekCount = \Illuminate\Support\Facades\Cache::remember('dashboard_week_count', 600, function () {
            return Attendance::whereBetween('scanned_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
        });
        
        // Data for chart (last 30 days)
        $chartData = \Illuminate\Support\Facades\Cache::remember('dashboard_chart_data', 600, function () {
            return Attendance::select(DB::raw('DATE(scanned_at) as date'), DB::raw('count(*) as count'))
                ->where('scanned_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get()
                ->toArray();
        });

        // Leaderboard
        $leaderboard = \Illuminate\Support\Facades\Cache::remember('dashboard_leaderboard', 600, function () {
            return Student::select('id', 'name', 'class')
                ->withCount('attendances')
                ->orderBy('attendances_count', 'desc')
                ->take(5)
                ->get()
                ->toArray();
        });

        return Inertia::render('Dashboard', [
            'todayCount' => $todayCount,
            'weekCount' => $weekCount,
            'chartData' => $chartData,
            'leaderboard' => $leaderboard,
        ]);
    }
}
