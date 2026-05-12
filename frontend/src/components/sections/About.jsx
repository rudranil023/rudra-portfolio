import { motion } from 'framer-motion';
import { Award, BookOpen, Briefcase, Code } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Experience', value: '1+', icon: Briefcase },
    { label: 'Projects', value: '10+', icon: Code },
    { label: 'Certifications', value: '4+', icon: Award },
    { label: 'Education', value: 'B.Tech ECE', icon: BookOpen },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About <span className="text-primary">Me</span></h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="glass-card relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="/about-image.webp" 
                alt="About Me" 
                className="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400/0f0f0f/2563eb?text=Data+Analytics' }}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-2xl font-semibold text-white">
              Final-year B.Tech ECE student with a passion for Data
            </h3>
            
            <p className="text-gray-400 leading-relaxed">
              I am highly interested in Data Analytics and Business Intelligence. With a strong foundation in Electronics and Communication Engineering, I bring analytical thinking and problem-solving skills to the world of data.
            </p>
            
            <p className="text-gray-400 leading-relaxed">
              Skilled in Excel, SQL, Power BI, and Python, I excel at data cleaning, visualization, and creating insightful dashboards that drive business decisions. I also possess strong communication skills, having gained experience as a Business Development Intern.
            </p>

            <p className="text-gray-300 font-medium pb-4 border-b border-white/10">
              Actively seeking opportunities as a Data Analyst or Business Intelligence Learner.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="glass rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <stat.icon className="text-primary mb-2" size={24} />
                  <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
