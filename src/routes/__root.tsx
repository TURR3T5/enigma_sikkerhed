import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Box } from '@mantine/core';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<Box className='min-h-screen bg-gradient-to-r from-zinc-900 to-zinc-800'>
			<Outlet />
		</Box>
	);
}
