// File Upload & Management — Edge Function
// All request handling, validation, and data access run here.
// Client can call via: supabase.functions.invoke('files', { body: { action, ... } })
// Or proxy /api/files/* to this function.

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

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/files\/?/, "").replace(/^\//, "");
  const parts = path.split("/").filter(Boolean);

  try {
    // POST /files/upload — multipart upload (stub: integrate Cloud Storage + optional virus-scan)
    if (req.method === "POST" && (path === "upload" || path === "")) {
      const contentType = req.headers.get("content-type") ?? "";
      if (contentType.includes("multipart/form-data")) {
        // Stub: parse multipart, validate, then store via Cloud Storage
        return new Response(
          JSON.stringify({
            id: "stub-" + Date.now(),
            title: "Uploaded file",
            version: 1,
            createdAt: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const body = await req.json().catch(() => ({}));
      if (body.action === "upload") {
        return new Response(
          JSON.stringify({
            id: body.id ?? "stub-" + Date.now(),
            title: body.title ?? "Uploaded file",
            version: 1,
            createdAt: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // GET /files — list with query params
    if (req.method === "GET" && (path === "" || parts.length === 0)) {
      const folderId = url.searchParams.get("folderId");
      const search = url.searchParams.get("search");
      const page = url.searchParams.get("page") ?? "1";
      const limit = url.searchParams.get("limit") ?? "20";
      return new Response(
        JSON.stringify({
          items: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /files/folders
    if (req.method === "GET" && parts[0] === "folders") {
      return new Response(
        JSON.stringify({
          items: [
            { id: "f1", name: "Drawings", parentId: null, fileCount: 0 },
            { id: "f2", name: "Specs", parentId: null, fileCount: 0 },
          ],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /files/:id
    if (req.method === "GET" && parts.length === 1 && parts[0] !== "folders" && parts[0] !== "upload") {
      const id = parts[0];
      return new Response(
        JSON.stringify({
          id,
          user_id: "stub-user",
          title: "File",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /files/:id/versions
    if (req.method === "GET" && parts.length === 2 && parts[1] === "versions") {
      const fileId = parts[0];
      return new Response(
        JSON.stringify([
          {
            id: "v1",
            fileId,
            version: 1,
            createdAt: new Date().toISOString(),
          },
        ]),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /files/:id/permissions
    if (req.method === "GET" && parts.length === 2 && parts[1] === "permissions") {
      const fileId = parts[0];
      return new Response(
        JSON.stringify({
          fileId,
          client: true,
          contractor: true,
          internal: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PATCH /files/:id
    if (req.method === "PATCH" && parts.length === 1) {
      const body = await req.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          id: parts[0],
          user_id: "stub-user",
          title: body.title ?? "File",
          status: body.status ?? "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE /files/:id — soft-delete/archive
    if (req.method === "DELETE" && parts.length === 1) {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // POST /files/:id/link — link to decision/milestone
    if (req.method === "POST" && parts.length === 2 && parts[1] === "link") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ message: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
