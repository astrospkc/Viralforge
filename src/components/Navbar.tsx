import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

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
                <Link to="/" className="text-red-600 text-4xl font-bold tracking-tighter uppercase cursor-pointer">
                    VIRAL_FORGE
                </Link>
            </nav>
        );
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
            <div className="flex items-center justify-between px-4 md:px-12 py-4">
                <Link to="/" className="text-red-600 text-2xl md:text-3xl font-bold tracking-tighter uppercase cursor-pointer">
                    VIRAL_FORGE
                </Link>

                <div>
                    {location.pathname === '/' ? (
                        <Link to="/signin" className="bg-[#E50914] text-white px-4 py-1.5 rounded-sm font-medium hover:bg-[#c11119] transition text-sm">
                            Sign In
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-white text-sm">User</span>
                            <Link to="/" className="bg-[#E50914] text-white px-4 py-1.5 rounded-sm font-medium hover:bg-[#c11119] transition text-sm">
                                Sign Out
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
