// src/services/channelService.js — Social Media Channel Integration API functions.
// Uses centralized Axios client from api.js for automatic auth, error handling, and base URL.

import api from './api';

/**
 * Initiate Facebook OAuth flow.
 * Gets the Facebook login URL from backend and initiates OAuth.
 * Endpoint: GET /api/channels/facebook/login/?workspace_id=<workspace_id>
 * 
 * Note: This endpoint returns a redirect, so we handle it specially.
 * The backend will redirect to Facebook OAuth, then back to our callback URL.
 * 
 * @param {string} workspaceId - The workspace ID to connect Facebook to
 * @returns {Promise} - Resolves with redirect URL or initiates redirect
 */
/**
 * Initiate Facebook OAuth flow.
 * Endpoint: GET /api/channels/facebook/login/?workspace_id=<workspace_id>
 */
export const initiateFacebookLogin = (workspaceId, redirectUri) => {
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = new URL(`${baseUrl}/api/channels/facebook/login/`);
    url.searchParams.append('workspace_id', workspaceId);
    if (redirectUri) url.searchParams.append('redirect_uri', redirectUri);
    window.location.href = url.toString();
};

/**
 * Get Facebook Channels for a workspace.
 * Endpoint: GET /api/channels/facebook/channels/?workspace_id={workspaceId}
 */
export const getFacebookChannels = async (workspaceId) => {
    const res = await api.get('/channels/facebook/channels/', { params: { workspace_id: workspaceId } });
    return res.data;
};

/**
 * Delete a Facebook Channel from a workspace.
 * Endpoint: DELETE /api/channels/facebook/channels/<channel_id>/?workspace_id={workspaceId}
 */
export const deleteFacebookChannel = async (channelId, workspaceId) => {
    const res = await api.delete(`/channels/facebook/channels/${channelId}/`, { params: { workspace_id: workspaceId } });
    return res.data;
};

/**
 * Create a Facebook Post.
 * Endpoint: POST /api/channels/<channel_id>/facebook/create-post/
 */
export const createFacebookPost = async (channelId, payload) => {
    // Note: Do NOT set Content-Type manually for FormData. 
    // Axios/Browser will handle multipart boundary automatically.
    const res = await api.post(`/channels/${channelId}/facebook/create-post/`, payload);
    return res.data;
};

/**
 * Get Facebook Posts for a channel.
 * Endpoint: GET /api/channels/<channel_id>/facebook/posts/
 */
export const getFacebookPosts = async (channelId) => {
    const res = await api.get(`/channels/${channelId}/facebook/posts/`);
    return res.data;
};

/**
 * Get Facebook Post Detail.
 * Endpoint: GET /api/channels/<channel_id>/facebook/posts/<post_id>/
 */
export const getFacebookPostDetail = async (channelId, postId) => {
    const res = await api.get(`/channels/${channelId}/facebook/posts/${postId}/`);
    return res.data;
};

/**
 * Get connected channels for a workspace.
 * Endpoint: GET /api/channels/workspace/{workspaceId}/
 * 
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise} - List of connected channels
 */
export const getConnectedChannels = (workspaceId) =>
    api.get(`/channels/workspace/${workspaceId}/`).then((res) => res.data);

/**
 * Disconnect a channel from workspace.
 * Endpoint: DELETE /api/channels/{channelId}/disconnect/
 * 
 * @param {string} channelId - The channel ID to disconnect
 * @returns {Promise} - Confirmation response
 */
export const disconnectChannel = (channelId) =>
    api.delete(`/channels/${channelId}/disconnect/`).then((res) => res.data);

/**
 * Get channel details.
 * Endpoint: GET /api/channels/{channelId}/
 * 
 * @param {string} channelId - The channel ID
 * @returns {Promise} - Channel details
 */
export const getChannelDetails = (channelId) =>
    api.get(`/channels/${channelId}/`).then((res) => res.data);

/**
 * Initiate Instagram OAuth flow.
 * Endpoint: GET /api/channels/instagram/login/?workspace_id=<workspace_id>
 */
export const initiateInstagramLogin = (workspaceId, redirectUri) => {
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = new URL(`${baseUrl}/api/channels/instagram/login/`);
    url.searchParams.append('workspace_id', workspaceId);
    if (redirectUri) url.searchParams.append('redirect_uri', redirectUri);
    window.location.href = url.toString();
};

/**
 * Initiate LinkedIn OAuth flow.
 * Endpoint: GET /api/channels/linkedin/login/?workspace_id=<workspace_id>
 */
export const initiateLinkedInLogin = (workspaceId, redirectUri) => {
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = new URL(`${baseUrl}/api/channels/linkedin/login/`);
    url.searchParams.append('workspace_id', workspaceId);
    if (redirectUri) url.searchParams.append('redirect_uri', redirectUri);
    window.location.href = url.toString();
};

/**
 * Initiate Twitter/X OAuth flow.
 * Endpoint: GET /api/channels/twitter/login/?workspace_id=<workspace_id>
 */
export const initiateTwitterLogin = (workspaceId, redirectUri) => {
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = new URL(`${baseUrl}/api/channels/twitter/login/`);
    url.searchParams.append('workspace_id', workspaceId);
    if (redirectUri) url.searchParams.append('redirect_uri', redirectUri);
    window.location.href = url.toString();
};


/**
 * Verify a channel's integration status.
 * Endpoint: GET /api/channels/{channelId}/verify/
 */
export const verifyChannel = (channelId) =>
    api.get(`/channels/${channelId}/verify/`).then((res) => res.data);

/**
 * Approve or unapprove a Facebook post on the backend.
 * Endpoint: POST /api/channels/{channelId}/posts/{postId}/approve/
 */
export const approveFacebookPost = async (channelId, postId, approved) => {
    const res = await api.post(`/channels/${channelId}/posts/${postId}/approve/`, { approved });
    return res.data;
};

/**
 * Delete a post on the backend.
 * Endpoint: DELETE /api/channels/{channelId}/posts/{postId}/
 */
export const deletePost = async (channelId, postId) => {
    const res = await api.delete(`/channels/${channelId}/posts/${postId}/`);
    return res.data;
};

/**
 * Fetch real analytics for a single channel.
 * Endpoint: GET /api/channels/{channelId}/analytics/?days={days}
 */
export const getChannelAnalytics = async (channelId, days = 30) => {
    const res = await api.get(`/channels/${channelId}/analytics/`, { params: { days } });
    return res.data;
};

/**
 * Fetch aggregated analytics across all channels in a workspace.
 * Endpoint: GET /api/workspaces/{workspaceId}/analytics/?days={days}
 */
export const getWorkspaceAnalytics = async (workspaceId, days = 30) => {
    const res = await api.get(`/workspaces/${workspaceId}/analytics/`, { params: { days } });
    return res.data;
};
