export async function onRequestPost({ request, env }) {
  try {
    const { licenseKey, email } = await request.json();

    if (!licenseKey || !licenseKey.trim()) {
      return new Response(
        JSON.stringify({ error: 'Please enter a license key' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.GUMROAD_PRODUCT_ID) {
      return new Response(
        JSON.stringify({ error: 'Product not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify license with Gumroad API
    const formData = new URLSearchParams();
    formData.append('product_id', env.GUMROAD_PRODUCT_ID);
    formData.append('license_key', licenseKey.trim());
    if (email) {
      formData.append('email', email);
    }

    const gumroadResponse = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const gumroadData = await gumroadResponse.json();

    // Check if license is valid
    if (!gumroadData.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid license key. Please check your key and try again.',
          details: gumroadData.message
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if license uses are exhausted (if you set a limit)
    const purchase = gumroadData.purchase;
    if (purchase.uses && purchase.uses >= (purchase.use_limit || 999999)) {
      return new Response(
        JSON.stringify({ 
          error: 'This license key has reached its usage limit. Please contact support.',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if license is refunded or disputed
    if (purchase.refunded || purchase.disputed) {
      return new Response(
        JSON.stringify({ 
          error: 'This license key has been refunded or disputed and is no longer valid.',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // License is valid! Create a session
    const sessionToken = crypto.randomUUID();
    const userEmail = purchase.email || email || 'user@license.key';
    
    // Store session in KV (7 days)
    await env.AUTH_TOKENS.put(`session:${sessionToken}`, JSON.stringify({
      email: userEmail,
      licenseKey: licenseKey.trim(),
      purchaseId: purchase.id,
      productName: purchase.product_name,
      purchaseDate: purchase.created_at
    }), {
      expirationTtl: 7 * 24 * 60 * 60 // 7 days
    });

    // Also store license key mapping for quick checks
    await env.AUTH_TOKENS.put(`license:${licenseKey.trim()}`, sessionToken, {
      expirationTtl: 7 * 24 * 60 * 60
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        sessionToken: sessionToken,
        email: userEmail,
        productName: purchase.product_name,
        message: 'License verified! Welcome to Demand Finder AI.'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('License verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to verify license. Please try again.',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
