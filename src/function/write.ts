import { em } from "../utils.ts";

export default async function write(
  id: string,
  input: string,
  tags?: { [key: string]: string },
) {
  await em.functions
    .write(id, {
      input: JSON.parse(input),
      tags: Object.entries(tags || {}).map(([name, value]) => ({
        name,
        value,
      })),
    })
    .then(
      ({
        data: {
          pseudoId,
          execution: { validity },
        },
      }) => {
        if (validity[pseudoId]) {
          console.log(
            `Write query ${pseudoId} (pseudo-id) was successfully executed`,
          );
        } else {
          console.log(
            `Write query ${pseudoId} (pseudo-id) could not be executed`,
          );
        }
      },
    );
}
