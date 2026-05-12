import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = [
    "Data Analyst",
    "Power BI Developer",
    "SQL Enthusiast",
    "Business Intelligence Learner"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" id="home">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-block px-4 py-2 rounded-full glass border-primary/30 w-max mb-2">
              <span className="text-primary font-medium tracking-wider text-sm uppercase">Welcome to my portfolio</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Hi, I'm <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Rudranil Koley
              </span>
            </h1>
            
            <div className="h-12 md:h-16 flex items-center">
              <p className="text-2xl md:text-3xl font-medium text-gray-300">
                I am a <span className="text-white font-bold">{roles[roleIndex]}</span>
                <span className="animate-pulse">|</span>
              </p>
            </div>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Passionate about transforming raw data into meaningful business insights using SQL, Excel, Power BI, and Python.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#projects" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
                View Projects <ArrowRight size={20} />
              </a>
              <a href="#resume" className="glass hover:bg-white/10 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                <Download size={20} /> Resume
              </a>
              <a href="#contact" className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                <Mail size={20} /> Contact Me
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent animate-spin-slow opacity-50 blur-md"></div>
              
              <div className="absolute inset-2 bg-dark rounded-full overflow-hidden border-4 border-dark z-10 flex items-center justify-center">
                <img 
                  src="/hero-image.webp" 
                  alt="Rudranil Koley" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/0f0f0f/2563eb?text=RK' }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50"
      >
        <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
