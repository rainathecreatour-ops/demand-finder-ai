export async function onRequestPost({ request }) {
  try {
    const { licenseKey } = await request.json();

    if (!licenseKey || !licenseKey.trim()) {
      return new Response(JSON.stringify({ success: false, error: "Missing licenseKey" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // TODO: Replace with real license verification
    const ok = licenseKey.trim().startsWith("NR-");

    if (!ok) {
      return new Response(JSON.stringify({ success: false, error: "Invalid license key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      sessionToken: "sess_" + crypto.randomUUID(),
      email: "customer@example.com",
      message: "License verified!",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: "Server error: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
