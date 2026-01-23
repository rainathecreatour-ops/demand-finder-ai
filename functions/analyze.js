export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // ✅ Example: calling OpenAI (replace if you’re using Claude)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful market demand research assistant." },
          { role: "user", content: body.prompt || "" },
        ],
      }),
    });

    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: resp.status,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
