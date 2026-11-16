import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    start: "pnpm start",
    healthcheck: "/health"
  });

  return project("mailchannels-node-railway-starter", {
    resources: [web]
  });
});
