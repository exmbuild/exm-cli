import { Arweave } from "../deps.ts";
import "https://deno.land/x/xhr@0.1.2/mod.ts";
import { ContractType } from "../common.ts";
import { JWK, Tag } from "./model.ts";
import { Decoder, Encoder } from "../common.ts";

export default async function deploy(
  contract: { src: string; type: ContractType; tx: boolean },
  initState: string,
  wallet: JWK,
) {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  const address: string = await arweave.wallets.jwkToAddress(wallet);

  console.log("Deploying function using wallet", address);

  if (contract.tx) {
    console.log("Deploying contract using source transaction", contract.src);

    const tx = await arweave.createTransaction({
      data: Encoder.encode(initState),
    });

    tx.addTag("Contract-Src", contract.src);
    await arweave.transactions.sign(tx, wallet);

    console.log("\nInit Contract:", {
      id: tx.id,
      tags: tx.tags.map(({ name, value }: Tag) => ({
        name: atob(name),
        value: atob(value),
      })),
      data: Decoder.decode(tx.data),
    });

    const confirmation = confirm("\nDo you want to deploy this function?");

    if (confirmation) {
      const res = await arweave.transactions.post(tx);
      if (!res.ok) {
        throw new Error(
          "Failed to deploy init contract. Source Contract ID: " + contract.src,
        );
      }

      console.log("\nContract deployed 🎉");
      console.log("Contract Source:", "https://arweave.net/tx/" + contract.src);
      console.log("Contract Init:", "https://arweave.net/tx/" + tx.id);
    } else {
      console.log("\nDeployment cancelled");
    }
  } else {
    // Source Contract
    const tx1 = await arweave.createTransaction({
      data: Encoder.encode(contract.src),
    });
    tx1.addTag("Content-Type", contract.type);
    tx1.addTag("App-Name", "EM");
    tx1.addTag("Type", "Serverless");
    await arweave.transactions.sign(tx1, wallet);

    // Init Contract
    const tx2 = await arweave.createTransaction({
      data: Encoder.encode(initState),
    });
    tx2.addTag("Contract-Src", tx1.id);
    await arweave.transactions.sign(tx2, wallet);

    console.log("\nSource Contract:", {
      id: tx1.id,
      tags: tx1.tags.map(({ name, value }: { [x: string]: string }) => ({
        name: atob(name),
        value: atob(value),
      })),
      data: Decoder.decode(tx1.data),
    });

    console.log("\nInit Contract:", {
      id: tx2.id,
      tags: tx2.tags.map(({ name, value }: { [x: string]: string }) => ({
        name: atob(name),
        value: atob(value),
      })),
      data: Decoder.decode(tx2.data),
    });

    const confirmation = confirm("\nDo you you want to deploy this function?");

    if (confirmation) {
      const res1: Response = await arweave.transactions.post(tx1);
      if (!res1.ok) throw new Error("Failed to deploy source contract");

      const res2: Response = await arweave.transactions.post(tx2);
      if (!res2.ok) {
        throw new Error(
          "Failed to deploy init contract. Source Contract ID: " + tx1.id,
        );
      }

      console.log("\nContract deployed 🎉");
      console.log("Contract Source:", "https://arweave.net/tx/" + tx1.id);
      console.log("Contract Init:", "https://arweave.net/tx/" + tx2.id);
    } else {
      console.log("\nDeployment cancelled");
    }
  }
}
