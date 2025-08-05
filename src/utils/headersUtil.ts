export const getHeaders = (token: string): HeadersInit => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});
