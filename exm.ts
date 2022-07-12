import readFunction from "./src/function/read.ts";
import writeFunction from "./src/function/write.ts";
import deployFunction from "./src/function/deploy.ts";

import { ContractType, Decoder } from "./src/common.ts";
import { cac } from "./src/deps.ts";
import { DeployOptions } from "./src/function/model.ts";
import { getContractTypeBasedOnExt } from "./src/utils.ts";

const cli = cac("exm");
cli.help();
cli.version("0.1.0");

cli
  .command("function:read <txid>", "Read state of a function")
  .alias("fx:r")
  .action((id: string) => {
    readFunction(id);
  });

cli
  .command("function:write <txid>", "Update state of a function")
  .alias("fx:w")
  .option("--input <input>", "Input to be passed to the contract")
  .option(
    "--tags [tags[]]",
    "Tags for transaction. usage: --tags.Name-1=Value-1 --tags.Name-2=Value-2",
  )
  .action(
    (
      id: string,
      { input, tags }: { input: string; tags: { [key: string]: string } },
    ) => {
      writeFunction(id, input, tags);
    },
  );

cli
  .command("function:deploy", "Deploy a new function")
  .alias("fx:d")
  .option("--wallet <path>", "Path to wallet to deploy the function with")
  .option(
    "--source [path]",
    "Source code of the function. Takes priority over --source-tx",
  )
  .option("--type [type]", 'Type of the function. One of "JS", "WASM" or "EVM"')
  .option("--source-tx [txid]", "Transaction ID of the function source code")
  .option(
    "--initial-state [state]",
    "Initial state of the function. Takes priority over --initial-state-source",
  )
  .option(
    "--initial-state-source [path]",
    "File location of the initial state of the function",
  )
  .action(
    (
      { source, sourceTx, type, initialState, initialStateSource, wallet }:
        DeployOptions,
    ) => {
      let contractSrc: string | undefined;
      let contractType: ContractType;
      let initState: string | undefined;

      if (source) {
        contractType = getContractTypeBasedOnExt(source);
        contractSrc = Decoder.decode(Deno.readFileSync(source));
      } else if (sourceTx) {
        if (sourceTx.length != 43) {
          throw new Error("Invalid transaction source transaction ID");
        }

        contractSrc = sourceTx;
      } else {
        throw new Error(
          "Either --source [path] or --source-tx [txid] must be provided",
        );
      }

      if (typeof initialState == "string") {
        initState = initialState;
      } else if (initialStateSource) {
        initState = Decoder.decode(
          Deno.readFileSync(initialStateSource),
        );
      } else {
        initState = "";
      }

      if (type === "WASM") {
        contractType = ContractType.WASM;
      } else if (type === "EVM") {
        contractType = ContractType.EVM;
      } else if (type === "JS") {
        contractType = ContractType.JS;
      } else if (type.EVM) {
        contractType = ContractType.EVM;
      } else if (type.WASM) {
        contractType = ContractType.WASM;
      } else {
        contractType = ContractType.JS;
      }

      wallet = Deno.readTextFileSync(wallet);

      deployFunction(
        { src: contractSrc, type: contractType, tx: !!sourceTx },
        initState,
        JSON.parse(wallet),
      );
    },
  );

cli.parse();
