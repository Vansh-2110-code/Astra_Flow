import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import {
    BarChart2, TrendingUp, Users, Eye, TrendingDown, RefreshCw,
    Instagram, Facebook, Linkedin, Twitter, Heart, MessageSquare, Share2, Globe
} from 'lucide-react';
import { getConnectedChannels, getChannelAnalytics, getWorkspaceAnalytics } from '../services/channelService';

// ─── Animated Number Counter ──────────────────────────────────────────────────
const AnimatedCounter = ({ value, duration = 1000 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const startTime = performance.now();
        const step = (ts) => {
            const progress = Math.min((ts - startTime) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value, duration]);
    return <span>{count.toLocaleString()}</span>;
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, icon: Icon, color, loading }) => (
    <Card className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 0 0 80px', background: `${color}15` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
                <p className="text-muted" style={{ fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                    {loading ? (
                        <span style={{ display: 'inline-block', width: '120px', height: '2rem', background: 'var(--bg-secondary)', borderRadius: '6px' }} />
                    ) : (
                        <AnimatedCounter value={typeof value === 'number' ? value : 0} />
                    )}
                </h2>
                {subtitle && <p className="text-muted" style={{ fontSize: '0.78rem' }}>{subtitle}</p>}
            </div>
            <div style={{ padding: '0.75rem', background: `${color}20`, borderRadius: '12px', color: color, flexShrink: 0 }}>
                <Icon size={22} />
            </div>
        </div>
    </Card>
);

// ─── Bar Chart (Canvas) ───────────────────────────────────────────────────────
const BarChart = ({ data, height = 200 }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data || data.length === 0) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        const w = rect.width, h = height;
        const padLeft = 52, padRight = 16, padTop = 16, padBottom = 40;
        const chartW = w - padLeft - padRight;
        const chartH = h - padTop - padBottom;

        ctx.clearRect(0, 0, w, h);

        const maxVal = Math.max(...data.map(d => Math.max(d.impressions || 0, d.reach || 0, d.engagement || 0)), 1);
        const barGroupW = chartW / data.length;
        const barW = Math.min(barGroupW * 0.22, 14);
        const gap = 2;

        // Grid lines
        for (let i = 0; i <= 4; i++) {
            const y = padTop + chartH - (i / 4) * chartH;
            ctx.strokeStyle = 'rgba(148,163,184,0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(padLeft, y); ctx.lineTo(w - padRight, y); ctx.stroke();
            ctx.fillStyle = 'rgba(100,116,139,0.7)';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round((maxVal * i) / 4).toLocaleString(), padLeft - 6, y + 3);
        }

        const colors = ['#6366f1', '#ec4899', '#10b981'];
        const keys = ['impressions', 'reach', 'engagement'];

        data.forEach((d, i) => {
            const groupX = padLeft + i * barGroupW + barGroupW / 2;
            keys.forEach((key, ki) => {
                const val = d[key] || 0;
                const barH = Math.max((val / maxVal) * chartH, val > 0 ? 2 : 0);
                const x = groupX - (1.5 * barW + gap) + ki * (barW + gap);
                const y = padTop + chartH - barH;
                const grad = ctx.createLinearGradient(0, y, 0, y + barH);
                grad.addColorStop(0, colors[ki]);
                grad.addColorStop(1, colors[ki] + '88');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
                ctx.fill();
            });
            ctx.fillStyle = 'rgba(100,116,139,0.65)';
            ctx.font = '9px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(d.date ? d.date.slice(5) : '', groupX, h - padBottom + 14);
        });

        // Legend
        const legendY = h - 6;
        keys.forEach((key, ki) => {
            const lx = padLeft + ki * 110;
            ctx.fillStyle = colors[ki];
            ctx.fillRect(lx, legendY - 8, 10, 8);
            ctx.fillStyle = 'rgba(100,116,139,0.85)';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText(key.charAt(0).toUpperCase() + key.slice(1), lx + 14, legendY);
        });
    }, [data, height]);

    if (!data || data.length === 0) {
        return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No activity data for this period</div>;
    }
    return <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />;
};

// ─── Donut Chart (Canvas) ─────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
    const canvasRef = useRef(null);
    const size = 180;
    const colors = { facebook: '#1877f2', instagram: '#e1306c', linkedin: '#0a66c2', twitter: '#1da1f2', other: '#6366f1' };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data || Object.keys(data).length === 0) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr; canvas.height = size * dpr;
        canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);
        const total = Object.values(data).reduce((s, v) => s + v, 0);
        const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.22;
        let startAngle = -Math.PI / 2;
        Object.entries(data).forEach(([platform, count]) => {
            const slice = (count / total) * Math.PI * 2;
            const color = colors[platform] || '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, startAngle + slice);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            startAngle += slice;
        });
        ctx.beginPath();
        ctx.arc(cx, cy, inner, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.font = `bold ${size * 0.13}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total, cx, cy - 5);
        ctx.font = `${size * 0.07}px system-ui`;
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('posts', cx, cy + size * 0.09);
    }, [data]);

    const total = data ? Object.values(data).reduce((s, v) => s + v, 0) : 0;
    if (!data || total === 0) return <div style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No posts yet</div>;
    const colorsMap = { facebook: '#1877f2', instagram: '#e1306c', linkedin: '#0a66c2', twitter: '#1da1f2', other: '#6366f1' };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <canvas ref={canvasRef} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {Object.entries(data).map(([plat, count]) => (
                    <div key={plat} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorsMap[plat] || '#94a3b8', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-muted)' }}>{plat.charAt(0).toUpperCase() + plat.slice(1)}</span>
                        <span style={{ fontWeight: 600 }}>{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Platform Icon helper ─────────────────────────────────────────────────────
const PlatformIcon = ({ platform, size = 16 }) => {
    const map = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, twitter: Twitter };
    const colorMap = { facebook: '#1877f2', instagram: '#e1306c', linkedin: '#0a66c2', twitter: '#1da1f2' };
    const Icon = map[platform] || Globe;
    return <Icon size={size} style={{ color: colorMap[platform] || '#94a3b8' }} />;
};

// ─── Main Analytics Component ─────────────────────────────────────────────────
const Analytics = () => {
    const { workspaceId } = useParams();
    const [dateRange, setDateRange] = useState('30');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [channels, setChannels] = useState([]);
    const [channelStats, setChannelStats] = useState({});
    const [workspaceSummary, setWorkspaceSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadAnalytics = useCallback(async (days, silent = false) => {
        if (!workspaceId) return;
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);
        try {
            const [chList, wsSummary] = await Promise.all([
                getConnectedChannels(workspaceId).catch(() => []),
                getWorkspaceAnalytics(workspaceId, days).catch(() => null)
            ]);
            setChannels(chList || []);
            setWorkspaceSummary(wsSummary);
            if (chList && chList.length > 0) {
                const statsMap = {};
                await Promise.all(chList.map(async (ch) => {
                    try { statsMap[ch.id] = await getChannelAnalytics(ch.id, days); }
                    catch { statsMap[ch.id] = null; }
                }));
                setChannelStats(statsMap);
            }
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setLastUpdated(new Date());
        }
    }, [workspaceId]);

    useEffect(() => { loadAnalytics(dateRange); }, [workspaceId, dateRange, loadAnalytics]);

    const filteredChannels = channels.filter(ch => platformFilter === 'all' || ch.platform === platformFilter);

    const aggregated = filteredChannels.reduce((acc, ch) => {
        const s = channelStats[ch.id];
        if (!s) return acc;
        acc.total_posts += s.total_posts || 0;
        acc.published_posts += s.published_posts || 0;
        acc.followers += s.followers || 0;
        acc.reach += s.reach || 0;
        acc.impressions += s.impressions || 0;
        acc.engagement += s.engagement || 0;
        (s.daily_breakdown || []).forEach(d => {
            const ex = acc.daily_map[d.date];
            if (ex) { ex.impressions += d.impressions || 0; ex.reach += d.reach || 0; ex.engagement += d.engagement || 0; }
            else acc.daily_map[d.date] = { ...d };
        });
        acc.top_posts.push(...(s.top_posts || []).map(p => ({ ...p, platform: ch.platform })));
        return acc;
    }, { total_posts: 0, published_posts: 0, followers: 0, reach: 0, impressions: 0, engagement: 0, daily_map: {}, top_posts: [] });

    const engagementRate = aggregated.reach > 0 ? parseFloat(((aggregated.engagement / aggregated.reach) * 100).toFixed(2)) : 0;
    const dailyChartData = Object.entries(aggregated.daily_map).sort(([a], [b]) => a.localeCompare(b)).map(([date, d]) => ({ date, ...d }));
    const platformBreakdown = workspaceSummary?.platform_breakdown || {};
    const topPosts = aggregated.top_posts
        .sort((a, b) => ((b.reactions || 0) + (b.comments || 0) + (b.shares || 0)) - ((a.reactions || 0) + (a.comments || 0) + (a.shares || 0)))
        .slice(0, 5);

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                    <h1 className="text-h1">Analytics</h1>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Real-time performance data from your connected accounts.
                        {lastUpdated && <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.78rem' }}>Updated {lastUpdated.toLocaleTimeString()}</span>}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="themed-select" style={{ minWidth: '130px' }}>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                    <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="themed-select" style={{ minWidth: '150px' }}>
                        <option value="all">All platforms</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter/X</option>
                    </select>
                    <button
                        onClick={() => loadAnalytics(dateRange, true)}
                        disabled={isRefreshing}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem' }}
                    >
                        <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <StatCard title="Total Posts" value={aggregated.total_posts} subtitle={`${aggregated.published_posts} published`} icon={BarChart2} color="#6366f1" loading={isLoading} />
                <StatCard title="Followers" value={aggregated.followers} icon={Users} color="#10b981" loading={isLoading} />
                <StatCard title="Total Reach" value={aggregated.reach} icon={Eye} color="#8b5cf6" loading={isLoading} />
                <StatCard title="Impressions" value={aggregated.impressions} icon={Globe} color="#f59e0b" loading={isLoading} />
                <StatCard title="Engagement" value={aggregated.engagement} subtitle={`${engagementRate}% rate`} icon={TrendingUp} color="#ec4899" loading={isLoading} />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1.5rem' }}>
                        Daily Performance Overview
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.75rem' }}>Impressions · Reach · Engagement</span>
                    </h3>
                    {isLoading ? (
                        <div style={{ height: 220, background: 'var(--bg-secondary)', borderRadius: '8px', animation: 'pulse 1.5s ease infinite' }} />
                    ) : (
                        <BarChart data={dailyChartData} height={220} />
                    )}
                </Card>
                <Card>
                    <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Platform Distribution</h3>
                    {isLoading ? (
                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 180, height: 180, borderRadius: '50%', background: 'var(--bg-secondary)', animation: 'pulse 1.5s ease infinite' }} />
                        </div>
                    ) : (
                        <DonutChart data={platformBreakdown} />
                    )}
                </Card>
            </div>

            {/* Top Posts */}
            {topPosts.length > 0 && (
                <Card style={{ marginBottom: '2rem' }}>
                    <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Top Performing Posts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {topPosts.map((post, i) => (
                            <div key={post.id || i} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '10px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <span style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: i === 0 ? '#f59e0b20' : 'var(--bg-primary)',
                                    color: i === 0 ? '#f59e0b' : 'var(--text-muted)',
                                    fontWeight: 700, fontSize: '0.8rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>{i + 1}</span>
                                {post.image && (
                                    <img src={post.image} alt="" style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                        {post.message || 'Media post'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <PlatformIcon platform={post.platform} size={12} />
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                            {post.created_time ? new Date(post.created_time).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem', flexShrink: 0 }}>
                                    {[
                                        { Icon: Heart, val: post.reactions || 0, color: '#ec4899', label: 'Likes' },
                                        { Icon: MessageSquare, val: post.comments || 0, color: '#6366f1', label: 'Comments' },
                                        { Icon: Share2, val: post.shares || 0, color: '#10b981', label: 'Shares' }
                                    ].map(({ Icon, val, color, label }) => (
                                        <div key={label} style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color, fontSize: '0.85rem', fontWeight: 600 }}>
                                                <Icon size={12} />{val.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Per-Channel Cards */}
            <Card>
                <h3 className="text-h3" style={{ marginBottom: '1.25rem' }}>Channel Breakdown</h3>
                {filteredChannels.length === 0 ? (
                    <p className="text-muted" style={{ fontSize: '0.88rem' }}>No channels connected. Go to Settings to connect your social accounts.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                        {filteredChannels.map(ch => {
                            const s = channelStats[ch.id];
                            return (
                                <div key={ch.id} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {ch.profile_picture && (
                                            <img src={ch.profile_picture} alt={ch.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.style.display = 'none'; }} />
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ch.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                <PlatformIcon platform={ch.platform} size={11} />
                                                {ch.platform?.charAt(0).toUpperCase() + ch.platform?.slice(1)}
                                            </div>
                                        </div>
                                    </div>
                                    {isLoading || !s ? (
                                        <div style={{ height: 60, background: 'var(--bg-primary)', borderRadius: '8px', animation: 'pulse 1.5s ease infinite' }} />
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            {[{ label: 'Posts', val: s.total_posts }, { label: 'Followers', val: s.followers }, { label: 'Reach', val: s.reach }, { label: 'Engagement', val: s.engagement }].map(({ label, val }) => (
                                                <div key={label} style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{(val || 0).toLocaleString()}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </DashboardLayout>
    );
};

export default Analytics;
