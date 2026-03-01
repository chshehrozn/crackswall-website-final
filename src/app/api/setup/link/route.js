import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { apiUrl } = await request.json();

        if (!apiUrl) {
            return NextResponse.json({ success: false, error: 'Missing API URL' }, { status: 400 });
        }

        // Verify the backend is alive
        const verifyRes = await fetch(`${apiUrl}/categories`);
        if (!verifyRes.ok) {
            return NextResponse.json({ success: false, error: 'Invalid Backend URL or Backend Offline' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true, message: 'Connected to Backend successfully!' });

        const cookieOptions = {
            path: '/',
            maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: false,
            sameSite: 'lax',
        };

        response.cookies.set('cms_api_url', apiUrl, cookieOptions);

        return response;
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Connection failed: ' + err.message }, { status: 500 });
    }
}
