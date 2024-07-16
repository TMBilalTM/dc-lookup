import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const router = useRouter();

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserData(null);
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('/api/profile', config);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUserData(null);
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAuthenticated = !!userData;

  return (
    <header
      className={`bg-white shadow-lg fixed top-0 left-0 w-full transition duration-300 ${
        isSticky
          ? 'bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-full px-4 py-1'
          : 'bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-none px-4 py-3'
      }`}
    >
      <div className="max-w-screen-lg mx-auto">
        {/* Desktop Menu (hidden on mobile) */}
        <div className="hidden md:flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src="https://cdn.discordapp.com/attachments/1175724264465375314/1260522298235027537/speaker_dribbble_1.png?ex=668fa05f&is=668e4edf&hm=ac39c4a00061840d4ffe4580936149f71a1a28e236fdfb8aa49e4d8e733753d1&"
                alt="Logo"
                className="object-cover h-full w-full"
              />
            </div>
            <NavLink href="/" active={router.pathname === '/'}>
              Home
            </NavLink>
            <NavLink href="/about" active={router.pathname === '/about'}>
              About
            </NavLink>
            <NavLink href="/services" active={router.pathname === '/services'}>
              Services
            </NavLink>
            <NavLink href="/contact" active={router.pathname === '/contact'}>
              Contact
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-lime-700 transition-colors duration-200">
                    Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                    Register
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile Menu (visible on small screens) */}
        <div className="md:hidden flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src="https://cdn.discordapp.com/attachments/1175724264465375314/1260522298235027537/speaker_dribbble_1.png?ex=668fa05f&is=668e4edf&hm=ac39c4a00061840d4ffe4580936149f71a1a28e236fdfb8aa49e4d8e733753d1&"
                alt="Logo"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
          <div>
            <button
              onClick={toggleMobileMenu}
              className="focus:outline-none p-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu Items (visible on small screens when menu is open) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white mt-2 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-2 px-4 py-2">
              <NavLink href="/" active={router.pathname === '/'} onClick={closeMobileMenu}>
                Home
              </NavLink>
              <NavLink href="/about" active={router.pathname === '/about'} onClick={closeMobileMenu}>
                About
              </NavLink>
              <NavLink href="/services" active={router.pathname === '/services'} onClick={closeMobileMenu}>
                Services
              </NavLink>
              <NavLink href="/contact" active={router.pathname === '/contact'} onClick={closeMobileMenu}>
                Contact
              </NavLink>
              {isAuthenticated ? (
                <>
                  <Link href="/profile"  className="text-gray-600 hover:text-indigo-600 transition-colors duration-200" onClick={closeMobileMenu}>
                      Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink href="/login" onClick={closeMobileMenu}>
                    Login
                  </NavLink>
                  <Link href="/register"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200" onClick={closeMobileMenu}>
                      Register

                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ href, active, children, onClick }) => (
  <Link href={href}
      onClick={onClick}
      className={`text-gray-600 hover:text-indigo-600 transition-colors duration-200 ${
        active ? 'font-medium' : ''
      }`}
    >
      {children}
  </Link>
);

export default Header;
