import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const Projects = ({ projects }) => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-primary">Projects</span></h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400">Dynamic portfolio items fetched from the database</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-10 glass rounded-xl">
            No projects available yet. Admin needs to upload projects.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card group overflow-hidden flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative h-48 -mt-6 -mx-6 mb-6 overflow-hidden bg-dark">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.image ? `http://localhost:5000${project.image}` : 'https://via.placeholder.com/600x400/0f0f0f/7c3aed?text=Project'} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies && project.technologies.map((tech, i) => (
                    <span key={i} className="text-xs font-medium px-2 py-1 bg-white/5 border border-white/10 rounded-md text-primary">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-auto pt-4 border-t border-white/10">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
                      <Github size={16} /> Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-gray-300 hover:text-accent transition-colors ml-auto">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;
