
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Calendar = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mock calendar dates
    const dates = Array.from({ length: 35 }, (_, i) => i + 1);

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 className="text-h1">Calendar</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button variant="outline" style={{ padding: '8px' }}><ChevronLeft size={18} /></Button>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>March 2024</span>
                    <Button variant="outline" style={{ padding: '8px' }}><ChevronRight size={18} /></Button>
                    <Button variant="primary">Month View</Button>
                </div>
            </div>

            <div className="calendar-grid">
                {days.map(day => (
                    <div key={day} className="calendar-header">{day}</div>
                ))}

                {dates.map((date, index) => (
                    <div key={index} className="calendar-day">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            {date <= 31 ? date : index - 30}
                        </span>
                        {/* Mock events */}
                        {date === 15 && (
                            <div style={{ padding: '4px', background: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem', borderRadius: 4, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                📸 Instagram Launch
                            </div>
                        )}
                        {date === 18 && (
                            <div style={{ padding: '4px', background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', borderRadius: 4, cursor: 'pointer' }}>
                                📝 LinkedIn Post
                            </div>
                        )}
                        {date === 20 && (
                            <div style={{ padding: '4px', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', borderRadius: 4, cursor: 'pointer' }}>
                                📘 Facebook Update
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Calendar;
