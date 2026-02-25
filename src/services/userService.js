// src/services/userService.js — User profile and account management.
import api from './api';

/**
 * Fetch current user profile details.
 * Endpoint: GET /api/user/profile/
 */
export const getProfile = () =>
    api.get('/user/profile/').then(res => res.data);

/**
 * Update user profile details.
 * Endpoint: PATCH /api/user/profile/
 * Payload: { firstName, lastName, phone, dob, gender }
 */
export const updateProfile = (data) =>
    api.patch('/user/profile/', data).then(res => res.data);

/**
 * Upload profile avatar.
 * Endpoint: POST /api/user/profile/avatar/
 */
export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/profile/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
};

/**
 * Change user password.
 * Endpoint: POST /api/user/change-password/
 */
export const changePassword = (oldPassword, newPassword) =>
    api.post('/user/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
    }).then(res => res.data);
