import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth_store';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
    const { setToken } = useAuthStore()
    const { isAuthenticated, setIsAuthenticated } = useAuthStore()

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        window.location.href = '/';
        setIsAuthenticated(false)
    }
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isAuthPage) {
        return (
            <nav className="absolute top-0 left-0 w-full p-6 z-50">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer inline-flex">
                    <span className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-yellow-500/20">
                        VF
                    </span>
                    <span className="text-2xl font-black tracking-tight text-white">
                        VIRAL<span className="text-violet-300 font-light ml-0.5">FORGE</span>
                    </span>
                </Link>
            </nav>
        );
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#12151D]/95 backdrop-blur-md border-b border-violet-300/10' : 'bg-gradient-to-b from-[#0E1015]/90 to-transparent'}`}>
            <div className="flex items-center justify-between px-4 md:px-12 py-3.5">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                    <span className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                        VF
                    </span>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                        VIRAL<span className="text-violet-300 font-light ml-0.5">FORGE</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/browse" className={`text-sm font-semibold transition ${location.pathname === '/browse' ? 'text-yellow-400' : 'text-slate-300 hover:text-white'}`}>
                        Discover Feed
                    </Link>

                    {!isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link to="/signin" className="text-slate-300 hover:text-white font-semibold text-sm transition">
                                Sign In
                            </Link>
                            <Link to="/signup" className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2 rounded-xl font-bold transition shadow-sm shadow-yellow-500/20 text-sm">
                                Join as Merchant
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/transcode" className={`text-sm font-semibold transition ${location.pathname === '/transcode' ? 'text-yellow-400' : 'text-slate-300 hover:text-white'}`}>
                                Upload & Transcode
                            </Link>
                            <span className="text-violet-200 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-400/10 border border-violet-300/20">
                                Merchant
                            </span>
                            <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl font-semibold transition text-xs border border-slate-700">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
