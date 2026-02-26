/**
 * Centralize all backend error codes and status codes to user-friendly messages.
 */

const ERROR_MAPPINGS = {
    // Authentication
    'no_active_account': 'Incorrect email or password. Please check your details.',
    'invalid_credentials': 'Incorrect email or password. Please check your details.',
    'email_already_exists': 'This email is already in use. Try logging in.',
    'password_too_short': 'Your password is too short. It must be at least 8 characters.',
    'password_mismatch': 'The passwords you entered do not match.',
    'user_not_found': 'We couldn\'t find an account with that email.',

    // Workspaces
    'workspace_name_taken': 'This workspace name is already taken. Try something unique!',
    'max_workspaces_reached': 'You\'ve reached the limit of workspaces for your plan.',
    'workspace_not_found': 'The requested workspace could not be found.',

    // Team
    'user_already_in_workspace': 'This user is already a member of your team.',
    'invite_already_sent': 'An invitation has already been sent to this email.',
    'cannot_remove_self': 'You cannot remove yourself from the workspace.',
    'invalid_role': 'The selected role is not valid for this workspace.',

    // Account & Settings
    'old_password_incorrect': 'The "current password" you entered is incorrect.',
    'file_too_large': 'The image is too large. Please upload a file smaller than 2MB.',
    'invalid_file_type': 'Unsupported file type. Please upload a JPG or PNG.',

    // Generic Status Codes
    '401': 'Your session has expired. Please log in again.',
    '403': 'You don\'t have permission to perform this action.',
    '404': 'The requested item could not be found.',
    '429': 'Too many requests. Please slow down a bit.',
    '500': 'Our server is having a moment. Please try again in a few minutes.',
};

/**
 * Maps raw backend error data to a user-friendly message.
 * Optimized for Django/Vite standard error structures.
 */
export const mapError = (error) => {
    if (!error) return 'An unexpected error occurred';

    // 1. Handle Network/Connection errors
    if (error.message === 'Network Error') {
        return 'Connection lost. Please check your internet.';
    }

    const response = error.response;
    if (!response) return error.message || 'Something went wrong';

    const data = response.data;
    const status = response.status;

    // 2. Handle structured error codes from backend (e.g., { code: "...", message: "..." })
    if (data && typeof data === 'object') {
        // Look for common code fields
        const code = data.code || data.error_code || data.detail_code;
        if (code && ERROR_MAPPINGS[code]) {
            return ERROR_MAPPINGS[code];
        }

        // 3. Handle validation error objects (e.g., { email: ["exists"], password: ["short"] })
        // We take the first error message we find
        const firstKey = Object.keys(data)[0];
        const firstVal = data[firstKey];

        if (Array.isArray(firstVal)) {
            // Check if the specific error text in the array matches a mapping
            const rawMsg = firstVal[0];
            if (rawMsg.includes('already exists')) return ERROR_MAPPINGS['email_already_exists'];
            if (rawMsg.includes('too short')) return ERROR_MAPPINGS['password_too_short'];
            return rawMsg;
        }

        if (typeof data.detail === 'string') {
            // Check common detail messages
            if (data.detail.toLowerCase().includes('credentials')) return ERROR_MAPPINGS['invalid_credentials'];
            return data.detail;
        }

        if (typeof data.message === 'string') return data.message;
    }

    // 4. Default to Status Code mapping
    if (ERROR_MAPPINGS[status]) {
        return ERROR_MAPPINGS[status];
    }

    return error.message || 'An unexpected error occurred';
};

export default mapError;
