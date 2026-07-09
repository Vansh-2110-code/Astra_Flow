// src/utils/deviceId.js - Secure Device ID Mechanism

import { v4 as uuidv4 } from 'uuid';

/**
 * Key used to store the device ID in localStorage.
 */
const DEVICE_ID_KEY = 'astraflow_device_id';

/**
 * Retrieves the existing secure device ID from localStorage.
 * If one does not exist, generates a new UUID v4, persists it, and returns it.
 * 
 * Security & Design Reasoning:
 * 1. UUID v4 provides a cryptographically strong, practically unguessable 128-bit identifier.
 * 2. Persisted in `localStorage` so the device maintains the same ID across browser sessions,
 *    allowing the backend to reliably track trusted devices or enforce active session limits.
 * 3. Idempotent initialization: ensures no duplicate generation if called multiple times.
 * 
 * @returns {string} The unique UUID v4 string for this device.
 */
export const getOrCreateDeviceId = () => {
    // 1. Check for existing ID
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    // 2. If missing, securely generate a new one and persist it
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
};
