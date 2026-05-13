import { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileCode2, Award, MessageSquare, LogOut, Plus, Trash2, Settings as SettingsIcon, UserCircle, Code2, FileText, Upload } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

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
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', images: [] });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', images: [] });
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

  // --- Chart Data Processing ---
  const skillChartData = skills.map(s => ({ name: s.name, value: parseInt(s.percentage) || 0 }));
  
  const techUsage = {};
  projects.forEach(p => {
    p.technologies?.forEach(t => {
      techUsage[t] = (techUsage[t] || 0) + 1;
    });
  });
  const techChartData = Object.entries(techUsage)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const messageTrendData = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) existing.count += 1;
    else acc.push({ date, count: 1 });
    return acc;
  }, []).slice(-7);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

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

  const moveImage = (type, index, direction) => {
    const state = type === 'project' ? newProject : newCert;
    const setState = type === 'project' ? setNewProject : setNewCert;
    const newImages = [...state.images];
    
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    
    setState({ ...state, images: newImages });
  };

  // --- Handlers ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProject).forEach(key => {
      if (key === 'images') {
        newProject.images.forEach(file => formData.append('images', file));
      } else {
        formData.append(key, newProject[key]);
      }
    });
    try {
      await axios.post(`${API_BASE_URL}/projects`, formData, getConfig(true));
      fetchData();
      setNewProject({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', images: [] });
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
    Object.keys(newCert).forEach(key => {
      if (key === 'images') {
        newCert.images.forEach(file => formData.append('images', file));
      } else {
        formData.append(key, newCert[key]);
      }
    });
    try {
      await axios.post(`${API_BASE_URL}/certifications`, formData, getConfig(true));
      fetchData();
      setNewCert({ title: '', issuer: '', date: '', images: [] });
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
            <div className="space-y-8 animate-fade-in pb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
                  <p className="text-gray-400 mt-1">Real-time analytics and portfolio performance</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-medium text-gray-300">Database Live</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Projects', value: projects.length, icon: FileCode2, color: '#6366f1', trend: '+12%' },
                  { label: 'Certs', value: certifications.length, icon: Award, color: '#a855f7', trend: '+5%' },
                  { label: 'Skills', value: skills.length, icon: Code2, color: '#10b981', trend: 'Active' },
                  { label: 'Messages', value: messages.length, icon: MessageSquare, color: '#f59e0b', trend: 'New' }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-400 mt-2 inline-block">{stat.trend}</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Message Trends */}
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Inquiry Traffic</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={messageTrendData.length > 0 ? messageTrendData : [{date: 'No Data', count: 0}]}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                          itemStyle={{ color: '#6366f1' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Skills Distribution */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Skills Mastery</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillChartData.length > 0 ? skillChartData : [{name: 'Empty', value: 100}]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(skillChartData.length > 0 ? skillChartData : [1]).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tech Stack usage */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Top Technologies</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={techChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{fill: '#ffffff05'}}
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions / Recent Message */}
                <div className="glass-card p-6 flex flex-col justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                    <SettingsIcon size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Portfolio Settings</h3>
                  <p className="text-gray-400 text-sm mb-6">Manage your SEO, theme, and site-wide configurations from one place.</p>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-bold text-sm"
                  >
                    Configure Site
                  </button>
                </div>
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
                    <label className="block text-xs font-medium text-gray-400 mb-2">Project Images (Up to 5 - Arrange below)</label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-dark/20 hover:bg-dark/50 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                  <p className="text-xs text-gray-400"><span className="font-semibold">Click to upload up to 5 images</span></p>
                              </div>
                              <input type="file" multiple className="hidden" onChange={e => {
                                const files = Array.from(e.target.files).slice(0, 5);
                                setNewProject({...newProject, images: files});
                              }} />
                          </label>
                      </div>

                      {/* Image Arranger */}
                      {newProject.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                          {newProject.images.map((file, idx) => (
                            <div key={idx} className="relative group bg-white/5 rounded-lg p-2 border border-white/10">
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-16 object-cover rounded" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                <button type="button" onClick={() => moveImage('project', idx, 'up')} className="p-1 hover:text-primary"><Plus className="rotate-[-135deg]" size={14} /></button>
                                <button type="button" onClick={() => moveImage('project', idx, 'down')} className="p-1 hover:text-primary"><Plus className="rotate-[45deg]" size={14} /></button>
                                <button type="button" onClick={() => {
                                  const newImgs = [...newProject.images];
                                  newImgs.splice(idx, 1);
                                  setNewProject({...newProject, images: newImgs});
                                }} className="p-1 hover:text-red-400"><Trash2 size={14} /></button>
                              </div>
                              <div className="absolute -top-2 -left-2 w-5 h-5 bg-primary rounded-full text-[10px] flex items-center justify-center font-bold">{idx + 1}</div>
                            </div>
                          ))}
                        </div>
                      )}
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
                    <label className="block text-xs font-medium text-gray-400 mb-2">Certificate Images (Up to 5 - Arrange below)</label>
                    <div className="space-y-4">
                      <input type="file" multiple onChange={e => {
                        const files = Array.from(e.target.files).slice(0, 5);
                        setNewCert({...newCert, images: files});
                      }} className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors" />
                      
                      {/* Image Arranger */}
                      {newCert.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                          {newCert.images.map((file, idx) => (
                            <div key={idx} className="relative group bg-white/5 rounded-lg p-2 border border-white/10">
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-16 object-cover rounded" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                <button type="button" onClick={() => moveImage('cert', idx, 'up')} className="p-1 hover:text-primary"><Plus className="rotate-[-135deg]" size={14} /></button>
                                <button type="button" onClick={() => moveImage('cert', idx, 'down')} className="p-1 hover:text-primary"><Plus className="rotate-[45deg]" size={14} /></button>
                                <button type="button" onClick={() => {
                                  const newImgs = [...newCert.images];
                                  newImgs.splice(idx, 1);
                                  setNewCert({...newCert, images: newImgs});
                                }} className="p-1 hover:text-red-400"><Trash2 size={14} /></button>
                              </div>
                              <div className="absolute -top-2 -left-2 w-5 h-5 bg-primary rounded-full text-[10px] flex items-center justify-center font-bold">{idx + 1}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
