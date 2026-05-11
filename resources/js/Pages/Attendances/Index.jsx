import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Index({ attendances }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Riwayat Kehadiran
                </h2>
            }
        >
            <Head title="Riwayat Kehadiran" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Waktu Scan</th>
                                        <th className="px-6 py-3">NIS</th>
                                        <th className="px-6 py-3">Nama Siswa</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {format(new Date(attendance.scanned_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                            </td>
                                            <td className="px-6 py-4">{attendance.student.nis}</td>
                                            <td className="px-6 py-4">{attendance.student.name}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex justify-between items-center text-sm">
                            <div className="text-gray-500">
                                Menampilkan {attendances.from} - {attendances.to} dari {attendances.total} log
                            </div>
                            <div className="flex space-x-2">
                                {attendances.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => router.get(link.url)}
                                        className={`px-3 py-1 border rounded ${
                                            link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
