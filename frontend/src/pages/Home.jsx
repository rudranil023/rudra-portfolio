import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Certifications from '../components/sections/Certifications';
import Resume from '../components/sections/Resume';
import Contact from '../components/sections/Contact';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    // Fetch dynamic data
    const fetchData = async () => {
      try {
        const [projRes, certRes] = await Promise.all([
          axios.get('https://elegant-griffin-b9b3a0.netlify.app/api/projects'),
          axios.get('https://elegant-griffin-b9b3a0.netlify.app/api/certifications')
        ]);
        setProjects(projRes.data);
        setCertifications(certRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Hero />
      <About />
      <Skills />
      <Projects projects={projects} />
      <Experience />
      <Certifications certifications={certifications} />
      <Resume />
      <Contact />
    </div>
  );
};

export default Home;
