import { Box, Title, Text, Container, Button, Paper, Image } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { CaretRight } from '@phosphor-icons/react';

function Home() {
	const navigate = useNavigate();

	return (
		<Box className='min-h-screen flex items-center justify-center' p='lg'>
			<Container size='md'>
				<Box className='text-center py-16'>
					<Image alt='Enigma logo' mx='auto' mb={16} w={300} src='./enigma.png' />

					<Title order={1} className='text-3xl text-center' c='white' mb={24}>
						Velkommen til Enigmas Login Sikkerhed
					</Title>

					<Paper withBorder radius='md' p='md' mb={12} className='bg-blue-900/30'>
						<Text size='md' c='white' mb={16} className='mx-auto text-center'>
							Udforsk hvordan login-systemer kan være enten sikre eller sårbare over for hackere. Lær om moderne sikkerhedsteknikker, der har rødder i Enigma-maskinens historie.
						</Text>

						<Button onClick={() => navigate({ to: '/learn' })} size='md' color='blue' rightSection={<CaretRight size={20} weight='bold' />} className='animate-pulse'>
							Start Oplevelsen
						</Button>
					</Paper>

					<Text size='xs' c='dimmed'>
						Tryk på knappen for at begynde din rejse gennem login-sikkerhed
					</Text>
				</Box>
			</Container>
		</Box>
	);
}

export default Home;
