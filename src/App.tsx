import { RouterProvider, createRoute, createRouter } from '@tanstack/react-router';
import Home from './routes/Home';
import LoginSafe from './routes/LoginSafe';
import LoginUnsafe from './routes/LoginUnsafe';
import { Route } from './routes/__root';

const rootRoute = Route

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const loginSafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/LoginSafe',
  component: LoginSafe,
});

const loginUnsafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/LoginUnsafe',
  component: LoginUnsafe,
});

const routeTree = rootRoute.addChildren([homeRoute, loginSafeRoute, loginUnsafeRoute]);
const router = createRouter({ routeTree });

export default function App() {
	return <RouterProvider router={router} />;
}