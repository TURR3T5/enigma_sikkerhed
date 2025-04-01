import { Box, Title, Text, Container, Group, Image, Paper, Button, SimpleGrid, Progress, Card, Badge } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { Shield, WarningOctagon, Brain, ArrowsLeftRight } from '@phosphor-icons/react';

function Home() {
	const learningPaths = [
		{
			id: 'explore',
			title: 'Udforsk Login Sikkerhed',
			description: 'Lær om sikker og usikker login praksis gennem interaktive eksempler.',
			icon: <Brain size={24} weight='fill' className='text-blue-400' />,
			progress: 0,
			button: { to: '/learn', label: 'Start din rejse', color: 'blue' },
		},
		{
			id: 'safe',
			title: 'Prøv Sikker Login',
			description: 'Opdag hvordan en sikker loginside implementerer beskyttelsesmekanismer.',
			icon: <Shield size={24} weight='fill' className='text-green-400' />,
			progress: 0,
			button: { to: '/login-safe', label: 'Prøv sikker login', color: 'green' },
		},
		{
			id: 'unsafe',
			title: 'Forstå Usikker Login',
			description: 'Se hvordan en usikker loginside er sårbar over for forskellige angreb.',
			icon: <WarningOctagon size={24} weight='fill' className='text-red-400' />,
			progress: 0,
			button: { to: '/login-unsafe', label: 'Se usikker login', color: 'red' },
		},
		{
			id: 'compare',
			title: 'Sammenlign Side om Side',
			description: 'Se forskellen mellem sikker og usikker login i en direkte sammenligning.',
			icon: <ArrowsLeftRight size={24} weight='fill' className='text-purple-400' />,
			progress: 0,
			button: { to: '/compare', label: 'Sammenlign nu', color: 'grape' },
		},
	];

	return (
		<Box className='min-h-screen' p='lg'>
			<Container size='xl'>
				<Box className='text-center py-12'>
					<Image alt='Enigma logo' mx='auto' mb={6} w={800} src='./enigma.png' />

					<Title order={1} className='text-5xl mb-6 text-center' c='white'>
						Velkommen til Enigmas Login Sikkerhed
					</Title>

					<Box w='100%' mb={10}>
						<Text size='xl' c='white' className='mx-auto mb-10 text-center'>
							En interaktiv læringsplatform om login sikkerhed, inspireret af historien om Enigma og moderne kryptografi.
						</Text>
					</Box>

					<Paper withBorder radius='md' p='xl' className='bg-blue-900/20 mb-12'>

						<Text size='lg' c='white' className='mx-auto text-center'>
							Fra Enigma-maskinens historiske kryptografi til moderne webauthentifikation — lær hvordan sikkerhedsprincipper er udviklet, og hvordan du kan beskytte dig mod almindelige angreb.
						</Text>
					</Paper>

					<SimpleGrid cols={2} spacing='lg'>
						{learningPaths.map((path) => (
							<Card key={path.id} withBorder p='lg' radius='md' className='bg-zinc-800/60'>
								<Card.Section className='p-4 border-b border-zinc-700'>
									<Group justify='space-between'>
										<Group>
											{path.icon}
											<Title order={3} c='white'>
												{path.title}
											</Title>
										</Group>
										<Badge color={path.button.color} variant='light' size='lg'>
											Nyt
										</Badge>
									</Group>
								</Card.Section>

								<Text size='md' c='white' className='my-4 h-14'>
									{path.description}
								</Text>

								<Progress value={path.progress} color={path.button.color} size='sm' className='mb-4' />

								<Link to={path.button.to} className='w-full'>
									<Button fullWidth variant='light' color={path.button.color} size='md'>
										{path.button.label}
									</Button>
								</Link>
							</Card>
						))}
					</SimpleGrid>
				</Box>
			</Container>
		</Box>
	);
}

export default Home;
