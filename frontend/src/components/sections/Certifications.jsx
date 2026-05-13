import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../config';

const Certifications = ({ certifications }) => {
  return (
    <section id="certifications" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Licenses & <span className="text-primary">Certifications</span></h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>

        {certifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10 glass rounded-xl">
            No certifications uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card flex flex-col items-center text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-dark border-2 border-white/10 flex items-center justify-center mb-4 overflow-hidden shadow-lg shadow-primary/20">
                  {cert.images && cert.images.length > 0 ? (
                     <img src={cert.images[0]} alt={cert.title} className="w-full h-full object-cover" />
                  ) : cert.image ? (
                     <img src={cert.image.startsWith('data:') ? cert.image : `${IMAGE_BASE_URL}${cert.image}`} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                     <Award className="text-accent" size={30} />
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 leading-snug">{cert.title}</h3>
                <p className="text-sm text-primary font-medium mb-1">{cert.issuer}</p>
                <p className="text-xs text-gray-500 mb-4">{cert.date}</p>
                
                <button className="mt-auto flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition-all">
                  <CheckCircle size={14} className="text-green-400" /> Verify
                </button>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Certifications;
