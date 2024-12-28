import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("song/new", "routes/song/new.tsx"),
  route("lyrics/new", "routes/lyrics/new.tsx"),
] satisfies RouteConfig;
