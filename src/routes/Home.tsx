import { Box, Button, Title, Text, Container, Group, Image } from '@mantine/core';
import { Link } from '@tanstack/react-router';

function Home() {
	return (
		<Box className='flex flex-col items-center justify-center bg-gradient-to-r from-zinc-900 to-zinc-800' w='100%' h='100vh' p='lg' c='white'>
			<Image alt='Hent logo' className='!w-[400px]' src='./enigma.png' />

			<Container>
				<Title order={1} className='text-center text-white text-4xl' mb={8}>
					Velkommen til Enigmas Login Sikkerhed
				</Title>

				<Text ta='center' className='text-white text-lg' mb={8}>
					Vælg en af de to login sider for at se forskellen på en sikker og en usikker login side.
				</Text>

				<Text ta='center' className='text-white text-lg' mb={16}>
					Her kan du lære om vigtigheden af sikker login praksis og hvordan dine personlige oplysninger beskyttes.
				</Text>

				<Group grow>
					<Link to='/LoginSafe' className='w-full max-w-xs'>
						<Button variant='light' color='blue' className='!w-full'>
							Sikker Login
						</Button>
					</Link>

					<Link to='/LoginUnsafe' className='w-full max-w-xs'>
						<Button variant='light' color='red' className='!w-full'>
							Usikker Login
						</Button>
					</Link>
				</Group>
			</Container>
		</Box>
	);
}

export default Home;
