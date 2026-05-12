import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Experience = () => {
  return (
    <section id="experience" className="py-24 relative bg-black/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work <span className="text-primary">Experience</span></h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>

        <div className="relative border-l-2 border-primary/30 pl-8 ml-4 md:ml-0 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[41px] top-1 h-6 w-6 rounded-full bg-dark border-4 border-primary flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-accent"></div>
            </div>

            <div className="glass p-6 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase size={18} className="text-primary" />
                    Business Development Intern
                  </h3>
                  <p className="text-gray-400 font-medium text-sm mt-1">Company Name — Location</p>
                </div>
                <div className="mt-2 md:mt-0 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold w-max border border-primary/30">
                  Date - Present
                </div>
              </div>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4 marker:text-accent">
                <li>Engaged in communication & lead generation to expand business reach.</li>
                <li>Gained hands-on CRM exposure and managed client relationships.</li>
                <li>Conducted market research to identify potential growth areas.</li>
                <li>Interacted directly with clients, improving negotiation and interpersonal skills.</li>
              </ul>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Experience;
