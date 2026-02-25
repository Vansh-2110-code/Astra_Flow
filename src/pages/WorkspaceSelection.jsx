import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import WorkspaceCard from '../components/WorkspaceCard';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import { Plus } from 'lucide-react';
import { getWorkspaces } from '../services/workspaceService';

const WorkspaceSelection = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState('');

    const handleWorkspaceClick = (id) => {
        navigate(`/workspace/${id}/content`);
    };

    const fetchWorkspaces = async () => {
        setError('');
        try {
            const data = await getWorkspaces();
            // API may return an array or { results: [...] }
            const list = Array.isArray(data) ? data : (data.results || data.data || []);
            setWorkspaces(list);
        } catch (err) {
            console.error('Error fetching workspaces:', err);
            setError(err.message || 'Failed to load workspaces');
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return (
        <div className="dashboard-layout" style={{ flexDirection: 'column' }}>
            <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            {/* Topbar without sidebar context, or reusing standard Topbar */}
            <div className="main-content">
                <Topbar />
                <main className="page-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 className="text-h1">Select Workspace</h1>
                        <p className="text-muted">Choose a workspace to start collaborating.</p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            color: 'var(--input-error)',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.9rem'
                        }}>
                            <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="workspace-grid">
                        <div
                            className="card create-workspace-card"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <Plus size={24} />
                            </div>
                            <span style={{ fontWeight: 600 }}>Create New Workspace</span>
                        </div>

                        {workspaces.map(ws => (
                            <WorkspaceCard
                                key={ws.id}
                                workspace={ws}
                                onClick={() => handleWorkspaceClick(ws.id)}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WorkspaceSelection;
