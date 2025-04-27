import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log: Check for API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("[Edge Function] OPENAI_API_KEY is not set");
      throw new Error("OPENAI_API_KEY is not set");
    } else {
      console.log("[Edge Function] OPENAI_API_KEY is set");
    }

    // Log: Parse and log request body
    let message;
    try {
      const body = await req.json();
      console.log("[Edge Function] Request body:", body);
      message = body?.message;
    } catch (parseErr) {
      console.error("[Edge Function] Failed to parse request body:", parseErr);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!message || typeof message !== "string") {
      console.error("[Edge Function] Missing or invalid message field");
      return new Response(
        JSON.stringify({
          error: "Request body must be JSON with a 'message' string.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log: Outgoing OpenAI request
    console.log("[Edge Function] Sending request to OpenAI API...");
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful task management assistant integrated into a "Zest Tasks" app. 
                      Your expertise is in productivity, time management, and organization. 
                      Provide helpful, concise responses focused on helping users manage their tasks, 
                      workflows, and productivity. Responses should be friendly, motivational, and actionable.
                      Keep your responses concise (under 200 words) unless the user asks for detailed information.`,
            },
            { role: "user", content: message },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
        }),
      }
    );

    // Log: OpenAI response status
    console.log(
      "[Edge Function] OpenAI API response status:",
      openaiRes.status
    );
    const openaiResText = await openaiRes.text();
    console.log("[Edge Function] OpenAI API response body:", openaiResText);

    if (!openaiRes.ok) {
      return new Response(JSON.stringify({ error: openaiResText }), {
        status: openaiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let data;
    try {
      data = JSON.parse(openaiResText);
    } catch (jsonErr) {
      console.error(
        "[Edge Function] Failed to parse OpenAI response JSON:",
        jsonErr
      );
      return new Response(
        JSON.stringify({ error: "Invalid JSON from OpenAI API" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("[Edge Function] Invalid response from OpenAI API:", data);
      return new Response(
        JSON.stringify({ error: "Invalid response from OpenAI API" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const text = data.choices[0].message.content;
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Edge Function] Error in chat function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
