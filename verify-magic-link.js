export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (!token || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing token or email' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if token exists in KV
    const storedExpiry = await env.AUTH_TOKENS.get(`${email}:${token}`);

    if (!storedExpiry) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired magic link' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    if (Date.now() > parseInt(storedExpiry)) {
      await env.AUTH_TOKENS.delete(`${email}:${token}`);
      return new Response(
        JSON.stringify({ error: 'Magic link has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a session token that lasts longer
    const sessionToken = crypto.randomUUID();
    const sessionExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // Store session
    await env.AUTH_TOKENS.put(`session:${sessionToken}`, email, {
      expirationTtl: 7 * 24 * 60 * 60 // 7 days
    });

    // Delete the magic link token (one-time use)
    await env.AUTH_TOKENS.delete(`${email}:${token}`);

    // Redirect to app with session token
    return Response.redirect(`${url.origin}/?session=${sessionToken}`, 302);

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
