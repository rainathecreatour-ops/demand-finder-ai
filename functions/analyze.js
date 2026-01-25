export async function onRequestPost({ request, env }) {
  // Check API key exists
  if (!env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      }
    );
  }

  try {
    const body = await request.json();
    
    // Handle both single prompt and conversation messages
    let messages;
    if (body.prompt) {
      // Single prompt from initial research
      messages = [{ role: "user", content: body.prompt }];
    } else if (body.messages) {
      // Conversation from follow-up questions
      messages = body.messages;
    } else {
      return new Response(
        JSON.stringify({ error: "Missing prompt or messages" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Anthropic API
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: messages
      })
    });

    const data = await resp.json();
    
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorType: "FunctionError"
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
