/**
 * API Client Configuration
 * This centralizes all backend API calls using the NEXT_PUBLIC_API_URL environment variable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Add default headers (e.g., Auth if available)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    return response;
}

/**
 * Standard API call that returns the JSON result directly
 */
export async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await apiFetch(endpoint, options);
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `API error: ${response.status}`);
    }
    
    return response.json();
}
