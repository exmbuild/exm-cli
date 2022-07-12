import { em } from "../utils.ts";

export default async function read(id: string) {
  await em.functions.read(id).then((result) => {
    console.log(result);
  });
}