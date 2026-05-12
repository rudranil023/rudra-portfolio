import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const Resume = () => {
  return (
    <section id="resume" className="py-24 relative bg-black/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My <span className="text-primary">Resume</span></h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card flex flex-col md:flex-row items-center justify-between p-8 md:p-12"
        >
          <div className="flex items-center gap-6 mb-8 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Curriculum Vitae</h3>
              <p className="text-gray-400">Download my full resume to see all details.</p>
            </div>
          </div>
          
          <a 
            href="/resume.pdf" 
            target="_blank"
            download
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-transform hover:scale-105 shadow-lg shadow-primary/20"
          >
            <Download size={20} />
            Download Resume
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Resume;
