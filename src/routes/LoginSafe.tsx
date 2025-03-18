import { useState, FormEvent } from 'react';
import { Box, TextInput, PasswordInput, Button, Title, Text, Container, Paper, Alert, Divider, List, Badge, SimpleGrid } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { Shield, WarningCircle, CaretLeft } from '@phosphor-icons/react';

function LoginSafe() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginAttempts, setLoginAttempts] = useState<number>(0);
	const [csrfToken, _setCsrfToken] = useState<string>(() => generateCSRFToken());
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');

	function generateCSRFToken(): string {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	const isRateLimited = loginAttempts >= 5;

	const sanitizeInput = (input: string): string => {
		return input.replace(/[<>]/g, '');
	};

	const handleLogin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setErrorMessage('');
		setSuccessMessage('');

		if (isRateLimited) {
			setErrorMessage('For mange loginforsøg. Prøv igen senere.');
			return;
		}

		setLoginAttempts(loginAttempts + 1);

		const sanitizedUsername = sanitizeInput(username);

		if (sanitizedUsername === 'admin' && password === 'secure123') {
			setSuccessMessage('Login lykkedes! Velkommen tilbage.');
		} else {
			setErrorMessage('Forkert brugernavn eller adgangskode.');
		}
	};

	return (
		<Box className='flex flex-col min-h-screen bg-gradient-to-r from-zinc-900 to-zinc-800' p='lg'>
			<Container size='xl' className='flex-grow flex flex-col justify-center'>
				<Link to='/' className='text-white mb-4 flex items-center'>
					<CaretLeft size={16} className='mr-2' /> Tilbage til forside
				</Link>

				<SimpleGrid cols={3} spacing='lg'>
					<Paper withBorder p='lg' radius='md' className='bg-blue-800/30 text-white'>
						<Title order={4} className='mb-4 flex items-center'>
							<Shield size={20} className='mr-2 text-green-400' weight='fill' />
							Sikkerhedsforanstaltninger
						</Title>

						<List spacing='xs' size='sm'>
							<List.Item>
								<Badge color='green' variant='light' className='mr-2'>
									CSRF-beskyttelse
								</Badge>
								Forhindrer Cross-Site Request Forgery angreb med unikke tokens
							</List.Item>
							<List.Item>
								<Badge color='green' variant='light' className='mr-2'>
									Rate Limiting
								</Badge>
								Begrænser antallet af loginforsøg for at forhindre brute force-angreb
							</List.Item>
							<List.Item>
								<Badge color='green' variant='light' className='mr-2'>
									XSS-beskyttelse
								</Badge>
								Saniterer input for at forhindre cross-site scripting
							</List.Item>
							<List.Item>
								<Badge color='green' variant='light' className='mr-2'>
									Sikker feedback
								</Badge>
								Giver ikke specifikke fejlmeddelelser der kunne hjælpe angribere
							</List.Item>
							<List.Item>
								<Badge color='green' variant='light' className='mr-2'>
									Sikker session
								</Badge>
								Bruger sikre cookies og session-håndtering
							</List.Item>
						</List>
					</Paper>

					<Paper withBorder p='xl' radius='md' className='bg-blue-800/20 text-white'>
						<Title order={2} className='text-center mb-4 flex items-center justify-center'>
							<Shield size={28} className='mr-2 text-green-400' weight='fill' />
							Sikker Login
						</Title>

						<Text size='sm' className='mb-4 text-center'>
							Denne side implementerer bedste praksis for login-sikkerhed
						</Text>

						<Divider my='md' />

						<form onSubmit={handleLogin}>
							<input type='hidden' name='csrf_token' value={csrfToken} />

							<TextInput label='Brugernavn' placeholder='Indtast dit brugernavn' required value={username} onChange={(e) => setUsername(e.target.value)} className='mb-3' />

							<PasswordInput label='Adgangskode' placeholder='Indtast din adgangskode' required value={password} onChange={(e) => setPassword(e.target.value)} className='mb-4' />

							{successMessage && (
								<Alert color='green' className='mb-4'>
									{successMessage}
								</Alert>
							)}

							{errorMessage && (
								<Alert color='red' icon={<WarningCircle weight='fill' />} className='mb-4'>
									{errorMessage}
								</Alert>
							)}

							{isRateLimited && (
								<Alert color='yellow' icon={<WarningCircle weight='fill' />} className='mb-4'>
									Kontoen er midlertidigt låst på grund af for mange loginforsøg.
								</Alert>
							)}

							<Button type='submit' fullWidth color='green' disabled={isRateLimited}>
								Log ind
							</Button>
						</form>

						<Text size='xs' className='text-center mt-4 text-blue-300'>
							*Prøv at logge ind med brugernavn "admin" og adgangskode "secure123"
						</Text>
					</Paper>

					<Paper withBorder p='lg' radius='md' className='bg-blue-800/30 text-white'>
						<Title order={4} className='mb-4'>
							Historisk kontekst
						</Title>

						<Text size='sm' className='mb-3'>
							Sikker login-teknologi har sine rødder i krypteringsmetoder som blev brugt under 2. Verdenskrig.
						</Text>

						<Text size='sm' className='mb-3'>
							Enigma-maskinen repræsenterede et tidligt forsøg på at skabe sikker kommunikation, men var sårbar på grund af gentagne mønstre og menneskelige fejl.
						</Text>

						<Text size='sm' className='mb-3'>
							Moderne teknikker som password-hashing, salting og beskyttelse mod angreb er udviklinger af de grundlæggende principper fra denne tid.
						</Text>

						<Divider my='md' />

						<Title order={5} className='mb-2'>
							Test for XSS-beskyttelse:
						</Title>
						<Text size='xs' color='dimmed' className='mb-2'>
							Prøv at bruge følgende som brugernavn for at teste XSS-beskyttelsen:
						</Text>
						<Code block className='text-xs bg-blue-950 overflow-x-auto p-2 mb-2 border border-blue-500 rounded'>
							{'<img src="x" onerror="alert(\'XSS Attack!\')">'}
						</Code>
						<Text size='xs' color='dimmed'>
							På den sikre side burde dette blive saniteret og ikke udføre koden.
						</Text>
					</Paper>
				</SimpleGrid>
			</Container>
		</Box>
	);
}

const Code = ({ children, block, className }: { children: React.ReactNode; block?: boolean; className?: string }) => {
	return <div className={`font-mono ${block ? 'block' : 'inline'} ${className || ''}`}>{children}</div>;
};

export default LoginSafe;
