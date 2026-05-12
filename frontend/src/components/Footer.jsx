import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tighter mb-2">
              Rudra<span className="text-primary">.</span>
            </h2>
            <p className="text-gray-400 max-w-sm">
              Transforming raw data into meaningful business insights.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com/rudranilkoley" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com/in/rudranilkoley" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin size={24} />
            </a>
            <a href="mailto:rudranil@example.com" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Email</span>
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Rudranil Koley. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-500">
            <a href="/admin/login" className="hover:text-white transition-colors">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
