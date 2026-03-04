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
export const initiateFacebookLogin = (workspaceId) => {
    const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
    window.location.href = `${baseUrl}/api/channels/facebook/login/?workspace_id=${workspaceId}`;
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
