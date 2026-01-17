import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-2xl font-heading font-bold"
            data-testid="navbar-logo"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
              Teamacy
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors">About</Link>
            <Link to="/services" className="text-white hover:text-primary transition-colors">Services</Link>
            <Link to="/portfolio" className="text-white hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors">Contact</Link>

            {user ? (
              <>
                {/* USER NAME – BOX */}
                <div
                  className="
                    px-4 py-2
                    border border-white/20
                    bg-white/10
                    backdrop-blur-md
                    rounded-md
                    text-white
                    font-bold
                    text-sm
                  "
                >
                  {user.name}
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-all hover:scale-105"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-white hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-all hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4">
            <Link to="/" className="block text-white">Home</Link>
            <Link to="/about" className="block text-white">About</Link>
            <Link to="/services" className="block text-white">Services</Link>
            <Link to="/portfolio" className="block text-white">Portfolio</Link>
            <Link to="/contact" className="block text-white">Contact</Link>

            {user ? (
              <>
                {/* USER NAME – BOX (MOBILE) */}
                <div
                  className="
                    inline-block
                    px-4 py-2
                    border border-white/20
                    bg-white/10
                    rounded-md
                    text-white
                    font-bold
                    text-sm
                  "
                >
                  {user.name}
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block text-white">
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-white">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
