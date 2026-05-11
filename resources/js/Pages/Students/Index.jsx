import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import StudentCardPrint from '@/Components/StudentCardPrint';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Index({ students, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        nis: '',
        nisn: '',
        name: '',
        address: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [printingStudent, setPrintingStudent] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Kartu_Pustaka_${printingStudent?.name || 'Siswa'}`,
        onAfterPrint: () => {
            setIsPreviewModalOpen(false);
            setPrintingStudent(null);
        }
    });

    const downloadPDF = async () => {
        if (!printRef.current) return;
        setIsDownloading(true);
        try {
            // Let html2canvas calculate dimensions automatically to prevent subpixel clipping
            const canvas = await html2canvas(printRef.current, {
                scale: 3, // Higher scale for better PDF print quality
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'a4'
            });
            
            // A4 size in inches: 8.27 x 11.69
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate dimensions to fit in A4 and center it
            const imgProps = pdf.getImageProperties(imgData);
            const displayWidth = 4.5; // Fixed width in inches for the cards on PDF
            const displayHeight = (imgProps.height * displayWidth) / imgProps.width;
            
            const xPos = (pdfWidth - displayWidth) / 2;
            const yPos = 0.5; // Top margin
            
            pdf.addImage(imgData, 'PNG', xPos, yPos, displayWidth, displayHeight);
            pdf.save(`Kartu_Perpustakaan_${printingStudent.nis}.pdf`);
            
            setIsPreviewModalOpen(false);
            setPrintingStudent(null);
        } catch (error) {
            console.error('Download failed', error);
            alert('Gagal mengunduh PDF. Silakan coba gunakan tombol Cetak (Print) dan pilih "Save as PDF".');
        } finally {
            setIsDownloading(false);
        }
    };

    const triggerPrint = (student) => {
        setPrintingStudent(student);
        setIsPreviewModalOpen(true);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        router.get(route('students.index'), { search: e.target.value }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        reset();
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const openEditModal = (student) => {
        setData({
            id: student.id,
            nis: student.nis,
            nisn: student.nisn || '',
            name: student.name,
            address: student.address || '',
        });
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('students.update', data.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('students.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
            destroy(route('students.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manajemen Siswa
                    </h2>
                    <button 
                        onClick={openCreateModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Tambah Siswa
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Siswa" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Filters */}
                        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <input
                                    type="text"
                                    placeholder="Cari Nama atau NIS..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    🔍
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">NIS / NISN</th>
                                        <th className="px-6 py-3">Nama</th>

                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.data.map((student) => (
                                        <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div>{student.nis}</div>
                                                {student.nisn && <div className="text-xs text-gray-500">{student.nisn}</div>}
                                            </td>
                                            <td className="px-6 py-4 flex flex-col">
                                                <span>{student.name}</span>
                                                <span className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">{student.address || '-'}</span>
                                            </td>

                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button 
                                                    onClick={() => triggerPrint(student)}
                                                    className="text-green-600 hover:underline font-medium"
                                                    title="Cetak Kartu Pustaka"
                                                >
                                                    Cetak Kartu
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(student)}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(student.id)}
                                                    className="text-red-600 hover:underline font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex justify-between items-center text-sm">
                            <div className="text-gray-500">
                                Menampilkan {students.from} - {students.to} dari {students.total} siswa
                            </div>
                            <div className="flex space-x-2">
                                {students.links.map((link, index) => (
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

            {/* Modal CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-6">{isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">NIS</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.nis}
                                    onChange={e => setData('nis', e.target.value)}
                                />
                                {errors.nis && <div className="text-red-500 text-xs mt-1">{errors.nis}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">NISN (Opsional)</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.nisn}
                                    onChange={e => setData('nisn', e.target.value)}
                                />
                                {errors.nisn && <div className="text-red-500 text-xs mt-1">{errors.nisn}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                <textarea 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    rows="2"
                                />
                                {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isEdit ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Preview Cetak */}
            {isPreviewModalOpen && printingStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center p-4">
                    <div className="mb-4 text-white text-lg font-semibold flex items-center">
                        Preview Kartu Anggota 
                        {isDownloading && <span className="ml-3 text-sm animate-pulse text-blue-400 font-medium">Menyiapkan PDF...</span>}
                    </div>
                    
                    {/* Container Preview yang akan di-print (terlihat di layar) */}
                    <div className="bg-transparent mb-8 flex justify-center max-w-[100vw] overflow-x-auto scale-90 sm:scale-100">
                        <StudentCardPrint ref={printRef} student={printingStudent} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                            disabled={isDownloading}
                            onClick={() => {
                                setIsPreviewModalOpen(false);
                                setPrintingStudent(null);
                            }}
                            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-lg disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button 
                            disabled={isDownloading}
                            onClick={handlePrint}
                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak (Print)
                        </button>
                        <button 
                            disabled={isDownloading}
                            onClick={downloadPDF}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF Langsung
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
