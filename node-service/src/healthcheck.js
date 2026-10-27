// Plain JS, dependency-free healthcheck used by the Dockerfile's
// HEALTHCHECK instruction. Deliberately not compiled from TypeScript
// so it has zero build-time dependency on the dist/ output existing.
import http from "node:http";

const port = Number(process.env.PORT ?? 3000);

const req = http.get({ host: "localhost", port, path: "/health", timeout: 2000 }, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on("error", () => process.exit(1));
req.on("timeout", () => {
  req.destroy();
  process.exit(1);
});
