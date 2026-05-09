import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Scanner() {
    const [nis, setNis] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [student, setStudent] = useState(null);
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    // Keep input focused at all times
    useEffect(() => {
        const keepFocus = () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };

        keepFocus();
        document.addEventListener('click', keepFocus);

        return () => {
            document.removeEventListener('click', keepFocus);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nis) return;

        setStatus('loading');
        try {
            const response = await axios.post(route('api.scan'), { nis });
            
            if (response.data.success) {
                setStudent(response.data.student);
                setMessage(response.data.message);
                setStatus('success');
                // Play success sound
                new Audio('/sounds/success.mp3').play().catch(e => console.log('Audio play failed'));
            } else {
                setMessage(response.data.message);
                setStatus('error');
                new Audio('/sounds/error.mp3').play().catch(e => console.log('Audio play failed'));
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Terjadi kesalahan sistem');
            setStatus('error');
            new Audio('/sounds/error.mp3').play().catch(e => console.log('Audio play failed'));
        } finally {
            setNis('');
            // Reset to idle after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setStudent(null);
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
            status === 'success' ? 'bg-green-500' : 
            status === 'error' ? 'bg-red-500' : 'bg-gray-100'
        }`}>
            <Head title="Kiosk Scanner" />

            <div className="text-center">
                {status === 'idle' && (
                    <div className="space-y-8 animate-pulse">
                        <div className="text-6xl font-bold text-gray-800">PUSTAKA DIGITAL</div>
                        <div className="text-2xl text-gray-600">Silakan Scan Kartu Pustaka Anda</div>
                        <div className="mt-12">
                            <svg className="mx-auto w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 17h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                    </div>
                )}

                {status === 'loading' && (
                    <div className="text-4xl font-bold text-gray-800 animate-bounce">
                        Memproses...
                    </div>
                )}

                {status === 'success' && student && (
                    <div className="bg-white p-12 rounded-3xl shadow-2xl transform scale-110 transition-transform duration-300">
                        <div className="flex flex-col items-center space-y-6">
                            <img 
                                src={student.photo_url || 'https://via.placeholder.com/200'} 
                                alt={student.name}
                                className="w-48 h-48 rounded-full border-8 border-green-100 shadow-lg object-cover"
                            />
                            <div className="text-center">
                                <div className="text-5xl font-black text-gray-900 mb-2">{student.name}</div>
                                <div className="text-2xl font-semibold text-gray-600">{student.class}</div>
                            </div>
                            <div className="text-3xl font-bold text-green-600 animate-bounce">
                                {message}
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-white p-12 rounded-3xl shadow-2xl transform scale-110">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="text-9xl">⚠️</div>
                            <div className="text-4xl font-black text-red-600">
                                {message}
                            </div>
                            <div className="text-xl text-gray-500">
                                Silakan hubungi petugas perpustakaan.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Input for Scanner */}
            <form onSubmit={handleSubmit} className="opacity-0 absolute">
                <input
                    ref={inputRef}
                    type="text"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    autoComplete="off"
                />
            </form>

            <div className="absolute bottom-8 text-gray-400 text-sm">
                SMP 1 Montasik - Sistem Kehadiran Perpustakaan
            </div>
        </div>
    );
}
