import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("song/:id", "routes/song/layout.tsx"),
] satisfies RouteConfig;
