import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        return res.status(200).end();
    }

    const { path } = req.query;
    const backendUrl = process.env.VITE_API_BASE_URL;

    if (!backendUrl) {
        console.error('VITE_API_BASE_URL environment variable is not set');
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'Backend URL is not configured'
        });
    }

    const baseUrl = backendUrl.endsWith('/api')
        ? backendUrl.replace(/\/api$/, '')
        : backendUrl;

    const apiPath = Array.isArray(path) ? path.join('/') : (path || '');
    const targetUrl = `${baseUrl}/api/${apiPath}`;

    const queryParams = { ...req.query };
    delete queryParams.path;
    const queryString = new URLSearchParams(
        queryParams as Record<string, string>
    ).toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    try {
        const headers: Record<string, string> = {
            'Content-Type': (req.headers['content-type'] as string) || 'application/json',
        };

        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization as string;
        }

        const fetchOptions: RequestInit = {
            method: req.method,
            headers,
        };

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            if (req.body) {
                fetchOptions.body = typeof req.body === 'string'
                    ? req.body
                    : JSON.stringify(req.body);
            }
        }

        const response = await fetch(fullUrl, fetchOptions);
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Proxy request failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

