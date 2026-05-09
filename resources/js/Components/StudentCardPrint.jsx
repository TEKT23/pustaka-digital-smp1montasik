import React, { forwardRef } from 'react';
import Barcode from 'react-barcode';

const StudentCardPrint = forwardRef(({ student }, ref) => {
    if (!student) return null;

    return (
        <div ref={ref} className="bg-white p-4 w-[4in] flex flex-col items-center gap-6 print:p-0 print:gap-4 print:bg-white">
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
                <div className="flex-1 flex p-2 z-10 relative overflow-hidden">
                    {/* Foto */}
                    <div className="w-[0.7in] h-[0.9in] border border-gray-300 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {student.photo_url ? (
                            <img src={student.photo_url} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <div className="text-[16px] text-gray-300">👤</div>
                                <div className="text-[6px] text-gray-400 uppercase">FOTO</div>
                            </div>
                        )}
                    </div>

                    {/* Data */}
                    <div className="ml-2 flex-1 flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5">
                            <div className="text-[8px] flex items-start">
                                <div className="font-bold text-gray-500 w-10 flex-shrink-0">NAMA</div>
                                <div className="font-black text-gray-800 uppercase flex-1 leading-tight">: {student.name}</div>
                            </div>
                            <div className="text-[8px] flex items-start">
                                <div className="font-bold text-gray-500 w-10 flex-shrink-0">NIS/KL</div>
                                <div className="font-bold text-gray-800 uppercase flex-1 leading-tight">: {student.nis} / {student.class}</div>
                            </div>
                            <div className="text-[8px] flex items-start">
                                <div className="font-bold text-gray-500 w-10 flex-shrink-0">ALAMAT</div>
                                <div className="font-bold text-gray-800 uppercase flex-1 leading-tight line-clamp-2">: {student.address || '-'}</div>
                            </div>
                        </div>
                        
                        {/* Barcode di pojok kanan bawah */}
                        <div className="self-end mt-auto h-8 flex items-center justify-end bg-white">
                            <Barcode 
                                value={student.nis} 
                                format="CODE128" 
                                width={1.2} 
                                height={20} 
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
                    <div className="text-right mt-1 pr-1">
                        <p className="text-[6px]">Kepala Perpustakaan,</p>
                        <div className="h-6"></div>
                        <p className="font-bold underline text-[7px]">Nurlaila, S.Pd</p>
                        <p className="text-[6px]">NIP. 19800101 200501 2 001</p>
                    </div>
                </div>
                {/* Background watermark */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <img src="/images/logo.svg" alt="Watermark" className="w-24 h-24 grayscale" />
                </div>
            </div>
        </div>
    );
});

export default StudentCardPrint;
