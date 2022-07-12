import { Em } from "./deps.ts";

function getToken() {
  const token = Deno.env.get("EXM_TOKEN");
  if (!token) throw new Error("Missing EM_TOKEN environment variable");
  return token;
}

export const em = new Em({ token: getToken() });
