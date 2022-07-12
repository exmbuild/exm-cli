import { ContractType } from "./common.ts";

export const getContractTypeBasedOnExt = (ext: string): ContractType => {
  if (ext.endsWith(".js")) {
    return ContractType.JS;
  } else if (ext.endsWith(".wasm")) {
    return ContractType.WASM;
  }

  return ContractType.JS;
};
