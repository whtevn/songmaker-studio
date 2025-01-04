import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("song/layout", "routes/song/layout.tsx"),
  route("song/chart", "routes/song/chart.tsx"),
  route("key/find", "routes/song/keyfinder.tsx"),
] satisfies RouteConfig;
