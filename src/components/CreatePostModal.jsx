
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { X, Image, Calendar, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose }) => {
    const [platform, setPlatform] = useState('Instagram');

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <Card className="modal-content" style={{ width: '100%', maxWidth: '600px', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--input-border)', paddingBottom: '1rem' }}>
                    <h2 className="text-h3">Create New Post</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label-static" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Select Platform</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[
                            { name: 'Instagram', icon: Instagram, color: '#E1306C' },
                            { name: 'Facebook', icon: Facebook, color: '#4267B2' },
                            { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
                            { name: 'LinkedIn', icon: Linkedin, color: '#0077b5' }
                        ].map((p) => (
                            <button
                                key={p.name}
                                onClick={() => setPlatform(p.name)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    border: `2px solid ${platform === p.name ? 'var(--color-primary)' : 'var(--input-border)'}`,
                                    borderRadius: '12px',
                                    background: platform === p.name ? 'rgba(99, 102, 241, 0.05)' : 'white',
                                    cursor: 'pointer',
                                    flex: 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <p.icon size={24} color={platform === p.name ? p.color : 'var(--text-muted)'} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: platform === p.name ? 'var(--text-main)' : 'var(--text-muted)' }}>{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <textarea
                        className="input"
                        placeholder="Write your caption here..."
                        rows={5}
                        style={{ resize: 'none', fontFamily: 'inherit' }}
                    ></textarea>
                </div>

                <div style={{ border: '2px dashed var(--input-border)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', cursor: 'pointer' }}>
                    <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '50%', marginBottom: '1rem' }}>
                        <Image size={24} />
                    </div>
                    <span style={{ fontWeight: 500 }}>Drag & drop media or Browse</span>
                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Supported: JPG, PNG, MP4</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <Input icon={Calendar} type="date" label="Schedule Date" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Input icon={Clock} type="time" label="Time" />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--input-border)' }}>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="outline">Save Draft</Button>
                    <Button variant="primary">Submit for Approval</Button>
                </div>
            </Card>
        </div>
    );
};

export default CreatePostModal;
