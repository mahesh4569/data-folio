
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Eye, Trash2, Edit3, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import ProjectUploadForm from '../components/ProjectUploadForm';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { projects, loading, deleteProject } = useProjects();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowUploadForm(true);
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
    setEditingProject(null);
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-fadeInUp">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 animate-scale-in">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Mahesh
            </div>
            <div className="border-l border-white/30 pl-4">
              <h1 className="text-2xl font-bold text-white">Project Dashboard</h1>
              <p className="text-slate-300 text-sm">Welcome back, {user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <h3 className="text-lg font-semibold text-white mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-400 animate-pulse">{projects.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg font-semibold text-white mb-2">Technologies Used</h3>
            <p className="text-3xl font-bold text-purple-400 animate-pulse">
              {new Set(projects.flatMap(p => p.tech_stack)).size}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <h3 className="text-lg font-semibold text-white mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-400 animate-pulse">{projects.length}</p>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">Manage Projects</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 animate-pulse">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center animate-fadeInUp">
              <p className="text-slate-400 mb-4">No projects found</p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 transform"
              >
                Add Your First Project
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-slate-300 font-medium">Project</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Tech Stack</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id} className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 animate-fadeInUp" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {project.image_url && (
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-12 h-12 rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                            />
                          )}
                          <div>
                            <h3 className="text-white font-medium">{project.title}</h3>
                            <p className="text-slate-400 text-sm">{project.description.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {project.tech_stack.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full transition-all duration-300 hover:bg-blue-600/50 hover:scale-105"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <span className="px-2 py-1 bg-slate-600/30 text-slate-300 text-xs rounded-full transition-all duration-300 hover:bg-slate-600/50 hover:scale-105">
                              +{project.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-green-600/30 text-green-300 text-sm rounded-full animate-pulse">
                          Published
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {project.live_link && (
                            <a
                              href={project.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 transform"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => handleEditProject(project)}
                            className="p-2 text-slate-400 hover:text-green-400 transition-all duration-300 hover:scale-125 transform"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-slate-400 hover:text-red-400 transition-all duration-300 hover:scale-125 transform"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="animate-fadeInUp">
          <ProjectUploadForm
            onClose={handleCloseForm}
            project={editingProject}
            isEditing={!!editingProject}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
