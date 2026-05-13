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
import { API_BASE_URL } from '../config';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch dynamic data
    const fetchData = async () => {
      try {
        const [projRes, certRes, skillRes, profRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/projects`),
          axios.get(`${API_BASE_URL}/certifications`),
          axios.get(`${API_BASE_URL}/skills`),
          axios.get(`${API_BASE_URL}/auth/public-profile`)
        ]);
        setProjects(projRes.data);
        setCertifications(certRes.data);
        setSkills(skillRes.data);
        setProfile(profRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience />
      <Certifications certifications={certifications} />
      <Resume />
      <Contact profile={profile} />
    </div>
  );
};

export default Home;
