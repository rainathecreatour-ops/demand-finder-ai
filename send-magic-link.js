export async function onRequestPost({ request, env }) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate a secure random token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store token in KV (Cloudflare Key-Value storage)
    // Format: email:token -> expiresAt
    await env.AUTH_TOKENS.put(`${email}:${token}`, expiresAt.toString(), {
      expirationTtl: 900 // 15 minutes
    });

    // Create magic link
    const magicLink = `${new URL(request.url).origin}/verify?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Demand Finder AI <onboarding@resend.dev>', // Change this to your verified domain
        to: email,
        subject: 'Your Magic Link to Access Demand Finder AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">🔐 Your Magic Link</h2>
            <p>Click the button below to access Demand Finder AI:</p>
            <div style="margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: linear-gradient(to right, #4F46E5, #7C3AED); 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: bold;">
                Access Demand Finder AI →
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Magic link sent! Check your email.' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
