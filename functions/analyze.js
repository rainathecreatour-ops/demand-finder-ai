export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing ANTHROPIC_API_KEY in Cloudflare env vars" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages =
      Array.isArray(body.messages) && body.messages.length
        ? body.messages
        : [{ role: "user", content: body.prompt || "" }];

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
       model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages,
      }),
    });

    const data = await resp.json(); // ✅ data is created FIRST

    // ✅ only use data AFTER it exists
    data._functionVersion = "v3-anthropic-sonnet-latest";

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
