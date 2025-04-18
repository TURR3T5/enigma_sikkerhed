import { RouterProvider, createRoute, createRouter } from '@tanstack/react-router';
import Home from './routes/Home';
import LoginSafe from './routes/LoginSafe';
import LoginUnsafe from './routes/LoginUnsafe';
import Learn from './routes/Learn';
import { Route } from './routes/__root';

const rootRoute = Route;

const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Home,
});

const loginSafeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login-safe',
	component: LoginSafe,
});

const loginUnsafeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login-unsafe',
	component: LoginUnsafe,
});

const learnRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/learn',
	component: Learn,
});

const routeTree = rootRoute.addChildren([homeRoute, loginSafeRoute, loginUnsafeRoute, learnRoute]);

const router = createRouter({ routeTree });

export default function App() {
	return <RouterProvider router={router} />;
}
