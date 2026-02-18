// Decision Log & Approval Workflow — Edge Function
// All request handling, validation, and data access should run here.
// Client calls via: supabase.functions.invoke('decision-log', { body: { action, ... } })

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    switch (action) {
      case "list":
        // List/filter decisions by project/phase/assignee/cost/date
        return new Response(
          JSON.stringify({ items: [], total: 0, page: 1, limit: 20 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      case "get":
        // Get single decision by id
        return new Response(
          JSON.stringify({ error: "Not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      case "versions":
      case "audit":
      case "comments":
      case "related":
        return new Response(
          JSON.stringify([]),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      case "approve":
      case "request-change":
      case "comment":
        return new Response(
          JSON.stringify({ error: "Not implemented" }),
          { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (e) {
    return new Response(
      JSON.stringify({ message: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
