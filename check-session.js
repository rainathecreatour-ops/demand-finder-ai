export async function onRequestPost({ request, env }) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if session exists
    const sessionData = await env.AUTH_TOKENS.get(`session:${sessionToken}`);

    if (!sessionData) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse session data
    const session = JSON.parse(sessionData);

    return new Response(
      JSON.stringify({ 
        authenticated: true,
        email: session.email,
        productName: session.productName,
        licenseKey: session.licenseKey
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ authenticated: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
