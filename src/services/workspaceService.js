// src/services/workspaceService.js — Workspace API functions.
// Uses centralized Axios client from api.js for automatic auth, error handling, and base URL.

import api from './api';

// Fetch all workspaces the current user belongs to
export const getWorkspaces = () =>
    api.get('/workspaces/workspace/').then((res) => res.data);

/**
 * Create a new workspace.
 * Endpoint: POST /api/workspaces/create/
 */
export const createWorkspace = (name, timezone) =>
    api.post('/workspaces/create/', { name, timezone }).then((res) => res.data);

/**
 * Invite a member to a workspace.
 * Endpoint: POST /api/workspaces/{workspaceId}/invite/
 */
export const inviteToWorkspace = (workspaceId, email, role) =>
    api
        .post(`/workspaces/${workspaceId}/invite/`, { email, role })
        .then((res) => res.data);

/**
 * Accept a workspace invitation.
 * Endpoint: POST /api/workspaces/accept/{inviteToken}/
 */
export const acceptInvite = (inviteToken) =>
    api.post(`/workspaces/accept/${inviteToken}/`).then((res) => res.data);

/**
 * Reject a workspace invitation.
 * Endpoint: POST /api/workspaces/reject/{inviteToken}/
 */
export const rejectInvite = (inviteToken) =>
    api.post(`/workspaces/reject/${inviteToken}/`).then((res) => res.data);

/**
 * Get details for a single workspace.
 * Endpoint: GET /api/workspaces/workspace/{workspaceId}/
 */
export const getWorkspaceDetail = (workspaceId) =>
    api.get(`/workspaces/workspace/${workspaceId}/`).then((res) => res.data);

/**
 * Get all members of a workspace.
 * Endpoint: GET /api/workspaces/{workspaceId}/members/
 */
export const getWorkspaceMembers = (workspaceId) =>
    api.get(`/workspaces/${workspaceId}/members/`).then((res) => res.data);

/**
 * Remove a member from a workspace.
 * Endpoint: DELETE /api/workspaces/{workspaceId}/members/{memberId}/
 */
export const removeMember = (workspaceId, memberId) =>
    api.delete(`/workspaces/${workspaceId}/members/${memberId}/`).then((res) => res.data);
