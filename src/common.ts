export enum ContractType {
  JS = "application/javascript", // 'application/javascript', 'application/typescript'
  EVM = "application/octet-stream", // 'application/vnd.exm.evm', 'application/vnd.exm.sol'
  WASM = "application/wasm", // 'application/vnd.exm.wasm+rust', 'application/vnd.exm.wasm+c', 'application/vnd.exm.wasm+cpp'
}

export const Encoder = new TextEncoder();
export const Decoder = new TextDecoder();
