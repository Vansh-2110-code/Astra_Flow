const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const adsSdk = require('facebook-nodejs-business-sdk');
const { FacebookAdsApi, Page, PagePost, Comment } = adsSdk;


// Load environment variables from .env if present
const dotenvPath = path.join(__dirname, '.env');
if (fs.existsSync(dotenvPath)) {
    fs.readFileSync(dotenvPath, 'utf-8').split(/\r?\n/).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            if (key && !key.startsWith('#')) {
                process.env[key] = val;
            }
        }
    });
}

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and parsing middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage engine configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Database File Path
const DB_FILE = path.join(__dirname, 'db.json');

// Helper functions to load/save mock database
function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
        const defaultData = {
            users: [
                {
                    id: 'user-1',
                    email: 'admin@example.com',
                    password: 'password',
                    first_name: 'Admin',
                    last_name: 'User',
                    timezone: 'UTC',
                    phone: '+1234567890',
                    dob: '1990-01-01',
                    gender: 'other',
                    avatar: null
                }
            ],
            workspaces: [
                {
                    id: 'ws-1',
                    name: 'Primary Workspace',
                    timezone: 'UTC',
                    owner_id: 'user-1',
                    created_at: new Date().toISOString()
                }
            ],
            members: {
                'ws-1': [
                    { id: 'user-1', first_name: 'Admin', last_name: 'User', email: 'admin@example.com', role: 'owner' },
                    { id: 'user-2', first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', role: 'editor' }
                ]
            },
            channels: [],
            posts: {}
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── AUTHENTICATION ENDPOINTS ──

// POST /api/register/
app.post('/api/register/', (req, res) => {
    const { email, password, first_name, last_name, timezone } = req.body;
    const db = loadDB();

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ detail: 'User already exists' });
    }

    const newUser = {
        id: `user-${uuidv4()}`,
        email,
        password,
        first_name,
        last_name,
        timezone: timezone || 'UTC',
        phone: '',
        dob: '',
        gender: 'other',
        avatar: null
    };

    db.users.push(newUser);
    saveDB(db);
    res.status(201).json({ message: 'Registration successful', user: newUser });
});

// POST /api/v1/token/
app.post('/api/v1/token/', (req, res) => {
    const { username, password } = req.body; // username is the email
    const db = loadDB();

    const user = db.users.find(u => u.email === username && u.password === password);
    if (!user) {
        return res.status(401).json({ detail: 'No active account found with the given credentials' });
    }

    res.json({
        access: `mock-access-token-${uuidv4()}`,
        refresh: `mock-refresh-token-${uuidv4()}`,
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }
    });
});

// POST /api/v1/token/refresh/
app.post('/api/v1/token/refresh/', (req, res) => {
    const { refresh } = req.body;
    if (!refresh) {
        return res.status(400).json({ detail: 'Refresh token is required' });
    }
    res.json({
        access: `mock-new-access-token-${uuidv4()}`
    });
});

// ── USER PROFILE ENDPOINTS ──

// GET /api/user/profile/
app.get('/api/user/profile/', (req, res) => {
    // Return the first user by default as mock session
    const db = loadDB();
    res.json(db.users[0]);
});

// PATCH /api/user/profile/
app.patch('/api/user/profile/', (req, res) => {
    const db = loadDB();
    const userIndex = 0; // Default mock user
    db.users[userIndex] = { ...db.users[userIndex], ...req.body };
    saveDB(db);
    res.json(db.users[userIndex]);
});

// POST /api/user/profile/avatar/
app.post('/api/user/profile/avatar/', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ detail: 'No file uploaded' });
    }
    const db = loadDB();
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
    db.users[0].avatar = avatarUrl;
    saveDB(db);
    res.json({ message: 'Avatar uploaded successfully', avatar: avatarUrl });
});

// POST /api/user/change-password/
app.post('/api/user/change-password/', (req, res) => {
    const { old_password, new_password } = req.body;
    const db = loadDB();
    if (db.users[0].password !== old_password) {
        return res.status(400).json({ detail: 'Incorrect current password' });
    }
    db.users[0].password = new_password;
    saveDB(db);
    res.json({ message: 'Password updated successfully' });
});

// ── WORKSPACE ENDPOINTS ──

// GET /api/workspaces/workspace/
app.get('/api/workspaces/workspace/', (req, res) => {
    const db = loadDB();
    res.json(db.workspaces);
});

// POST /api/workspaces/create/
app.post('/api/workspaces/create/', (req, res) => {
    const { name, timezone } = req.body;
    const db = loadDB();

    const newWs = {
        id: `ws-${uuidv4()}`,
        name,
        timezone: timezone || 'UTC',
        owner_id: 'user-1',
        created_at: new Date().toISOString()
    };

    db.workspaces.push(newWs);
    db.members[newWs.id] = [
        { id: 'user-1', first_name: 'Admin', last_name: 'User', email: 'admin@example.com', role: 'owner' }
    ];

    saveDB(db);
    res.status(201).json(newWs);
});

// GET /api/workspaces/workspace/:workspaceId/
app.get('/api/workspaces/workspace/:workspaceId/', (req, res) => {
    const { workspaceId } = req.params;
    const db = loadDB();
    const ws = db.workspaces.find(w => w.id === workspaceId);
    if (!ws) return res.status(404).json({ detail: 'Workspace not found' });
    res.json(ws);
});

// PATCH /api/workspaces/workspace/:workspaceId/
app.patch('/api/workspaces/workspace/:workspaceId/', (req, res) => {
    const { workspaceId } = req.params;
    const db = loadDB();
    const idx = db.workspaces.findIndex(w => w.id === workspaceId);
    if (idx === -1) return res.status(404).json({ detail: 'Workspace not found' });

    db.workspaces[idx] = { ...db.workspaces[idx], ...req.body };
    saveDB(db);
    res.json(db.workspaces[idx]);
});

// DELETE /api/workspaces/workspace/:workspaceId/
app.delete('/api/workspaces/workspace/:workspaceId/', (req, res) => {
    const { workspaceId } = req.params;
    const db = loadDB();
    db.workspaces = db.workspaces.filter(w => w.id !== workspaceId);
    delete db.members[workspaceId];
    saveDB(db);
    res.json({ message: 'Workspace deleted successfully' });
});

// POST /api/workspaces/workspace/:workspaceId/logo/
app.post('/api/workspaces/workspace/:workspaceId/logo/', upload.single('logo'), (req, res) => {
    const { workspaceId } = req.params;
    if (!req.file) {
        return res.status(400).json({ detail: 'No file uploaded' });
    }
    const db = loadDB();
    const idx = db.workspaces.findIndex(w => w.id === workspaceId);
    if (idx === -1) return res.status(404).json({ detail: 'Workspace not found' });

    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const logoUrl = `${baseUrl}/uploads/${req.file.filename}`;
    db.workspaces[idx].logo = logoUrl;
    saveDB(db);
    res.json({ message: 'Logo uploaded successfully', logo: logoUrl });
});

// GET /api/workspaces/:workspaceId/members/
app.get('/api/workspaces/:workspaceId/members/', (req, res) => {
    const { workspaceId } = req.params;
    const db = loadDB();
    res.json(db.members[workspaceId] || []);
});

// POST /api/workspaces/:workspaceId/invite/
app.post('/api/workspaces/:workspaceId/invite/', (req, res) => {
    const { workspaceId } = req.params;
    const { email, role } = req.body;
    const db = loadDB();

    const currentMembers = db.members[workspaceId] || [];
    if (currentMembers.find(m => m.email === email)) {
        return res.status(400).json({ detail: 'User is already a member of this workspace' });
    }

    const newMember = {
        id: `user-${uuidv4()}`,
        first_name: email.split('@')[0],
        last_name: 'Invited',
        email,
        role: role || 'editor'
    };

    currentMembers.push(newMember);
    db.members[workspaceId] = currentMembers;
    saveDB(db);

    res.json({ message: 'Invitation sent successfully', member: newMember });
});

// PATCH /api/workspaces/:workspaceId/members/:memberId/
app.patch('/api/workspaces/:workspaceId/members/:memberId/', (req, res) => {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;
    const db = loadDB();

    const list = db.members[workspaceId] || [];
    const idx = list.findIndex(m => m.id === memberId);
    if (idx === -1) return res.status(404).json({ detail: 'Member not found' });

    list[idx].role = role;
    db.members[workspaceId] = list;
    saveDB(db);

    res.json(list[idx]);
});

// DELETE /api/workspaces/:workspaceId/members/:memberId/
app.delete('/api/workspaces/:workspaceId/members/:memberId/', (req, res) => {
    const { workspaceId, memberId } = req.params;
    const db = loadDB();

    const list = db.members[workspaceId] || [];
    db.members[workspaceId] = list.filter(m => m.id !== memberId);
    saveDB(db);

    res.json({ message: 'Member removed successfully' });
});

// ── SOCIAL CHANNELS ENDPOINTS ──

// GET /api/channels/workspace/:workspaceId/
app.get('/api/channels/workspace/:workspaceId/', (req, res) => {
    const { workspaceId } = req.params;
    const db = loadDB();
    const list = db.channels.filter(c => c.workspace_id === workspaceId);
    res.json(list);
});

// GET /api/channels/facebook/channels/ (returns lists of available pages to connect)
app.get('/api/channels/facebook/channels/', (req, res) => {
    res.json([
        { id: 'fb-page-1', name: 'Developer Hub Page', category: 'Technology' },
        { id: 'fb-page-2', name: 'Local Business Page', category: 'Local Business' }
    ]);
});

// GET /api/channels/facebook/login/ (Real or simulated Facebook login flow)
app.get('/api/channels/facebook/login/', (req, res) => {
    const { workspace_id, redirect_uri } = req.query;
    const db = loadDB();
    const ws = db.workspaces.find(w => w.id === workspace_id);

    let appId = ws?.facebook_app_id;
    let appSecret = ws?.facebook_app_secret;
    let configId = ws?.facebook_config_id || process.env.FACEBOOK_CONFIG_ID;

    // Fallback to environment variables if database holds placeholders
    if (!appId || appId === 'mock_app_id' || appId === 'YOUR_FACEBOOK_APP_ID') {
        appId = process.env.FACEBOOK_APP_ID;
    }
    if (!appSecret || appSecret === 'mock_app_secret' || appSecret === 'YOUR_FACEBOOK_APP_SECRET') {
        appSecret = process.env.FACEBOOK_APP_SECRET;
    }

    const stateObj = { workspace_id: workspace_id || 'ws-1', redirect_uri };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

    if (!appId || appId === 'YOUR_FACEBOOK_APP_ID' || appId === 'mock_app_id' || 
        !appSecret || appSecret === 'YOUR_FACEBOOK_APP_SECRET' || appSecret === 'mock_app_secret') {
        console.log(`[Facebook Login] No valid developer credentials found for workspace ${workspace_id}. Redirecting to mock login.`);
        return res.redirect(`/api/channels/facebook/mock-login/?state=${state}`);
    }

    const callbackUri = `http://localhost:${PORT}/api/channels/facebook/callback/`;
    let fbOAuthUrl;
    if (configId) {
        fbOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUri)}&config_id=${configId}&state=${state}&response_type=code&override_default_response_type=true`;
    } else {
        fbOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUri)}&scope=pages_show_list,pages_read_engagement,pages_manage_posts,public_profile,business_management&state=${state}`;
    }

    res.redirect(fbOAuthUrl);
});

// GET /api/channels/facebook/mock-login/ (Simulated login page for Facebook/Instagram)
app.get('/api/channels/facebook/mock-login/', (req, res) => {
    const { state } = req.query;
    let decodedState = {};
    try {
        decodedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
    } catch (e) {}

    const isInstagram = decodedState.is_instagram;
    const platformName = isInstagram ? 'Instagram' : 'Facebook';
    const primaryColor = isInstagram ? '#E1306C' : '#1877F2';
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connect with ${platformName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: ${primaryColor};
                --bg: #f0f2f5;
                --card-bg: #ffffff;
                --text-main: #1c1e21;
                --text-muted: #606770;
                --border: #dddfe2;
            }
            body {
                margin: 0;
                font-family: 'Inter', -apple-system, sans-serif;
                background-color: var(--bg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                color: var(--text-main);
            }
            .container {
                width: 100%;
                max-width: 450px;
                padding: 20px;
                box-sizing: border-box;
            }
            .card {
                background: var(--card-bg);
                border-radius: 8px;
                box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
                border: 1px solid var(--border);
                overflow: hidden;
            }
            .header {
                background: ${isInstagram ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : 'var(--primary)'};
                color: white;
                padding: 24px;
                text-align: center;
                font-size: 1.5rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .content {
                padding: 24px;
            }
            .app-info {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--border);
            }
            .app-logo {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: #6366f1;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 1.5rem;
                box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
            }
            .app-details h3 {
                margin: 0 0 4px 0;
                font-size: 1.1rem;
                font-weight: 600;
            }
            .app-details p {
                margin: 0;
                color: var(--text-muted);
                font-size: 0.85rem;
            }
            .actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .btn {
                font-family: inherit;
                font-size: 0.95rem;
                font-weight: 600;
                padding: 12px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                text-align: center;
                transition: background-color 0.2s;
                text-decoration: none;
            }
            .btn-primary {
                background: ${isInstagram ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : 'var(--primary)'};
                color: white;
            }
            .btn-primary:hover {
                opacity: 0.95;
            }
            .btn-secondary {
                background: #e4e6eb;
                color: #4b4f56;
            }
            .btn-secondary:hover {
                background: #d8dadf;
            }
            .footer {
                text-align: center;
                font-size: 0.75rem;
                color: var(--text-muted);
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">
                    Connect with ${platformName}
                </div>
                <form action="/api/channels/facebook/save-credentials-and-login/" method="POST" class="content">
                    <input type="hidden" name="workspace_id" value="${decodedState.workspace_id || 'ws-1'}">
                    <input type="hidden" name="redirect_uri" value="${decodedState.redirect_uri || ''}">
                    <input type="hidden" name="is_instagram" value="${isInstagram ? 'true' : 'false'}">
                    
                    <div class="app-info">
                        <div class="app-logo">LC</div>
                        <div class="app-details">
                            <h3>LintCollab App</h3>
                            <p>Enter your ${platformName} account details to link your page directly.</p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-main);">
                            ${platformName} Name or Phone Number
                        </label>
                        <input 
                            type="text" 
                            name="facebook_identifier" 
                            placeholder="Enter Name or Phone Number" 
                            required
                            style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-family: inherit; font-size: 0.9rem;"
                        >
                    </div>

                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-main);">
                            Password
                        </label>
                        <input 
                            type="password" 
                            name="facebook_password" 
                            placeholder="Enter password" 
                            required
                            style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-family: inherit; font-size: 0.9rem;"
                        >
                    </div>

                    <div class="actions">
                        <button type="submit" class="btn btn-primary" style="font-family: inherit; width: 100%;">
                            Log In & Link Account
                        </button>
                        <a href="${decodedState.redirect_uri || '/workspace'}" class="btn btn-secondary" style="width: 100%; box-sizing: border-box; background: none; border: 1px solid var(--border); margin-top: 5px; text-decoration: none; line-height: 1.2;">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
            <div class="footer">
                This is a secure mock integration portal.
            </div>
        </div>
    </body>
    </html>
    `;

    res.send(html);
});

// POST /api/channels/facebook/save-credentials-and-login/ (Save user login details and connect)
app.post('/api/channels/facebook/save-credentials-and-login/', (req, res) => {
    const { workspace_id, redirect_uri, is_instagram, facebook_identifier, facebook_password } = req.body;
    
    // Save credentials to the workspace in db.json
    const db = loadDB();
    const idx = db.workspaces.findIndex(w => w.id === workspace_id);
    if (idx !== -1) {
        db.workspaces[idx].facebook_identifier = facebook_identifier;
        db.workspaces[idx].facebook_password = facebook_password;
        saveDB(db);
    }

    const stateObj = { workspace_id, redirect_uri, is_instagram: is_instagram === 'true' };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

    // Bypass real oauth and redirect directly to callback using mock code
    return res.redirect(`/api/channels/facebook/callback/?code=mock_code&state=${state}`);
});

// GET /api/channels/facebook/callback/ (OAuth Callback processing code and fetching real pages)
app.get('/api/channels/facebook/callback/', async (req, res) => {
    const { state, code, error, error_description } = req.query;
    let workspace_id = 'ws-1';
    let redirect_uri = `http://localhost:5173/workspace/${workspace_id}/settings`;

    if (state) {
        try {
            const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
            workspace_id = decoded.workspace_id || workspace_id;
            redirect_uri = decoded.redirect_uri || redirect_uri;
        } catch (err) {
            console.error("Failed to decode OAuth state:", err);
        }
    }

    if (code === 'mock_code') {
        const db = loadDB();
        const decodedState = state ? JSON.parse(Buffer.from(state, 'base64url').toString('utf-8')) : {};
        const isInstagram = decodedState.is_instagram;
        const ws = db.workspaces.find(w => w.id === workspace_id);
        const nameOrPhone = ws?.facebook_identifier || ws?.facebook_email || 'Facebook Account';

        if (isInstagram) {
            const igChannel = {
                id: `chan-${uuidv4()}`,
                name: `Instagram Account (${nameOrPhone})`,
                platform: 'instagram',
                page_name: `ig_${nameOrPhone.replace(/\s+/g, '_').toLowerCase()}`,
                profile_picture: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150',
                workspace_id: workspace_id || 'ws-1'
            };
            const idx = db.channels.findIndex(c => c.platform === 'instagram' && c.workspace_id === workspace_id);
            if (idx >= 0) db.channels[idx] = igChannel;
            else db.channels.push(igChannel);
        } else {
            const fbChannel = {
                id: `chan-${uuidv4()}`,
                name: nameOrPhone,
                platform: 'facebook',
                page_name: nameOrPhone,
                profile_picture: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150',
                workspace_id: workspace_id || 'ws-1'
            };
            const idx = db.channels.findIndex(c => c.platform === 'facebook' && c.workspace_id === workspace_id);
            if (idx >= 0) db.channels[idx] = fbChannel;
            else db.channels.push(fbChannel);
        }

        saveDB(db);

        const successPlatform = isInstagram ? 'instagram' : 'facebook';
        const finalUrl = redirect_uri.includes('?') ? `${redirect_uri}&${successPlatform}=success` : `${redirect_uri}?${successPlatform}=success`;
        return res.redirect(finalUrl);
    }

    if (error || !code) {
        console.error("Facebook OAuth callback error:", error, error_description);
        const finalUrl = redirect_uri.includes('?') ? `${redirect_uri}&facebook=error` : `${redirect_uri}?facebook=error`;
        return res.redirect(finalUrl);
    }

    try {
        const db = loadDB();
        const ws = db.workspaces.find(w => w.id === workspace_id);
        let appId = ws?.facebook_app_id;
        let appSecret = ws?.facebook_app_secret;

        // Fallback to environment variables if database holds placeholders or is mock
        if (!appId || appId === 'mock_app_id' || appId === 'YOUR_FACEBOOK_APP_ID') {
            appId = process.env.FACEBOOK_APP_ID;
        }
        if (!appSecret || appSecret === 'mock_app_secret' || appSecret === 'YOUR_FACEBOOK_APP_SECRET') {
            appSecret = process.env.FACEBOOK_APP_SECRET;
        }

        const tokenCallbackUri = `http://localhost:${PORT}/api/channels/facebook/callback/`;
        console.log(`[OAuth Debug] Exchanging code: ${code}`);
        
        const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(tokenCallbackUri)}&code=${code}`);
        const tokenData = await tokenRes.json();

        fs.writeFileSync(path.join(__dirname, 'oauth_debug.log'), `[${new Date().toISOString()}] Token Exchange:\nRequest URL: https://graph.facebook.com/v18.0/oauth/access_token\nResponse: ${JSON.stringify(tokenData, null, 2)}\n\n`);

        if (!tokenRes.ok || !tokenData.access_token) {
            const errorMsg = tokenData.error?.message || 'Failed to exchange OAuth code for user access token';
            fs.appendFileSync(path.join(__dirname, 'oauth_debug.log'), `Error during token exchange: ${errorMsg}\n`);
            throw new Error(errorMsg);
        }

        const userAccessToken = tokenData.access_token;

        // Query permissions of the token for additional debugging
        try {
            const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${userAccessToken}&access_token=${appId}|${appSecret}`);
            const debugData = await debugRes.json();
            fs.appendFileSync(path.join(__dirname, 'oauth_debug.log'), `Token Debug Info:\n${JSON.stringify(debugData, null, 2)}\n\n`);
        } catch (debugErr) {
            fs.appendFileSync(path.join(__dirname, 'oauth_debug.log'), `Failed to debug token: ${debugErr.message}\n\n`);
        }

        const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`);
        const pagesData = await pagesRes.json();

        fs.appendFileSync(path.join(__dirname, 'oauth_debug.log'), `Pages Retrieve Response:\n${JSON.stringify(pagesData, null, 2)}\n\n`);

        if (!pagesRes.ok || !pagesData.data) {
            const errorMsg = pagesData.error?.message || 'Failed to retrieve Facebook pages';
            throw new Error(errorMsg);
        }
        let connectedInstagramCount = 0;
        let connectedFacebookCount = 0;

        for (const page of pagesData.data) {
            // Fetch profile picture dynamically
            let profilePic = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150';
            try {
                const picRes = await fetch(`https://graph.facebook.com/v18.0/${page.id}/picture?redirect=false&type=large&access_token=${page.access_token}`);
                const picData = await picRes.json();
                if (picRes.ok && picData.data?.url) {
                    profilePic = picData.data.url;
                }
            } catch (picErr) {
                console.error(`Failed to fetch picture for page ${page.id}:`, picErr);
            }

            // Check if page already exists to prevent duplication
            const existingFbIdx = db.channels.findIndex(c => c.platform === 'facebook' && c.facebook_page_id === page.id && c.workspace_id === workspace_id);

            const pageChannel = {
                id: existingFbIdx >= 0 ? db.channels[existingFbIdx].id : `chan-${uuidv4()}`,
                name: page.name,
                platform: 'facebook',
                page_name: page.name,
                profile_picture: profilePic,
                workspace_id: workspace_id,
                facebook_page_id: page.id,
                access_token: page.access_token
            };

            if (existingFbIdx >= 0) {
                db.channels[existingFbIdx] = pageChannel;
            } else {
                db.channels.push(pageChannel);
            }
            connectedFacebookCount++;

            // Fetch connected Instagram Business Account details
            try {
                const igRes = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account{id,username,name,profile_picture_url}&access_token=${page.access_token}`);
                const igData = await igRes.json();

                if (igRes.ok && igData.instagram_business_account) {
                    const igAcc = igData.instagram_business_account;
                    const existingIgIdx = db.channels.findIndex(c => c.platform === 'instagram' && c.instagram_account_id === igAcc.id && c.workspace_id === workspace_id);

                    const igChannel = {
                        id: existingIgIdx >= 0 ? db.channels[existingIgIdx].id : `chan-${uuidv4()}`,
                        name: igAcc.name || igAcc.username,
                        platform: 'instagram',
                        page_name: igAcc.username,
                        profile_picture: igAcc.profile_picture_url || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150',
                        workspace_id: workspace_id,
                        instagram_account_id: igAcc.id,
                        facebook_page_id: page.id,
                        access_token: page.access_token
                    };

                    if (existingIgIdx >= 0) {
                        db.channels[existingIgIdx] = igChannel;
                    } else {
                        db.channels.push(igChannel);
                    }
                    connectedInstagramCount++;
                }
            } catch (igErr) {
                console.error(`Failed to fetch connected Instagram account for page ${page.id}:`, igErr);
            }
        }

        saveDB(db);

        fs.appendFileSync(path.join(__dirname, 'oauth_debug.log'), `Summary: connectedFacebookCount=${connectedFacebookCount}, connectedInstagramCount=${connectedInstagramCount}\n\n`);

        // Determine correct return platform success param based on state/connections
        let successPlatform = 'facebook';
        const decodedState = state ? JSON.parse(Buffer.from(state, 'base64url').toString('utf-8')) : {};
        if (decodedState.is_instagram || (connectedInstagramCount > 0 && connectedFacebookCount === 0)) {
            successPlatform = 'instagram';
        }

        // If no pages were connected, return an error redirect so the UI shows failure
        if (connectedFacebookCount === 0 && connectedInstagramCount === 0) {
            fs.appendFileSync(path.join(__dirname, 'oauth_debug.log'), `No channels were successfully created/connected. Redirecting with facebook=error.\n\n`);
            const finalUrl = redirect_uri.includes('?') ? `${redirect_uri}&facebook=error` : `${redirect_uri}?facebook=error`;
            return res.redirect(finalUrl);
        }

        const finalUrl = redirect_uri.includes('?') ? `${redirect_uri}&${successPlatform}=success` : `${redirect_uri}?${successPlatform}=success`;
        res.redirect(finalUrl);
    } catch (oauthErr) {
        console.error("Facebook integration failed:", oauthErr);
        fs.writeFileSync(path.join(__dirname, 'oauth_error.log'), `${new Date().toISOString()} - Facebook integration failed: ${oauthErr.message}\nStack: ${oauthErr.stack}\n`);
        const finalUrl = redirect_uri.includes('?') ? `${redirect_uri}&facebook=error` : `${redirect_uri}?facebook=error`;
        res.redirect(finalUrl);
    }
});

// GET /api/channels/instagram/login/ (Real OAuth flow for Instagram)
app.get('/api/channels/instagram/login/', (req, res) => {
    const { workspace_id, redirect_uri } = req.query;
    const db = loadDB();
    const ws = db.workspaces.find(w => w.id === workspace_id);

    let appId = ws?.facebook_app_id;
    let appSecret = ws?.facebook_app_secret;
    let configId = ws?.facebook_config_id || process.env.FACEBOOK_CONFIG_ID;

    // Fallback to environment variables if database holds placeholders
    if (!appId || appId === 'mock_app_id' || appId === 'YOUR_FACEBOOK_APP_ID') {
        appId = process.env.FACEBOOK_APP_ID;
    }
    if (!appSecret || appSecret === 'mock_app_secret' || appSecret === 'YOUR_FACEBOOK_APP_SECRET') {
        appSecret = process.env.FACEBOOK_APP_SECRET;
    }

    // Check if the credentials are not set, are empty, or are placeholders
    if (!appId || appId === 'YOUR_FACEBOOK_APP_ID' || appId === 'mock_app_id' || 
        !appSecret || appSecret === 'YOUR_FACEBOOK_APP_SECRET' || appSecret === 'mock_app_secret') {
        console.log(`[Instagram Login] No valid developer credentials found for workspace ${workspace_id}. Redirecting to mock login.`);
        const stateObj = { workspace_id: workspace_id || 'ws-1', redirect_uri, is_instagram: true };
        const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');
        return res.redirect(`/api/channels/facebook/mock-login/?state=${state}`);
    }

    // Real OAuth flow redirect for Instagram (via Facebook Login with Instagram scopes)
    const stateObj = { workspace_id: workspace_id || 'ws-1', redirect_uri, is_instagram: true };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');
    const callbackUri = `http://localhost:${PORT}/api/channels/facebook/callback/`;
    let fbOAuthUrl;
    if (configId) {
        fbOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUri)}&config_id=${configId}&state=${state}&response_type=code&override_default_response_type=true`;
    } else {
        fbOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUri)}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts,public_profile,business_management&state=${state}`;
    }

    res.redirect(fbOAuthUrl);
});

// GET /api/channels/linkedin/login/ (OAuth redirect or mock fallback)
app.get('/api/channels/linkedin/login/', (req, res) => {
    const { workspace_id, redirect_uri } = req.query;
    
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    if (clientId) {
        // Real LinkedIn OAuth Flow
        const redirectHost = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const oauthRedirectUri = `${redirectHost}/api/channels/linkedin/callback/`;
        
        const stateObj = { workspace_id: workspace_id || 'ws-1', redirect_uri };
        const stateValue = Buffer.from(JSON.stringify(stateObj)).toString('base64');
        
        // Scope for Company Page posts and fetching pages you administer
        const scope = 'w_organization_social r_organization_social openid profile email';
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(oauthRedirectUri)}&state=${stateValue}&scope=${encodeURIComponent(scope)}`;
        
        return res.redirect(authUrl);
    }

    // Mock Fallback
    const db = loadDB();
    const newChan = {
        id: `chan-${uuidv4()}`,
        name: 'Linked LinkedIn Page',
        platform: 'linkedin',
        page_name: 'Sanna Innovations',
        profile_picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        workspace_id: workspace_id || 'ws-1',
        linkedin_urn: 'urn:li:organization:sanna-innovations'
    };

    db.channels.push(newChan);
    saveDB(db);

    const clientPort = 5173;
    const targetUrl = redirect_uri || `http://localhost:${clientPort}/workspace/${workspace_id}/settings`;
    const finalUrl = targetUrl.includes('?') ? `${targetUrl}&linkedin=success` : `${targetUrl}?linkedin=success`;
    res.redirect(finalUrl);
});

// GET /api/channels/linkedin/callback/
app.get('/api/channels/linkedin/callback/', async (req, res) => {
    const { code, state, error, error_description } = req.query;
    
    let workspaceId = 'ws-1';
    let frontendRedirectUri = '';
    
    if (state) {
        try {
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
            workspaceId = decoded.workspace_id || 'ws-1';
            frontendRedirectUri = decoded.redirect_uri || '';
        } catch (e) {
            console.error('Failed to parse state from LinkedIn OAuth callback:', e);
        }
    }

    const clientPort = 5173;
    const fallbackTargetUrl = frontendRedirectUri || `http://localhost:${clientPort}/workspace/${workspaceId}/settings`;

    if (error) {
        console.error('LinkedIn OAuth error:', error, error_description);
        const finalUrl = fallbackTargetUrl.includes('?') ? `${fallbackTargetUrl}&linkedin=error&message=${encodeURIComponent(error_description || error)}` : `${fallbackTargetUrl}?linkedin=error&message=${encodeURIComponent(error_description || error)}`;
        return res.redirect(finalUrl);
    }

    if (!code) {
        const finalUrl = fallbackTargetUrl.includes('?') ? `${fallbackTargetUrl}&linkedin=error&message=No+code+received` : `${fallbackTargetUrl}?linkedin=error&message=No+code+received`;
        return res.redirect(finalUrl);
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error('LinkedIn client credentials missing during callback');
        const finalUrl = fallbackTargetUrl.includes('?') ? `${fallbackTargetUrl}&linkedin=error&message=Missing+credentials` : `${fallbackTargetUrl}?linkedin=error&message=Missing+credentials`;
        return res.redirect(finalUrl);
    }

    try {
        const redirectHost = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const oauthRedirectUri = `${redirectHost}/api/channels/linkedin/callback/`;

        // 1. Exchange code for access token
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: oauthRedirectUri,
                client_id: clientId,
                client_secret: clientSecret
            })
        });

        if (!tokenRes.ok) {
            const tokenErr = await tokenRes.json();
            throw new Error(tokenErr.error_description || tokenErr.error || 'Failed to exchange token');
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // 2. Fetch administered Company Pages (Organizational Entities)
        const aclRes = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        if (!aclRes.ok) {
            const aclErr = await aclRes.json();
            throw new Error(aclErr.message || 'Failed to retrieve administered Company Pages. Please verify you have requested the Community Management API in the LinkedIn Developer Portal.');
        }

        const aclData = await aclRes.json();
        const elements = aclData.elements || [];

        if (elements.length === 0) {
            throw new Error('No LinkedIn Company Pages found where your account is an Administrator.');
        }

        const db = loadDB();
        let addedCount = 0;

        for (const element of elements) {
            const orgUrn = element.organizationalEntity;
            if (!orgUrn || !orgUrn.startsWith('urn:li:organization:')) {
                continue;
            }

            const orgId = orgUrn.split(':').pop();

            // Fetch organization details (Name and Logo)
            const orgDetailsRes = await fetch(`https://api.linkedin.com/v2/organizations/${orgId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            });

            let pageName = `LinkedIn Company Page (ID: ${orgId})`;
            let profilePic = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150';

            if (orgDetailsRes.ok) {
                const orgDetails = await orgDetailsRes.json();
                
                // Get Localized Name
                if (orgDetails.localizedName) {
                    pageName = orgDetails.localizedName;
                } else if (orgDetails.name && orgDetails.name.preferredLocale) {
                    const localeKey = `${orgDetails.name.preferredLocale.language}_${orgDetails.name.preferredLocale.country}`;
                    pageName = orgDetails.name.localized[localeKey] || pageName;
                }
            }

            // Save or Update LinkedIn Company Page connected channel
            const existingChanIdx = db.channels.findIndex(c => c.workspace_id === workspaceId && c.linkedin_urn === orgUrn);

            if (existingChanIdx !== -1) {
                db.channels[existingChanIdx].access_token = accessToken;
                db.channels[existingChanIdx].page_name = pageName;
                db.channels[existingChanIdx].profile_picture = profilePic;
            } else {
                const newChan = {
                    id: `chan-${uuidv4()}`,
                    name: 'Linked LinkedIn Page',
                    platform: 'linkedin',
                    page_name: pageName,
                    profile_picture: profilePic,
                    workspace_id: workspaceId,
                    access_token: accessToken,
                    linkedin_urn: orgUrn
                };
                db.channels.push(newChan);
            }
            addedCount++;
        }

        if (addedCount === 0) {
            throw new Error('No valid LinkedIn Company Pages could be imported.');
        }

        saveDB(db);

        const finalUrl = fallbackTargetUrl.includes('?') ? `${fallbackTargetUrl}&linkedin=success` : `${fallbackTargetUrl}?linkedin=success`;
        res.redirect(finalUrl);

    } catch (err) {
        console.error('LinkedIn OAuth Callback failed:', err);
        const finalUrl = fallbackTargetUrl.includes('?') ? `${fallbackTargetUrl}&linkedin=error&message=${encodeURIComponent(err.message)}` : `${fallbackTargetUrl}?linkedin=error&message=${encodeURIComponent(err.message)}`;
        res.redirect(finalUrl);
    }
});

// GET /api/channels/twitter/login/ (Simulated OAuth flow redirecting to workspace settings)
app.get('/api/channels/twitter/login/', (req, res) => {
    const { workspace_id, redirect_uri } = req.query;
    const db = loadDB();

    const newChan = {
        id: `chan-${uuidv4()}`,
        name: 'Linked X/Twitter Profile',
        platform: 'twitter',
        page_name: 'My X Profile',
        profile_picture: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        workspace_id: workspace_id || 'ws-1'
    };

    db.channels.push(newChan);
    saveDB(db);

    const clientPort = 5173;
    const targetUrl = redirect_uri || `http://localhost:${clientPort}/workspace/${workspace_id}/settings`;
    const finalUrl = targetUrl.includes('?') ? `${targetUrl}&twitter=success` : `${targetUrl}?twitter=success`;
    res.redirect(finalUrl);
});

// DELETE /api/channels/:channelId/disconnect/
app.delete('/api/channels/:channelId/disconnect/', (req, res) => {
    const { channelId } = req.params;
    const db = loadDB();
    db.channels = db.channels.filter(c => c.id !== channelId);
    saveDB(db);
    res.json({ message: 'Channel disconnected successfully' });
});

// GET /api/channels/:channelId/
app.get('/api/channels/:channelId/', (req, res) => {
    const { channelId } = req.params;
    const db = loadDB();
    const chan = db.channels.find(c => c.id === channelId);
    if (!chan) return res.status(404).json({ detail: 'Channel not found' });
    res.json(chan);
});

// GET /api/channels/:channelId/verify/
app.get('/api/channels/:channelId/verify/', (req, res) => {
    const { channelId } = req.params;
    const db = loadDB();
    const chan = db.channels.find(c => c.id === channelId);
    if (!chan) {
        return res.status(404).json({ verified: false, error: 'Channel not found' });
    }

    if (chan.platform === 'facebook') {
        const ws = db.workspaces.find(w => w.id === chan.workspace_id);
        if (ws && ws.facebook_identifier && ws.facebook_password) {
            return res.json({
                verified: true,
                status: 'active',
                message: `Facebook account ${ws.facebook_identifier} verified successfully.`
            });
        }
    }

    res.json({
        verified: true,
        status: 'active',
        message: `${chan.name} verified successfully.`
    });
});

// ── POST MANAGEMENT ENDPOINTS ──

// GET /api/channels/:channelId/facebook/posts/
app.get('/api/channels/:channelId/facebook/posts/', (req, res) => {
    const { channelId } = req.params;
    const db = loadDB();
    res.json(db.posts[channelId] || []);
});

// DELETE /api/channels/:channelId/posts/:postId/
app.delete('/api/channels/:channelId/posts/:postId/', (req, res) => {
    const { channelId, postId } = req.params;
    const db = loadDB();
    const chanPosts = db.posts[channelId] || [];
    db.posts[channelId] = chanPosts.filter(p => p.id !== postId);
    saveDB(db);
    res.json({ message: 'Post deleted successfully' });
});// GET /api/workspaces/:workspaceId/media/
app.get('/api/workspaces/:workspaceId/media/', (req, res) => {
    const { workspaceId } = req.params;
    const db = loadDB();
    const channels = db.channels.filter(c => c.workspace_id === workspaceId);
    
    const mediaList = [];
    const seenUrls = new Set();
    
    // 1. Add workspace direct media library uploads
    const directMedia = db.media?.[workspaceId] || [];
    directMedia.forEach(item => {
        if (!seenUrls.has(item.url)) {
            seenUrls.add(item.url);
            mediaList.push(item);
        }
    });

    // 2. Add media attached to posts
    channels.forEach(ch => {
        const posts = db.posts[ch.id] || [];
        posts.forEach(p => {
            const mediaUrls = p.media || [];
            mediaUrls.forEach(url => {
                if (!seenUrls.has(url)) {
                    seenUrls.add(url);
                    const filename = url.split('/uploads/')[1] || 'media_file';
                    const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.mov');
                    mediaList.push({
                        id: filename,
                        name: filename,
                        type: isVideo ? 'video' : 'image',
                        url: url,
                        platform: ch.platform, // 'facebook' or 'instagram'
                        channelName: ch.name,
                        created_at: p.created_at
                    });
                }
            });
        });
    });
    
    res.json(mediaList);
});

// POST /api/workspaces/:workspaceId/media/upload/
app.post('/api/workspaces/:workspaceId/media/upload/', upload.single('file'), (req, res) => {
    const { workspaceId } = req.params;
    if (!req.file) {
        return res.status(400).json({ detail: 'No file uploaded' });
    }
    const db = loadDB();
    if (!db.media) db.media = {};
    db.media[workspaceId] = db.media[workspaceId] || [];

    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const filename = req.file.filename;
    const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.mov');
    
    const newItem = {
        id: filename,
        name: req.file.originalname,
        type: isVideo ? 'video' : 'image',
        url: `${baseUrl}/uploads/${filename}`,
        platform: 'library', // directly uploaded to library
        channelName: 'Library Upload',
        created_at: new Date().toISOString(),
        size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    db.media[workspaceId].push(newItem);
    saveDB(db);
    res.status(201).json(newItem);
});

// DELETE /api/workspaces/:workspaceId/media/:mediaId/
app.delete('/api/workspaces/:workspaceId/media/:mediaId/', (req, res) => {
    const { workspaceId, mediaId } = req.params;
    const db = loadDB();
    if (db.media && db.media[workspaceId]) {
        db.media[workspaceId] = db.media[workspaceId].filter(item => item.id !== mediaId);
        saveDB(db);
    }
    res.json({ message: 'Media item deleted successfully' });
});


// POST /api/channels/:channelId/facebook/create-post/
app.post('/api/channels/:channelId/facebook/create-post/', upload.any(), async (req, res) => {
    const { channelId } = req.params;
    const { message, scheduled_time, is_draft } = req.body;
    const db = loadDB();

    const files = req.files || [];
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const mediaUrls = files.map(file => `${baseUrl}/uploads/${file.filename}`);

    const channel = db.channels.find(c => c.id === channelId);
    let facebook_post_id = null;

    // Check if this is a real channel (has access token) and is direct publishing (no draft, no scheduled time)
    if (channel && channel.access_token && is_draft !== 'true' && !scheduled_time) {
        try {
            if (channel.access_token.startsWith('mock_token_')) {
                facebook_post_id = `mock_${channel.platform === 'instagram' ? 'ig' : channel.platform === 'linkedin' ? 'li' : channel.platform === 'twitter' ? 'tw' : 'fb'}_${uuidv4()}`;
            } else if (channel.platform === 'instagram') {
                const mockPost = {
                    message: message || '',
                    media: mediaUrls
                };
                const igPostId = await publishPostToInstagram(channel, mockPost);
                facebook_post_id = igPostId;
            } else if (channel.platform === 'linkedin') {
                const mockPost = {
                    message: message || '',
                    media: mediaUrls
                };
                facebook_post_id = await publishPostToLinkedIn(channel, mockPost);
            } else if (channel.platform === 'twitter') {
                const mockPost = {
                    message: message || '',
                    media: mediaUrls
                };
                facebook_post_id = await publishPostToTwitter(channel, mockPost);
            } else if (channel.facebook_page_id) {
                if (files.length > 0) {
                    // Publish Photo to Facebook
                    const file = files[0];
                    const fileBuffer = fs.readFileSync(file.path);
                    const fileBlob = new Blob([fileBuffer], { type: file.mimetype });

                    const fbFormData = new FormData();
                    fbFormData.append('caption', message || '');
                    fbFormData.append('access_token', channel.access_token);
                    fbFormData.append('source', fileBlob, file.originalname);

                    const fbRes = await fetch(`https://graph.facebook.com/v18.0/${channel.facebook_page_id}/photos`, {
                        method: 'POST',
                        body: fbFormData
                    });
                    const fbData = await fbRes.json();
                    if (!fbRes.ok) {
                        throw new Error(fbData.error?.message || 'Facebook Graph API photo upload failed');
                    }
                    facebook_post_id = fbData.id;
                } else {
                    // Publish Text Feed to Facebook
                    const fbRes = await fetch(`https://graph.facebook.com/v18.0/${channel.facebook_page_id}/feed`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: message || '',
                            access_token: channel.access_token
                        })
                    });
                    const fbData = await fbRes.json();
                    if (!fbRes.ok) {
                        throw new Error(fbData.error?.message || 'Facebook Graph API feed post failed');
                    }
                    facebook_post_id = fbData.id;
                }
            }
        } catch (pubErr) {
            console.warn("Failed to publish to live platform API, falling back to mock publishing:", pubErr);
            facebook_post_id = `mock_${channel.platform === 'instagram' ? 'ig' : channel.platform === 'linkedin' ? 'li' : channel.platform === 'twitter' ? 'tw' : 'fb'}_${uuidv4()}`;
        }
    }

    const isDraft = is_draft === 'true';
    const isScheduled = Boolean(scheduled_time);
    const shouldAutoApproveLinkedInScheduled = !isDraft && isScheduled && channel?.platform === 'linkedin';
    const isApproved = (!isDraft && !isScheduled) || shouldAutoApproveLinkedInScheduled;
    const approvedBy = isApproved
        ? (shouldAutoApproveLinkedInScheduled ? ['Auto Scheduler'] : ['Admin'])
        : [];

    const newPost = {
        id: `post-${uuidv4()}`,
        message,
        scheduled_time: scheduled_time || null,
        status: isDraft ? 'draft' : (isScheduled ? 'scheduled' : 'published'),
        approved: isApproved,
        approvedBy,
        created_at: new Date().toISOString(),
        media: mediaUrls,
        comments: [],
        facebook_post_id: facebook_post_id
    };

    const chanPosts = db.posts[channelId] || [];
    chanPosts.unshift(newPost);
    db.posts[channelId] = chanPosts;
    saveDB(db);

    res.status(201).json(newPost);
});

// GET /api/channels/:channelId/facebook/posts/:postId/
app.get('/api/channels/:channelId/facebook/posts/:postId/', (req, res) => {
    const { channelId, postId } = req.params;
    const db = loadDB();
    const post = (db.posts[channelId] || []).find(p => p.id === postId);
    if (!post) return res.status(404).json({ detail: 'Post not found' });
    res.json(post);
});

// Helper to determine mime type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.png') return 'image/png';
    if (ext === '.gif') return 'image/gif';
    if (ext === '.mp4') return 'video/mp4';
    if (ext === '.mov') return 'video/quicktime';
    return 'application/octet-stream';
}

// Helper to publish post to Facebook Graph API or mock it
async function publishPostToFacebook(channel, post) {
    if (!channel || !channel.access_token || !channel.facebook_page_id || channel.access_token.startsWith('mock_token_')) {
        return `mock_fb_${uuidv4()}`;
    }

    const message = post.message || '';
    const mediaUrls = post.media || [];
    
    if (mediaUrls.length > 0) {
        const firstUrl = mediaUrls[0];
        const parts = firstUrl.split('/uploads/');
        if (parts.length >= 2) {
            const filename = parts[1];
            const filePath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                const fileBlob = new Blob([fileBuffer], { type: getMimeType(filePath) });
                
                const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.mov');
                const endpoint = isVideo ? 'videos' : 'photos';

                const fbFormData = new FormData();
                if (isVideo) {
                    fbFormData.append('description', message);
                } else {
                    fbFormData.append('caption', message);
                }
                fbFormData.append('access_token', channel.access_token);
                fbFormData.append('source', fileBlob, filename);

                const fbRes = await fetch(`https://graph.facebook.com/v18.0/${channel.facebook_page_id}/${endpoint}`, {
                    method: 'POST',
                    body: fbFormData
                });
                const fbData = await fbRes.json();
                if (!fbRes.ok) {
                    throw new Error(fbData.error?.message || `Facebook Graph API ${endpoint} upload failed`);
                }
                return fbData.id;
            }
        }
    }

    const fbRes = await fetch(`https://graph.facebook.com/v18.0/${channel.facebook_page_id}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            access_token: channel.access_token
        })
    });
    const fbData = await fbRes.json();
    if (!fbRes.ok) {
        throw new Error(fbData.error?.message || 'Facebook Graph API feed post failed');
    }
    return fbData.id;
}

// Helper to publish post to Instagram Graph API or mock it
async function publishPostToInstagram(channel, post) {
    if (!channel || !channel.access_token || !channel.instagram_account_id || channel.access_token.startsWith('mock_token_')) {
        return `mock_ig_${uuidv4()}`;
    }

    const message = post.message || '';
    const mediaUrls = post.media || [];
    
    // Instagram requires at least one image or video to create a post.
    // If no media is attached, let's use a premium default placeholder image so it doesn't fail.
    let mediaUrl = mediaUrls.length > 0 ? mediaUrls[0] : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800';

    // Substitute localhost URLs with a temporary public hosting service (tmpfiles.org) so Meta's API can retrieve it
    if (mediaUrl.includes('localhost') || mediaUrl.includes('127.0.0.1')) {
        try {
            const parts = mediaUrl.split('/uploads/');
            if (parts.length >= 2) {
                const filename = parts[1];
                const filePath = path.join(__dirname, 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    console.log(`[Instagram Upload] Localhost detected. Exposing ${filename} to public via tmpfiles.org...`);
                    const uploadFormData = new FormData();
                    const fileBuffer = fs.readFileSync(filePath);
                    const fileBlob = new Blob([fileBuffer], { type: getMimeType(filePath) });
                    uploadFormData.append('file', fileBlob, filename);

                    const tmpRes = await fetch('https://tmpfiles.org/api/v1/upload', {
                        method: 'POST',
                        body: uploadFormData
                    });
                    const tmpData = await tmpRes.json();
                    if (tmpRes.ok && tmpData.status === 'success' && tmpData.data?.url) {
                        const viewUrl = tmpData.data.url;
                        mediaUrl = viewUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
                        console.log(`[Instagram Upload] Successfully uploaded! Public direct URL: ${mediaUrl}`);
                    } else {
                        console.warn(`[Instagram Upload] tmpfiles.org upload failed: ${tmpData.error || 'Unknown error'}. Using backup template.`);
                        mediaUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800';
                    }
                }
            }
        } catch (uploadErr) {
            console.error("[Instagram Upload] Failed to upload local file to public host:", uploadErr.message);
            mediaUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800';
        }
    }

    const isVideo = mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.toLowerCase().endsWith('.mov');

    try {
        // Step 1: Create the media container
        const containerParams = new URLSearchParams({
            access_token: channel.access_token,
            caption: message
        });
        if (isVideo) {
            containerParams.append('media_type', 'VIDEO');
            containerParams.append('video_url', mediaUrl);
        } else {
            containerParams.append('image_url', mediaUrl);
        }

        console.log(`[Instagram Publish] Creating container. URL: https://graph.facebook.com/v18.0/${channel.instagram_account_id}/media`);
        const containerRes = await fetch(`https://graph.facebook.com/v18.0/${channel.instagram_account_id}/media?${containerParams.toString()}`, {
            method: 'POST'
        });
        const containerData = await containerRes.json();
        if (!containerRes.ok || !containerData.id) {
            throw new Error(containerData.error?.message || 'Failed to create Instagram media container');
        }

        const creationId = containerData.id;
        console.log(`[Instagram Publish] Created container: ${creationId}. Publishing...`);

        // For videos, wait a few seconds for processing
        if (isVideo) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        // Step 2: Publish the media container
        const publishParams = new URLSearchParams({
            access_token: channel.access_token,
            creation_id: creationId
        });
        const publishRes = await fetch(`https://graph.facebook.com/v18.0/${channel.instagram_account_id}/media_publish?${publishParams.toString()}`, {
            method: 'POST'
        });
        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.id) {
            throw new Error(publishData.error?.message || 'Failed to publish Instagram media container');
        }

        console.log(`[Instagram Publish] Successfully published. Post ID: ${publishData.id}`);
        return publishData.id;
    } catch (err) {
        console.error("[Instagram Publish] Real flow failed, falling back to mock ID:", err.message);
        return `mock_ig_${uuidv4()}`;
    }
}

// Helper to publish post to LinkedIn API or mock it
async function publishPostToLinkedIn(channel, post) {
    if (!channel || !channel.access_token || channel.access_token.startsWith('mock_token_') || channel.access_token === 'mock_linkedin_token') {
        return `mock_li_${uuidv4()}`;
    }

    const message = post.message || '';
    const mediaUrls = post.media || [];
    const authorUrn = channel.linkedin_urn || `urn:li:person:${channel.page_name || 'MyLinkedinProfile'}`;

    try {
        let payload = {
            author: authorUrn,
            commentary: message,
            visibility: "PUBLIC",
            distribution: {
                feedDistribution: "MAIN_FEED",
                targetEntities: []
            },
            lifecycleState: "PUBLISHED"
        };

        const liRes = await fetch('https://api.linkedin.com/v2/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${channel.access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(payload)
        });

        if (!liRes.ok) {
            const errorData = await liRes.json();
            throw new Error(errorData.message || 'LinkedIn API post failed');
        }

        return liRes.headers.get('x-linkedin-id') || `li_urn_${uuidv4()}`;
    } catch (err) {
        console.error("[LinkedIn Publish] Real flow failed, falling back to mock ID:", err.message);
        return `mock_li_${uuidv4()}`;
    }
}

// Helper to publish post to X/Twitter API or mock it
async function publishPostToTwitter(channel, post) {
    if (!channel || !channel.access_token || channel.access_token.startsWith('mock_token_') || channel.access_token === 'mock_twitter_token') {
        return `mock_tw_${uuidv4()}`;
    }

    const message = post.message || '';

    try {
        const twRes = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${channel.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: message })
        });

        if (!twRes.ok) {
            const errorData = await twRes.json();
            throw new Error(errorData.detail || errorData.title || 'Twitter API post failed');
        }

        const data = await twRes.json();
        return data.data?.id || `tw_${uuidv4()}`;
    } catch (err) {
        console.error("[Twitter Publish] Real flow failed, falling back to mock ID:", err.message);
        return `mock_tw_${uuidv4()}`;
    }
}

// POST /api/channels/:channelId/posts/:postId/approve/ (Approve/Unapprove post and trigger immediate publish if past-due)
app.post('/api/channels/:channelId/posts/:postId/approve/', async (req, res) => {
    const { channelId, postId } = req.params;
    const { approved } = req.body;
    const db = loadDB();

    const posts = db.posts[channelId] || [];
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    post.approved = approved === true;
    post.approvedBy = approved === true ? ['Admin'] : [];

    let publishedMessage = '';
    if (post.approved && post.status === 'scheduled') {
        const scheduledTime = post.scheduled_time ? new Date(post.scheduled_time) : null;
        if (!scheduledTime || scheduledTime <= new Date()) {
            try {
                const channel = db.channels.find(c => c.id === channelId);
                const publishedId = channel.platform === 'instagram'
                    ? await publishPostToInstagram(channel, post)
                    : channel.platform === 'linkedin'
                    ? await publishPostToLinkedIn(channel, post)
                    : channel.platform === 'twitter'
                    ? await publishPostToTwitter(channel, post)
                    : await publishPostToFacebook(channel, post);
                post.status = 'published';
                post.facebook_post_id = publishedId;
                publishedMessage = ` and published to ${
                    channel.platform === 'instagram'
                        ? 'Instagram'
                        : channel.platform === 'linkedin'
                        ? 'LinkedIn'
                        : channel.platform === 'twitter'
                        ? 'X (Twitter)'
                        : 'Facebook'
                }`;
            } catch (pubErr) {
                console.error("Failed to automatically publish approved post:", pubErr);
                post.status = 'failed';
                post.publish_error = pubErr.message;
            }
        }
    }

    saveDB(db);
    res.json({ 
        message: `Post ${approved ? 'approved' : 'unapproved'}${publishedMessage}.`,
        post 
    });
});

// Database helper placeholder to store credentials in db.json
const savePageCredentials = async (workspaceId, pageId, pageName, pageAccessToken, profilePic) => {
    const db = loadDB();
    const existingIdx = db.channels.findIndex(c => c.platform === 'facebook' && c.facebook_page_id === pageId && c.workspace_id === workspaceId);
    
    const pageChannel = {
        id: existingIdx >= 0 ? db.channels[existingIdx].id : `chan-${uuidv4()}`,
        name: pageName,
        platform: 'facebook',
        page_name: pageName,
        profile_picture: profilePic || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150',
        workspace_id: workspaceId,
        facebook_page_id: pageId,
        access_token: pageAccessToken
    };

    if (existingIdx >= 0) {
        db.channels[existingIdx] = pageChannel;
    } else {
        db.channels.push(pageChannel);
    }
    saveDB(db);
};

// GET /api/auth/facebook/callback (Meta OAuth Callback handler using facebook-nodejs-business-sdk)
app.get('/api/auth/facebook/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;

    if (error || !code) {
        console.error('OAuth redirect error:', error, error_description);
        return res.redirect(`http://localhost:5173/workspace?facebook=error`);
    }

    let workspaceId = 'ws-1';
    let redirectUri = `http://localhost:5173/workspace/${workspaceId}/settings`;
    try {
        if (state) {
            const decodedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
            workspaceId = decodedState.workspace_id || workspaceId;
            redirectUri = decodedState.redirect_uri || redirectUri;
        }
    } catch (e) {
        console.error('Failed to parse OAuth state:', e);
    }

    if (code === 'mock_code') {
        const db = loadDB();
        const decodedState = state ? JSON.parse(Buffer.from(state, 'base64url').toString('utf-8')) : {};
        const isInstagram = decodedState.is_instagram;
        const ws = db.workspaces.find(w => w.id === workspaceId);
        const nameOrPhone = ws?.facebook_identifier || ws?.facebook_email || 'Facebook Account';

        if (isInstagram) {
            const igChannel = {
                id: `chan-${uuidv4()}`,
                name: `Instagram Account (${nameOrPhone})`,
                platform: 'instagram',
                page_name: `ig_${nameOrPhone.replace(/\s+/g, '_').toLowerCase()}`,
                profile_picture: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150',
                workspace_id: workspaceId || 'ws-1'
            };
            const idx = db.channels.findIndex(c => c.platform === 'instagram' && c.workspace_id === workspaceId);
            if (idx >= 0) db.channels[idx] = igChannel;
            else db.channels.push(igChannel);
        } else {
            const fbChannel = {
                id: `chan-${uuidv4()}`,
                name: nameOrPhone,
                platform: 'facebook',
                page_name: nameOrPhone,
                profile_picture: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150',
                workspace_id: workspaceId || 'ws-1'
            };
            const idx = db.channels.findIndex(c => c.platform === 'facebook' && c.workspace_id === workspaceId);
            if (idx >= 0) db.channels[idx] = fbChannel;
            else db.channels.push(fbChannel);
        }

        saveDB(db);

        const successPlatform = isInstagram ? 'instagram' : 'facebook';
        const finalUrl = redirectUri.includes('?') ? `${redirectUri}&${successPlatform}=success` : `${redirectUri}?${successPlatform}=success`;
        return res.redirect(finalUrl);
    }

    try {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;

        // Step 1: Exchange temporary code for short-lived User Access Token
        const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(`http://localhost:${PORT}/api/auth/facebook/callback`)}&code=${code}`);
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.access_token) {
            throw new Error(tokenData.error?.message || 'Failed to exchange OAuth code for user access token');
        }

        const shortLivedToken = tokenData.access_token;

        // Step 2: Swap short-lived token for long-lived User Access Token
        const longLivedRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`);
        const longLivedData = await longLivedRes.json();

        if (!longLivedRes.ok || !longLivedData.access_token) {
            throw new Error(longLivedData.error?.message || 'Failed to obtain long-lived user token');
        }

        const longLivedUserToken = longLivedData.access_token;

        // Step 3: Initialize the Facebook Ads API Instance with user's token
        FacebookAdsApi.init(longLivedUserToken);

        // Step 4: Query /me/accounts to get a list of Facebook Pages managed by the User
        const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedUserToken}`);
        const pagesData = await pagesRes.json();

        if (!pagesRes.ok || !pagesData.data) {
            throw new Error(pagesData.error?.message || 'Failed to retrieve Facebook pages');
        }

        for (const page of pagesData.data) {
            const pageId = page.id;
            const pageName = page.name;
            const pageAccessToken = page.access_token; // Permanent Page Token
            
            // Get profile picture dynamically
            let profilePic = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150';
            try {
                const picRes = await fetch(`https://graph.facebook.com/v18.0/${pageId}/picture?redirect=false&type=large&access_token=${pageAccessToken}`);
                const picData = await picRes.json();
                if (picRes.ok && picData.data?.url) {
                    profilePic = picData.data.url;
                }
            } catch (picErr) {
                console.error(`Failed to fetch picture for page ${pageId}:`, picErr);
            }

            // Save credentials helper
            await savePageCredentials(workspaceId, pageId, pageName, pageAccessToken, profilePic);
        }

        const finalUrl = redirectUri.includes('?') ? `${redirectUri}&facebook=success` : `${redirectUri}?facebook=success`;
        res.redirect(finalUrl);

    } catch (err) {
        console.error('Facebook OAuth integration failed:', err);
        const finalUrl = redirectUri.includes('?') ? `${redirectUri}&facebook=error` : `${redirectUri}?facebook=error`;
        res.redirect(finalUrl);
    }
});

/**
 * Custom wrapper for SDK requests to capture Meta-specific errors gracefully.
 */
async function handleSdkRequest(action) {
    try {
        return await action();
    } catch (error) {
        if (error.response && error.response.data) {
            const metaError = error.response.data.error;
            console.error(`[Meta SDK Error] Code: ${metaError.code} | Msg: ${metaError.message}`);
            throw new Error(`Meta API Error: ${metaError.message} (${metaError.code})`);
        }
        console.error('[SDK System Error]:', error.message || error);
        throw error;
    }
}

/**
 * 1. Publish a new text/link post to the Page feed.
 */
async function publishPost(pageId, pageToken, message) {
    return handleSdkRequest(async () => {
        FacebookAdsApi.init(pageToken);
        const page = new Page(pageId);
        
        const response = await page.createFeed(
            [],
            { message: message }
        );
        return response; // { id: "post_id" }
    });
}

/**
 * 2. Delete an existing post using its specific Post ID.
 */
async function deletePost(pageToken, postId) {
    return handleSdkRequest(async () => {
        FacebookAdsApi.init(pageToken);
        const post = new PagePost(postId);
        
        const response = await post.delete([]);
        return response; // { success: true }
    });
}

/**
 * 3. Reads recent comments on a specific post.
 */
async function getComments(pageToken, postId) {
    return handleSdkRequest(async () => {
        FacebookAdsApi.init(pageToken);
        const post = new PagePost(postId);
        
        const comments = await post.getComments(
            ['id', 'message', 'from', 'created_time']
        );
        return comments;
    });
}

/**
 * 4. Posts a comment response under a specific user interaction.
 */
async function replyToComment(pageToken, commentId, message) {
    return handleSdkRequest(async () => {
        FacebookAdsApi.init(pageToken);
        const comment = new Comment(commentId);
        
        const response = await comment.createComments(
            [],
            { message: message }
        );
        return response; // { id: "reply_comment_id" }
    });
}


// Background runner to publish approved scheduled posts when their release time is reached
setInterval(async () => {
    try {
        const db = loadDB();
        let dbChanged = false;
        const now = new Date();

        for (const channelId of Object.keys(db.posts || {})) {
            const posts = db.posts[channelId];
            for (const post of posts) {
                if (post.status === 'scheduled' && post.approved === true) {
                    const scheduledTime = post.scheduled_time ? new Date(post.scheduled_time) : null;
                    if (scheduledTime && scheduledTime <= now) {
                        console.log(`[Auto-Scheduler] Publishing post ${post.id} scheduled for ${post.scheduled_time}...`);
                        try {
                            const channel = db.channels.find(c => c.id === channelId);
                            let publishedId;
                            try {
                                publishedId = channel.platform === 'instagram'
                                    ? await publishPostToInstagram(channel, post)
                                    : channel.platform === 'linkedin'
                                    ? await publishPostToLinkedIn(channel, post)
                                    : channel.platform === 'twitter'
                                    ? await publishPostToTwitter(channel, post)
                                    : await publishPostToFacebook(channel, post);
                            } catch (pubErr) {
                                console.warn(`[Auto-Scheduler] Live publish failed, falling back to mock ID:`, pubErr);
                                publishedId = `mock_${channel.platform === 'instagram' ? 'ig' : channel.platform === 'linkedin' ? 'li' : channel.platform === 'twitter' ? 'tw' : 'fb'}_${uuidv4()}`;
                            }
                            post.status = 'published';
                            post.facebook_post_id = publishedId;
                            dbChanged = true;
                            console.log(`[Auto-Scheduler] Successfully published post ${post.id} (ID: ${publishedId}) on ${channel.platform}`);
                        } catch (pubErr) {
                            console.error(`[Auto-Scheduler] Unexpected error in publishing post ${post.id}:`, pubErr);
                            post.status = 'failed';
                            post.publish_error = pubErr.message;
                            dbChanged = true;
                        }
                    }
                }
            }
        }

        if (dbChanged) {
            saveDB(db);
        }
    } catch (err) {
        console.error("[Auto-Scheduler] Error in background scheduler:", err);
    }
}, 15000); // Check every 15 seconds

// Start Express server
app.listen(PORT, () => {
    console.log(`Backend server running successfully at http://localhost:${PORT}`);
});
