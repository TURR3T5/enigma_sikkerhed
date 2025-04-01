import { Outlet, createRootRoute, Link, useNavigate, useLocation } from '@tanstack/react-router';
import { Box, AppShell, Group, Button, Title, Text, Divider, Avatar } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Shield, WarningOctagon, Book, ArrowsLeftRight, House } from '@phosphor-icons/react';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const [active, setActive] = useState('/');
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		setActive(location.pathname);
	}, [location.pathname]);

	const navItems = [
		{ path: '/', label: 'Forside', icon: <House size={20} /> },
		{ path: '/login-safe', label: 'Sikker Login', icon: <Shield size={20} weight='fill' className='text-green-400' /> },
		{ path: '/login-unsafe', label: 'Usikker Login', icon: <WarningOctagon size={20} weight='fill' className='text-red-400' /> },
		{ path: '/learn', label: 'Lær Mere', icon: <Book size={20} /> },
		{ path: '/compare', label: 'Sammenlign', icon: <ArrowsLeftRight size={20} /> },
	];

	const handleNavigation = (path: string): void => {
		setActive(path);
		navigate({ to: path });
	};

	return (
		<AppShell navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: true } }} padding='md' className='bg-gradient-to-r from-zinc-900 to-zinc-800'>
			<AppShell.Navbar className='bg-zinc-900 border-r border-zinc-700'>
				<Box p='md'>
					<Group pb='md' mb='md' justify='center' className='border-b border-zinc-700'>
						<Link to='/' className='no-underline'>
							<Group>
								<Avatar src='./enigma.png' radius='xl' size='md' />
								<Box>
									<Title order={4} c='white'>
										Enigma
									</Title>
									<Text size='xs' c='dimmed'>
										Login Sikkerhed
									</Text>
								</Box>
							</Group>
						</Link>
					</Group>

					<Box>
						{navItems.map((item) => (
							<Button key={item.path} fullWidth variant={active === item.path ? 'light' : 'subtle'} color={item.path === '/login-safe' ? 'green' : item.path === '/login-unsafe' ? 'red' : 'blue'} className='mb-2 justify-start' onClick={() => handleNavigation(item.path)} leftSection={item.icon}>
								{item.label}
							</Button>
						))}
					</Box>

					<Divider my='lg' />

				</Box>
			</AppShell.Navbar>

			<AppShell.Main className='min-h-screen'>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
