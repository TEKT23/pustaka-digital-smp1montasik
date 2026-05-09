import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function Dashboard({ todayCount, weekCount, chartData, leaderboard }) {
    
    // Format tanggal untuk chart agar lebih mudah dibaca (misal: 2026-05-09 jadi 09 Mei)
    const rawChartData = Array.isArray(chartData) ? chartData : Object.values(chartData || {});
    const formattedChartData = rawChartData.map(data => {
        const dateStr = data?.date;
        if (!dateStr) return { ...data, formattedDate: 'Unknown' };
        
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return { ...data, formattedDate: dateStr };

        const day = dateObj.getDate().toString().padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        const month = monthNames[dateObj.getMonth() || 0];
        return {
            ...data,
            formattedDate: `${day} ${month}`
        };
    });

    const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : Object.values(leaderboard || {});

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800">
                    Dashboard Statistik Pustaka
                </h2>
            }
        >
            <Head title="Dashboard Statistik" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Bagian Kartu Ringkasan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kartu Hari Ini */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex items-center p-6">
                            <div className="p-4 rounded-full bg-blue-100 text-blue-600 mr-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-500">Total Pengunjung Hari Ini</h3>
                                <p className="text-4xl font-black text-gray-800 mt-1">{todayCount} <span className="text-lg font-normal text-gray-500">siswa</span></p>
                            </div>
                        </div>

                        {/* Kartu Minggu Ini */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex items-center p-6">
                            <div className="p-4 rounded-full bg-green-100 text-green-600 mr-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-500">Total Pengunjung Minggu Ini</h3>
                                <p className="text-4xl font-black text-gray-800 mt-1">{weekCount} <span className="text-lg font-normal text-gray-500">siswa</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Bagian Grafik */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Grafik Kunjungan (30 Hari Terakhir)</h3>
                                <p className="text-gray-500 text-sm mt-1">Grafik ini menunjukkan jumlah siswa yang hadir ke pustaka setiap harinya.</p>
                            </div>
                            
                            <div className="h-80 w-full">
                                {formattedChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis 
                                                dataKey="formattedDate" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                formatter={(value) => [`${value} Siswa`, 'Kunjungan']}
                                                labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                                            />
                                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <p>Belum ada data kunjungan untuk ditampilkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bagian Peringkat / Leaderboard */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2.25a.75.75 0 01.707.526l2.126 6.376 6.702.008a.75.75 0 01.442 1.358l-5.419 3.935 2.071 6.375a.75.75 0 01-1.155.839L10 17.728l-5.474 3.939a.75.75 0 01-1.155-.84l2.07-6.374-5.418-3.936a.75.75 0 01.442-1.358l6.702-.008 2.126-6.376A.75.75 0 0110 2.25z" clipRule="evenodd" />
                                    </svg>
                                    Siswa Terajin (Top 5)
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Daftar siswa yang paling sering mengunjungi pustaka.</p>
                            </div>

                            {safeLeaderboard.length > 0 ? (
                                <div className="space-y-4">
                                    {safeLeaderboard.map((student, index) => {
                                        // Menentukan warna badge berdasarkan peringkat
                                        let badgeColor = "bg-gray-100 text-gray-600";
                                        if (index === 0) badgeColor = "bg-yellow-100 text-yellow-700 border border-yellow-300"; // Emas
                                        if (index === 1) badgeColor = "bg-gray-200 text-gray-700 border border-gray-400"; // Perak
                                        if (index === 2) badgeColor = "bg-orange-100 text-orange-800 border border-orange-300"; // Perunggu

                                        return (
                                            <div key={student.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${badgeColor}`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-bold text-gray-900 truncate">{student.name}</p>
                                                    <p className="text-sm text-gray-600 mt-0.5">Kelas: <span className="font-semibold">{student.class}</span></p>
                                                    <p className="text-sm text-blue-600 mt-1">
                                                        Telah hadir <span className="font-bold">{student.attendances_count} kali</span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    Belum ada data siswa.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

