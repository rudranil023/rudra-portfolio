import { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileCode2, Award, MessageSquare, LogOut, Plus, Trash2, Settings as SettingsIcon, UserCircle, Code2, FileText, Upload } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Data States
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [settings, setSettings] = useState({ theme: 'dark', seoTitle: '', seoDescription: '', faviconUrl: '' });
  const [profile, setProfile] = useState({ name: '', bio: '', roleTitles: '', phone: '', address: '', linkedin: '', github: '', twitter: '', instagram: '' });

  // Form States
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', image: null });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', image: null });
  const [newSkill, setNewSkill] = useState({ name: '', percentage: '', icon: '' });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [projRes, certRes, msgRes, skillRes, setRes, profRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/projects`),
        axios.get(`${API_BASE_URL}/certifications`),
        axios.get(`${API_BASE_URL}/messages`, { headers }),
        axios.get(`${API_BASE_URL}/skills`),
        axios.get(`${API_BASE_URL}/settings`),
        axios.get(`${API_BASE_URL}/auth/me`, { headers })
      ]);
      
      setProjects(projRes.data);
      setCertifications(certRes.data);
      setMessages(msgRes.data);
      setSkills(skillRes.data);
      if(setRes.data) setSettings(setRes.data);
      if(profRes.data) {
        setProfile({
          name: profRes.data.name || '',
          bio: profRes.data.bio || '',
          roleTitles: profRes.data.roleTitles ? profRes.data.roleTitles.join(', ') : '',
          phone: profRes.data.contactDetails?.phone || '',
          address: profRes.data.contactDetails?.address || '',
          linkedin: profRes.data.socialLinks?.linkedin || '',
          github: profRes.data.socialLinks?.github || '',
          twitter: profRes.data.socialLinks?.twitter || '',
          instagram: profRes.data.socialLinks?.instagram || ''
        });
      }
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Generic config for requests
  const getConfig = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    };
  };

  // --- Handlers ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProject).forEach(key => formData.append(key, newProject[key]));
    try {
      await axios.post(`${API_BASE_URL}/projects`, formData, getConfig(true));
      fetchData();
      setNewProject({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', image: null });
    } catch (error) { console.error(error); }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`, getConfig());
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newCert).forEach(key => formData.append(key, newCert[key]));
    try {
      await axios.post(`${API_BASE_URL}/certifications`, formData, getConfig(true));
      fetchData();
      setNewCert({ title: '', issuer: '', date: '', image: null });
    } catch (error) { console.error(error); }
  };

  const handleDeleteCert = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/certifications/${id}`, getConfig());
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/skills`, newSkill, getConfig());
      fetchData();
      setNewSkill({ name: '', percentage: '', icon: '' });
    } catch (error) { console.error(error); }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/skills/${id}`, getConfig());
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/messages/${id}`, getConfig());
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: profile.name,
        bio: profile.bio,
        roleTitles: profile.roleTitles.split(',').map(r => r.trim()),
        contactDetails: { phone: profile.phone, address: profile.address },
        socialLinks: { linkedin: profile.linkedin, github: profile.github, twitter: profile.twitter, instagram: profile.instagram }
      };
      await axios.put(`${API_BASE_URL}/auth/me/profile`, payload, getConfig());
      alert('Profile updated successfully');
    } catch (error) { console.error(error); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/settings`, settings, getConfig());
      alert('Settings updated successfully');
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark text-white">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  const TabButton = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === id ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-dark text-white font-sans selection:bg-primary/30">
      {/* Sidebar */}
      <div className="w-64 bg-dark border-r border-white/5 p-6 flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm">RK</span>
            Admin<span className="text-primary font-light">Panel</span>
          </h2>
        </div>
        
        <nav className="flex-1 space-y-1.5">
          <TabButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</div>
          <TabButton id="projects" icon={FileCode2} label="Projects" />
          <TabButton id="certifications" icon={Award} label="Certifications" />
          <TabButton id="skills" icon={Code2} label="Skills" />
          <TabButton id="resume" icon={FileText} label="Resume" />
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</div>
          <TabButton id="messages" icon={MessageSquare} label="Messages" />
          <TabButton id="profile" icon={UserCircle} label="Profile" />
          <TabButton id="settings" icon={SettingsIcon} label="Settings" />
        </nav>
        
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{user.name?.charAt(0) || 'A'}</div>
            <div>
              <p className="text-sm font-medium text-white">{user.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-gradient-to-br from-dark to-[#0f0f0f]">
        
        {/* Mobile Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-white/10 md:hidden">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
            >
                <option value="dashboard">Dashboard</option>
                <option value="projects">Projects</option>
                <option value="certifications">Certifications</option>
                <option value="skills">Skills</option>
                <option value="profile">Profile</option>
                <option value="settings">Settings</option>
                <option value="messages">Messages</option>
            </select>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-8">Welcome back, {user.name?.split(' ')[0] || 'Admin'} 👋</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Projects', value: projects.length, icon: FileCode2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { label: 'Certifications', value: certifications.length, icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { label: 'Skills Added', value: skills.length, icon: Code2, color: 'text-green-400', bg: 'bg-green-400/10' },
                  { label: 'Unread Messages', value: messages.length, icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-400/10' }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform cursor-default">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Projects Management</h2>
              </div>
              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-primary" /> Add New Project
                </h3>
                <form onSubmit={handleAddProject} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Project Title</label>
                      <input type="text" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Technologies (comma separated)</label>
                      <input type="text" required value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">GitHub Repository URL</label>
                      <input type="url" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Live Demo URL</label>
                      <input type="url" value={newProject.liveLink} onChange={e => setNewProject({...newProject, liveLink: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Project Description</label>
                    <textarea required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white h-28 resize-none focus:border-primary outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Project Thumbnail</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-dark/20 hover:bg-dark/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                {newProject.image && <p className="text-xs text-primary font-medium">{newProject.image.name}</p>}
                            </div>
                            <input type="file" className="hidden" onChange={e => setNewProject({...newProject, image: e.target.files[0]})} />
                        </label>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">Save Project</button>
                  </div>
                </form>
              </div>

              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Manage Projects</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Technologies</th>
                        <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {projects.map(p => (
                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-4 px-4 font-medium text-white">{p.title}</td>
                          <td className="py-4 px-4 text-gray-400 text-sm">
                            <div className="flex gap-1 flex-wrap">
                              {p.technologies.slice(0, 3).map((t, i) => <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs">{t}</span>)}
                              {p.technologies.length > 3 && <span className="px-2 py-1 rounded bg-white/5 text-xs">+{p.technologies.length - 3}</span>}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button onClick={() => handleDeleteProject(p._id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-primary" /> Add New Certification
                </h3>
                <form onSubmit={handleAddCert} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                      <input type="text" required value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Issuer</label>
                      <input type="text" required value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                      <input type="text" required value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Certificate Image</label>
                    <input type="file" onChange={e => setNewCert({...newCert, image: e.target.files[0]})} className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">Save Certification</button>
                  </div>
                </form>
              </div>

              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Manage Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map(c => (
                    <div key={c._id} className="bg-dark border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors group relative overflow-hidden">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => handleDeleteCert(c._id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                      <h4 className="font-bold text-white mb-1 pr-8">{c.title}</h4>
                      <p className="text-primary text-sm font-medium mb-3">{c.issuer}</p>
                      <p className="text-gray-500 text-xs">{c.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-primary" /> Add New Skill
                </h3>
                <form onSubmit={handleAddSkill} className="flex flex-wrap items-end gap-5">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Skill Name</label>
                    <input type="text" required value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none" />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Proficiency %</label>
                    <input type="number" min="0" max="100" required value={newSkill.percentage} onChange={e => setNewSkill({...newSkill, percentage: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none" />
                  </div>
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 whitespace-nowrap">Add Skill</button>
                </form>
              </div>

              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Manage Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map(s => (
                    <div key={s._id} className="bg-dark border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-white">{s.name}</h4>
                        <button onClick={() => handleDeleteSkill(s._id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full relative" style={{ width: `${s.percentage}%` }}>
                           <span className="absolute -right-3 -top-6 text-xs text-gray-400 font-medium">{s.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 border border-white/5 animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Profile Information</h3>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Role Titles (comma separated)</label>
                    <input type="text" value={profile.roleTitles} onChange={e => setProfile({...profile, roleTitles: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bio / About Me</label>
                  <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white h-32 resize-none focus:border-primary outline-none" />
                </div>
                
                <h4 className="text-lg font-medium text-white pt-4 border-t border-white/10">Contact & Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                    <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Address/Location</label>
                    <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">LinkedIn URL</label>
                    <input type="url" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">GitHub URL</label>
                    <input type="url" value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Twitter/X URL</label>
                    <input type="url" value={profile.twitter} onChange={e => setProfile({...profile, twitter: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-6">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">Update Profile</button>
                </div>
              </form>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="glass-card p-6 border border-white/5 animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Website Settings</h3>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Theme Preference</label>
                  <select value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value})} className="w-full md:w-1/3 bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none">
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme (Coming Soon)</option>
                  </select>
                </div>
                
                <h4 className="text-lg font-medium text-white pt-4 border-t border-white/10">SEO Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Meta Title</label>
                    <input type="text" value={settings.seoTitle} onChange={e => setSettings({...settings, seoTitle: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
                    <textarea value={settings.seoDescription} onChange={e => setSettings({...settings, seoDescription: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white h-24 resize-none focus:border-primary outline-none" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-6">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">Save Settings</button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="glass-card p-6 border border-white/5 animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <span>Contact Messages</span>
                <span className="text-xs font-medium px-3 py-1 bg-primary/20 text-primary rounded-full">{messages.length} Total</span>
              </h3>
              
              {messages.length === 0 ? (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p>Inbox is empty. You're all caught up!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {messages.map(m => (
                    <div key={m._id} className="bg-dark/50 border border-white/10 rounded-xl p-5 relative hover:border-white/20 transition-colors group">
                      <button onClick={() => handleDeleteMessage(m._id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"><Trash2 size={18} /></button>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-gray-300">{m.name.charAt(0)}</div>
                        <div>
                          <h4 className="text-white font-medium">{m.name}</h4>
                          <a href={`mailto:${m.email}`} className="text-primary text-sm hover:underline">{m.email}</a>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 mb-3">
                        <p className="text-gray-300 text-sm leading-relaxed">{m.message}</p>
                      </div>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        {new Date(m.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
             <div className="glass-card p-6 border border-white/5 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Resume Management</h3>
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-xl bg-dark/20 transition-colors hover:border-primary/50">
                    <FileText size={48} className="text-primary mb-4" />
                    <p className="text-gray-300 mb-2 text-center max-w-md">Upload your latest PDF resume. This will be available for download on your portfolio.</p>
                    <label className="mt-6 cursor-pointer bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2">
                        <Upload size={18} /> Upload PDF Resume
                        <input 
                          type="file" 
                          accept=".pdf" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('resume', file);
                              try {
                                const token = localStorage.getItem('token');
                                await axios.put(`${API_BASE_URL}/auth/me/resume`, formData, {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data'
                                  }
                                });
                                alert('Resume uploaded successfully!');
                              } catch (error) {
                                console.error(error);
                                alert('Error uploading resume');
                              }
                            }
                          }} 
                        />
                    </label>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
