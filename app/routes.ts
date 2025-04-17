import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("pizza", "routes/pizza.tsx"),
] satisfies RouteConfig;
