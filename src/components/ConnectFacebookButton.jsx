import React from 'react';
import { Facebook } from 'lucide-react';
import Button from './ui/Button';

/**
 * ConnectFacebookButton - Redirects browser to Meta OAuth login flow.
 * @param {string} workspaceId - Selected workspace ID
 * @param {string} variant - Button styling variant
 * @param {object} style - Inline styles override
 */
const ConnectFacebookButton = ({ workspaceId, variant = 'outline', style }) => {
    const handleConnect = () => {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const currentUri = window.location.href;

        // Bundle workspace contextual info in state
        const stateObj = { 
            workspace_id: workspaceId, 
            redirect_uri: currentUri 
        };
        const state = window.Buffer.from(JSON.stringify(stateObj)).toString('base64url');

        const loginUrl = new URL(`${backendUrl}/api/channels/facebook/login/`);
        loginUrl.searchParams.append('workspace_id', workspaceId);
        if (currentUri) loginUrl.searchParams.append('redirect_uri', currentUri);
        window.location.href = loginUrl.toString();
    };

    return (
        <Button
            variant={variant}
            onClick={handleConnect}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                ...style
            }}
        >
            <Facebook size={18} color="#1877f2" />
            <span>Link Account</span>
        </Button>
    );
};

// Polyfill Buffer in browser if not present
if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = {
        from: (str, encoding) => {
            if (encoding === 'base64url' || encoding === 'base64') {
                return {
                    toString: (outEncoding) => {
                        if (outEncoding === 'utf-8') {
                            const binString = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
                            const bytes = new Uint8Array(binString.length);
                            for (let i = 0; i < binString.length; i++) {
                                bytes[i] = binString.charCodeAt(i);
                            }
                            return new TextDecoder().decode(bytes);
                        }
                        return str;
                    }
                };
            }
            return {
                toString: () => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)))
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=/g, '')
            };
        }
    };
}

export default ConnectFacebookButton;
