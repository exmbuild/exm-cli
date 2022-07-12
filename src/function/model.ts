import { ContractType } from "../common.ts";

export interface JWK {
  kty: string;
  e: string;
  n: string;
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
}

export type ContractDeployType =
  | "JS"
  | "WASM"
  | "EVM"
  | { [key in keyof typeof ContractType]?: boolean };

export interface DeployOptions {
  source: string;
  sourceTx: string;
  type: ContractDeployType;
  initialState: string;
  initialStateSource: string;
  wallet: string;
}

export interface Tag {
  name: string;
  value: string;
}
