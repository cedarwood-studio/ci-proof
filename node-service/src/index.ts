import { createServer } from "./server.js";

const port = Number(process.env.PORT ?? 3000);
const app = createServer();

app.listen(port, () => {
  console.log(`ci-proof-node-service listening on port ${port}`);
});
