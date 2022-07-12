import { Em } from "./deps.ts";

function getToken() {
  const token = Deno.env.get("EXM_TOKEN");
  if (!token) throw new Error("Missing EM_TOKEN environment variable");
  return token;
}

export const em = new Em({ token: getToken() });

export enum ContractType {
  JS = "application/javascript", // 'application/javascript', 'application/typescript'
  EVM = "application/octet-stream", // 'application/vnd.exm.evm', 'application/vnd.exm.sol'
  WASM = "application/wasm", // 'application/vnd.exm.wasm+rust', 'application/vnd.exm.wasm+c', 'application/vnd.exm.wasm+cpp'
}
