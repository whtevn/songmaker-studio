import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("song/write", "routes/song/layout.tsx"),
] satisfies RouteConfig;
