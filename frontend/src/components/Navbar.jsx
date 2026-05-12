import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-2xl font-bold text-white tracking-tighter">
              Rudra<span className="text-primary">.</span>
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-gray-300 hover:text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center ml-4 space-x-4 border-l border-white/10 pl-4">
              <a 
                href="/admin/login" 
                className="text-gray-300 hover:text-primary transition-colors text-sm font-medium"
              >
                Admin
              </a>
              <a 
                href="#resume" 
                className="inline-block bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/25"
              >
                Resume
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-primary focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-md border-b border-white/10 shadow-xl"
        >
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
              <a 
                href="/admin/login" 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors block px-3 py-2 text-center text-sm font-medium"
              >
                Admin Login
              </a>
              <a 
                href="#resume" 
                onClick={() => setIsOpen(false)}
                className="bg-primary hover:bg-primary/90 text-white block px-3 py-2 rounded-md text-base font-medium text-center transition-all hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:shadow-primary/25"
              >
                Resume
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
