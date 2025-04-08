import { Box, Title, Text, Container, Button, Paper, Image } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { CaretRight } from '@phosphor-icons/react';

function Home() {
	const navigate = useNavigate();

	return (
		<Box className='min-h-screen flex items-center justify-center' p='lg'>
			<Container size='xl'>
				<Box className='text-center py-12'>
					<Image alt='Enigma logo' mx='auto' mb={6} w={400} src='./enigma.png' />

					<Title order={1} className='text-4xl mb-6 text-center' c='white'>
						Velkommen til Enigmas Login Sikkerhed
					</Title>

					<Paper withBorder radius='md' p='xl' className='bg-blue-900/20 mb-8'>
						<Text size='lg' c='white' className='mx-auto text-center mb-8'>
							Udforsk hvordan login-systemer kan være enten sikre eller sårbare over for hackere. Lær om moderne sikkerhedsteknikker, der har rødder i Enigma-maskinens historie.
						</Text>

						<Button onClick={() => navigate({ to: '/learn' })} size='lg' color='blue' rightSection={<CaretRight size={20} weight='bold' />} className='animate-pulse'>
							Start Oplevelsen
						</Button>
					</Paper>

					<Text size='sm' c='dimmed' className='mt-8'>
						Tryk på skærmen for at begynde din rejse gennem login-sikkerhed
					</Text>
				</Box>
			</Container>
		</Box>
	);
}

export default Home;
