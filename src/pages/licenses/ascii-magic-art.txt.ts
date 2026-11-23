// The licence of the library that draws the scene on the contact sheet. Its
// code reaches visitors minified, without its notice, so the notice is served
// here and linked from the sheet.
import type { APIRoute } from "astro";
import licence from "../../vendor/ascii-magic-art/LICENSE?raw";

export const GET: APIRoute = () =>
  new Response(licence, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
