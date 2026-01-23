export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing ANTHROPIC_API_KEY in Cloudflare env vars" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Accept either {prompt} or {messages}
    const messages =
      Array.isArray(body.messages) && body.messages.length
        ? body.messages
        : [{ role: "user", content: body.prompt || "" }];

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1200,
        messages,
      }),
    });

    const data = await resp.json();

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
