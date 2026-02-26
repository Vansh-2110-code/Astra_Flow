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
export const initiateFacebookLogin = (workspaceId) => {
    window.location.href = `/api/channels/facebook/login/?workspace_id=${workspaceId}`;
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
