import { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileCode2, Award, MessageSquare, LogOut, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('projects');
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form states
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', image: null });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', image: null });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [projRes, certRes, msgRes] = await Promise.all([
        axios.get('http://localhost:5000/api/projects'),
        axios.get('http://localhost:5000/api/certifications'),
        axios.get('http://localhost:5000/api/messages', { headers })
      ]);
      
      setProjects(projRes.data);
      setCertifications(certRes.data);
      setMessages(msgRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProject).forEach(key => {
      formData.append(key, newProject[key]);
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchData();
      setNewProject({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', image: null });
    } catch (error) {
      console.error('Error adding project', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newCert).forEach(key => {
      formData.append(key, newCert[key]);
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/certifications', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchData();
      setNewCert({ title: '', issuer: '', date: '', image: null });
    } catch (error) {
      console.error('Error adding certification', error);
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/certifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting certification', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting message', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-64 bg-dark border-r border-white/10 p-6 flex flex-col hidden md:flex">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white tracking-tighter">
            Admin<span className="text-primary">Panel</span>
          </h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileCode2 size={18} /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('certifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'certifications' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Award size={18} /> Certifications
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare size={18} /> Messages
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-white/10 md:hidden">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-dark border border-white/10 rounded px-2 py-1 text-white text-sm"
            >
                <option value="projects">Projects</option>
                <option value="certifications">Certifications</option>
                <option value="messages">Messages</option>
            </select>
        </header>

        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="glass-card">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={20} className="text-primary" /> Add New Project
              </h3>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Project Title" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                  <input type="text" placeholder="Technologies (comma separated)" required value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                  <input type="url" placeholder="GitHub Link" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                  <input type="url" placeholder="Live Demo Link" value={newProject.liveLink} onChange={e => setNewProject({...newProject, liveLink: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <textarea placeholder="Project Description" required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white h-24 resize-none" />
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Thumbnail</label>
                  <input type="file" onChange={e => setNewProject({...newProject, image: e.target.files[0]})} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Project</button>
              </form>
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-bold text-white mb-6">Manage Projects</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-gray-400 font-medium">Title</th>
                      <th className="py-3 px-4 text-gray-400 font-medium">Technologies</th>
                      <th className="py-3 px-4 text-gray-400 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{p.title}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">{p.technologies.join(', ')}</td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => handleDeleteProject(p._id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-8">
            <div className="glass-card">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={20} className="text-primary" /> Add New Certification
              </h3>
              <form onSubmit={handleAddCert} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Certification Title" required value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                  <input type="text" placeholder="Issuer (e.g. Coursera, Microsoft)" required value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                  <input type="text" placeholder="Date (e.g. Jan 2023)" required value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Certificate Image</label>
                  <input type="file" onChange={e => setNewCert({...newCert, image: e.target.files[0]})} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Certification</button>
              </form>
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-bold text-white mb-6">Manage Certifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-gray-400 font-medium">Title</th>
                      <th className="py-3 px-4 text-gray-400 font-medium">Issuer</th>
                      <th className="py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="py-3 px-4 text-gray-400 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certifications.map(c => (
                      <tr key={c._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{c.title}</td>
                        <td className="py-3 px-4 text-gray-400">{c.issuer}</td>
                        <td className="py-3 px-4 text-gray-400">{c.date}</td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => handleDeleteCert(c._id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white mb-6">Contact Messages</h3>
            {messages.length === 0 ? (
                <p className="text-gray-400">No messages yet.</p>
            ) : (
                <div className="space-y-4">
                {messages.map(m => (
                    <div key={m._id} className="bg-dark border border-white/10 rounded-lg p-4 relative">
                    <button onClick={() => handleDeleteMessage(m._id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                    <h4 className="text-white font-medium">{m.name} <span className="text-gray-500 text-sm ml-2">&lt;{m.email}&gt;</span></h4>
                    <p className="text-gray-400 mt-2 text-sm">{m.message}</p>
                    <span className="text-xs text-gray-600 mt-4 block">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                ))}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
