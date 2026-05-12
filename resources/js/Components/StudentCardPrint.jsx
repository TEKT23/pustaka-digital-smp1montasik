import React, { forwardRef } from 'react';
import Barcode from 'react-barcode';

const StudentCardPrint = forwardRef(({ student }, ref) => {
    if (!student) return null;

    return (
        <>
        <style dangerouslySetInnerHTML={{ __html: `
            @media print {
                @page { margin: 0; size: auto; }
                body { margin: 0; }
            }
        ` }} />
        <div ref={ref} className="bg-white p-4 w-[4in] flex flex-col items-center gap-6 print:p-0 print:m-0 print:gap-2 print:bg-white">
            {/* Bagian Depan Kartu */}
            <div className="w-[3.375in] h-[2.125in] border border-gray-400 rounded-lg overflow-hidden relative bg-white shadow-sm print:shadow-none" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div className="bg-blue-800 text-white flex items-center p-2 border-b-2 border-yellow-400 z-10 relative">
                    <img src="/images/logo.svg" alt="Logo" className="w-8 h-8 rounded-full bg-white object-cover" />
                    <div className="ml-2 text-center flex-1">
                        <h1 className="text-[10px] font-black leading-tight tracking-tight">KARTU ANGGOTA PERPUSTAKAAN</h1>
                        <h2 className="text-[9px] font-bold">SMPN 1 MONTASIK</h2>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col px-3 py-1 z-10 relative overflow-hidden">
                    {/* Data */}
                    <div className="flex-1 flex flex-col justify-start overflow-hidden pt-1">
                        <div className="space-y-1">
                            <div className="text-[9px] flex items-start">
                                <div className="font-bold text-gray-500 w-16 flex-shrink-0">NAMA</div>
                                <div className="font-black text-gray-800 uppercase flex-1 leading-none">: {student.name}</div>
                            </div>
                            <div className="text-[8.5px] flex items-start">
                                <div className="font-bold text-gray-500 w-16 flex-shrink-0">NIS / NISN</div>
                                <div className="font-bold text-gray-800 uppercase flex-1 leading-none">: {student.nis} / {student.nisn || '-'}</div>
                            </div>
                            <div className="text-[8.5px] flex items-start">
                                <div className="font-bold text-gray-500 w-16 flex-shrink-0">TTL</div>
                                <div className="font-bold text-gray-800 uppercase flex-1 leading-none">
                                    : {(() => {
                                        if (!student.birth_place && !student.birth_date) return '-';
                                        if (!student.birth_date) return student.birth_place;
                                        const date = new Date(student.birth_date);
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const year = date.getFullYear();
                                        return `${student.birth_place || ''}, ${day}-${month}-${year}`;
                                    })()}
                                </div>
                            </div>
                            <div className="text-[8px] flex items-start">
                                <div className="font-bold text-gray-500 w-16 flex-shrink-0">ALAMAT</div>
                                <div className="font-medium text-gray-800 uppercase flex-1 leading-tight">
                                    : {student.address ? (student.address.length > 60 ? student.address.substring(0, 60) + '...' : student.address) : '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Validity Text & Barcode */}
                    <div className="mt-auto flex flex-col items-center">
                        <div className="text-[6.5px] italic text-gray-500 mb-0.5">
                            Berlaku selama menjadi siswa SMPN 1 Montasik
                        </div>
                        <div className="h-8 flex items-center justify-center bg-white mb-0.5">
                            <Barcode 
                                value={student.nis} 
                                format="CODE128" 
                                width={1.3} 
                                height={22} 
                                displayValue={false} 
                                margin={0}
                                background="transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer / Background watermark */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <img src="/images/logo.svg" alt="Watermark" className="w-32 h-32 grayscale" />
                </div>
            </div>

            {/* Bagian Belakang Kartu */}
            <div className="w-[3.375in] h-[2.125in] border border-gray-400 rounded-lg overflow-hidden relative bg-white shadow-sm print:shadow-none flex flex-col">
                <div className="bg-blue-800 text-white text-center py-1">
                    <h1 className="text-[10px] font-bold">TATA TERTIB PERPUSTAKAAN</h1>
                </div>
                <div className="p-2 text-[7px] leading-snug flex-1 flex flex-col justify-between">
                    <ol className="list-decimal pl-3 space-y-0.5 text-gray-800">
                        <li>Kartu ini wajib dibawa saat berkunjung/meminjam buku.</li>
                        <li>Kartu anggota tidak boleh dipinjamkan.</li>
                        <li>Buku harus dikembalikan tepat waktu.</li>
                        <li>Keterlambatan dikenakan sanksi sesuai ketentuan.</li>
                        <li>Buku hilang/rusak wajib diganti/dibayar.</li>
                        <li>Jika kartu hilang, segera lapor petugas.</li>
                    </ol>
                </div>
                {/* Background watermark */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <img src="/images/logo.svg" alt="Watermark" className="w-24 h-24 grayscale" />
                </div>
            </div>
        </div>
        </>
    );
});

export default StudentCardPrint;
