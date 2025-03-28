import { useState, FormEvent } from 'react';
import { Box, TextInput, PasswordInput, Button, Title, Text, Container, Paper, Group, Alert, Divider, List, Badge, SimpleGrid, Modal } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { WarningOctagon, CaretLeft, Skull, Code, Check, Lightning, ShieldSlash } from '@phosphor-icons/react';

type User = {
	username: string;
	password: string;
};

function LoginUnsafe() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginMessage, setLoginMessage] = useState<string>('');
	const [isHacked, setIsHacked] = useState<boolean>(false);
	const [attackType, setAttackType] = useState<string>('');
	const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
	const [showXssModal, setShowXssModal] = useState<boolean>(false);

	const users: User[] = [
		{ username: 'admin', password: 'password123' },
		{ username: 'user', password: '12345' },
		{ username: 'enigma', password: 'museum' },
	];

	const handleLogin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// If the XSS attack was triggered, show the visual simulation
		if (username.includes('<script') || username.includes('<img') || username.includes('onerror')) {
			setShowXssModal(true);
			return;
		}

		// For SQL Injection demo - automatic success for "admin' --"
		if (username.includes("admin'") && username.includes('--')) {
			setLoginMessage(`Login successful for admin`);
			return;
		}

		const user = users.find((u) => u.username === username && u.password === password);

		if (user) {
			setLoginMessage(`Login successful for ${username}`);
			console.log(`User logged in: ${username}, Password used: ${password}`);
		} else {
			const userExists = users.some((u) => u.username === username);
			if (userExists) {
				setLoginMessage(`Incorrect password for user: ${username}`);
			} else {
				setLoginMessage(`User not found: ${username}`);
			}
		}
	};

	const handleXSSAttack = () => {
		const xssPayload = `<img src="x" onerror="alert('XSS Attack!')">`;
		setUsername(xssPayload);
		setAttackType('xss');
		setIsHacked(true);
		setShowLoginForm(false);
	};

	const handleSQLInjection = () => {
		setUsername("admin' --");
		setPassword('anything');
		setAttackType('sql');
		setIsHacked(true);
		setShowLoginForm(false);
	};

	const continueAttack = () => {
		setShowLoginForm(true);
	};

	// XSS attack modal simulation
	const XssAttackModal = () => (
		<Modal
			opened={showXssModal}
			onClose={() => setShowXssModal(false)}
			title={
				<div className='flex items-center'>
					<Lightning size={20} className='mr-2 text-yellow-400' weight='fill' />
					XSS Angreb Udført!
				</div>
			}
			centered
			overlayProps={{
				color: '#000',
				opacity: 0.65,
				blur: 3,
			}}
			classNames={{
				header: 'bg-red-800 text-white p-3',
				title: 'font-bold',
				body: 'bg-red-900 p-4 text-white',
			}}
			size='sm'
		>
			<div className='mb-2 bg-black/40 p-2 rounded'>
				<Text size='xs' fw='bold' mb={4} className='flex items-center'>
					<ShieldSlash className='mr-1 text-red-400' weight='fill' />
					Dette ville ske i en sårbar applikation:
				</Text>

				<div className='border border-red-500 p-2 text-center bg-black/30 rounded'>
					<div className='text-yellow-300 font-mono mb-1 text-xs'>alert("XSS Attack!")</div>
					<Badge color='red' size='sm'>
						JavaScript kode er blevet udført!
					</Badge>
				</div>
			</div>

			<Title order={5} mb={4} size='sm'>
				Hvorfor er dette farligt?
			</Title>
			<List size='xs' spacing='xs' mb={8}>
				<List.Item>Angriberen kan stjæle brugerens cookies og session data</List.Item>
				<List.Item>Angriberen kan omdirigere brugeren til ondsindet websted</List.Item>
				<List.Item>Angriberen kan indsætte falske login-formularer</List.Item>
			</List>

			<Text size='xs' fs='italic' mb={8}>
				Bemærk: Moderne browsere og frameworks som React har beskyttelsesmekanismer mod XSS.
			</Text>

			<Button fullWidth color='red' onClick={() => setShowXssModal(false)}>
				Luk demonstration
			</Button>
		</Modal>
	);

	return (
		<Box className='flex flex-col min-h-screen bg-gradient-to-r from-zinc-900 to-zinc-800' p='md'>
			<Container size='xl' className='flex-grow flex flex-col justify-center'>
				<Link to='/' className='text-white mb-4 flex items-center'>
					<CaretLeft size={16} className='mr-2' /> Tilbage til forside
				</Link>

				<SimpleGrid cols={3} spacing='md'>
					<Paper withBorder p='md' radius='md' className='bg-red-800/30 text-white'>
						<Title order={4} mb={16} className='flex items-center'>
							<WarningOctagon size={20} className='mr-2 text-red-400' weight='fill' />
							Sikkerhedsproblemer
						</Title>

						<List spacing='xs' size='sm'>
							<List.Item>
								<Badge color='red' variant='light' className='mr-2'>
									Ingen CSRF-beskyttelse
								</Badge>
								Sårbar over for Cross-Site Request Forgery angreb
							</List.Item>
							<List.Item>
								<Badge color='red' variant='light' className='mr-2'>
									Ingen Rate Limiting
								</Badge>
								Sårbar over for brute force-angreb
							</List.Item>
							<List.Item>
								<Badge color='red' variant='light' className='mr-2'>
									Ingen XSS-beskyttelse
								</Badge>
								Sårbar over for cross-site scripting angreb
							</List.Item>
							<List.Item>
								<Badge color='red' variant='light' className='mr-2'>
									Usikker fejlhåndtering
								</Badge>
								Giver specifikke fejlmeddelelser der kan hjælpe angribere
							</List.Item>
							<List.Item>
								<Badge color='red' variant='light' className='mr-2'>
									Usikker password lagring
								</Badge>
								Gemmer adgangskoder i klartekst (ikke hashed/saltet)
							</List.Item>
						</List>

						<Divider my='md' />

						<Title order={5} mb={8} className='flex items-center'>
							<Skull size={18} className='mr-2' weight='fill' />
							Usikker "Database" (Klartekst)
						</Title>

						<CodeBlock className='text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded'>
							{`[
  { username: "admin", password: "password123" },
  { username: "user", password: "12345" },
  { username: "enigma", password: "museum" }
]`}
						</CodeBlock>
					</Paper>

					<Paper withBorder p='md' radius='md' className='bg-red-800/20 text-white relative'>
						<Title order={2} ta='center' mb={8} className='flex items-center justify-center'>
							<WarningOctagon size={28} className='mr-2 text-yellow-400' weight='fill' />
							Usikker Login
						</Title>

						<Text size='sm' ta='center' mb={8}>
							Denne side demonstrerer usikre login-metoder — brug aldrig disse i virkelige systemer!
						</Text>

						<Divider my='md' />

						{showLoginForm ? (
							<>
								<form onSubmit={handleLogin}>
									<TextInput
										label='Brugernavn'
										placeholder='Indtast brugernavn'
										required
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										mb={12}
										classNames={{
											input: isHacked ? 'border-2 border-yellow-400' : '',
										}}
									/>

									<PasswordInput label='Adgangskode' placeholder='Indtast adgangskode' required value={password} onChange={(e) => setPassword(e.target.value)} mb={16} />

									{loginMessage && (
										<Alert color={loginMessage.includes('not found') || loginMessage.includes('Incorrect') ? 'red' : 'green'} mb={16}>
											{loginMessage}
										</Alert>
									)}

									<Button type='submit' fullWidth color='red' mb={12}>
										Log ind (Usikkert)
									</Button>
								</form>

								<Divider label='Angrebssimuleringer' labelPosition='center' my='md' />

								<Group align='center' mb={16} grow>
									<Button variant='filled' size='xs' color='yellow' onClick={handleXSSAttack} leftSection={<Code weight='bold' />}>
										Simuler XSS-angreb
									</Button>

									<Button variant='filled' size='xs' color='orange' onClick={handleSQLInjection} leftSection={<Code weight='bold' />}>
										Simuler SQL-injektion
									</Button>
								</Group>
							</>
						) : (
							<Box>
								{attackType === 'xss' && (
									<Alert color='yellow' mb={16}>
										<Title order={5} mb={12}>
											XSS Angreb Demonstration
										</Title>
										<Text size='sm' mb={8}>
											<WarningOctagon className='inline mr-1' weight='fill' /> En ondsindet JavaScript kode er blevet indsat i brugernavnfeltet:
										</Text>
										<CodeBlock className='text-xs bg-yellow-900/40 p-2 mb-3 border border-yellow-500 rounded'>{'<img src="x" onerror="alert(\'XSS Attack!\')">'}</CodeBlock>

										<Text size='sm' mb={4}>
											Følg disse trin for at se angrebet:
										</Text>
										<List size='sm' mb={12}>
											<List.Item icon={<Check size={16} />}>Klik på "Fortsæt til login" nedenfor</List.Item>
											<List.Item icon={<Check size={16} />}>Klik derefter på "Log ind" knappen</List.Item>
											<List.Item icon={<Check size={16} />}>En simulation af XSS-angrebet vil vises i en popup</List.Item>
										</List>

										<Text size='xs' fs='italic' mb={16}>
											Bemærk: Moderne browsere og frameworks som React har indbygget XSS-beskyttelse, så du vil se en simulation i stedet for det faktiske angreb.
										</Text>

										<Button fullWidth color='yellow' onClick={continueAttack}>
											Fortsæt til login
										</Button>
									</Alert>
								)}

								{attackType === 'sql' && (
									<Alert color='orange' mb={16}>
										<Title order={5} mb={12}>
											SQL Injection Demonstration
										</Title>
										<Text size='sm' mb={8}>
											<WarningOctagon className='inline mr-1' weight='fill' /> SQL-injektion kode er indsat:
										</Text>
										<CodeBlock className='text-xs bg-orange-900/40 p-2 mb-3 border border-orange-500 rounded'>
											{`Brugernavn: admin' --
Adgangskode: anything`}
										</CodeBlock>

										<Text size='sm' mb={4}>
											Følg disse trin for at se angrebet:
										</Text>
										<List size='sm' mb={12}>
											<List.Item icon={<Check size={16} />}>Klik på "Fortsæt til login" nedenfor</List.Item>
											<List.Item icon={<Check size={16} />}>
												Bemærk at brugernavnet nu er <code>admin' --</code> og adgangskoden er <code>anything</code>
											</List.Item>
											<List.Item icon={<Check size={16} />}>Klik på "Log ind" knappen og bemærk at du bliver logget ind som 'admin' uden korrekt adgangskode</List.Item>
										</List>

										<Text size='xs' fs='italic' mb={16}>
											SQL-kommandoen <code>'--</code> kommenterer resten af forespørgslen væk, hvilket effektivt deaktiverer password-tjekket
										</Text>

										<Button fullWidth color='orange' onClick={continueAttack}>
											Fortsæt til login
										</Button>
									</Alert>
								)}
							</Box>
						)}

						<Text size='xs' ta='center' mt={16} c='red.3'>
							*Prøv at logge ind med brugernavn "admin" og adgangskode "password123"
						</Text>
					</Paper>

					<Paper withBorder p='md' radius='md' className='bg-red-800/30 text-white'>
						<Title order={4} mb={16}>
							Angrebsforklaringer
						</Title>

						<Title order={5} mb={8}>
							XSS (Cross-Site Scripting)
						</Title>
						<Text size='sm' mb={12}>
							XSS-angreb indsprøjter ondsindede scripts ind i ellers tillidsfulde websites. Angribere kan stjæle cookies, session tokens, eller andre følsomme oplysninger.
						</Text>

						<Title order={5} mb={8} mt={16}>
							SQL Injection
						</Title>
						<Text size='sm' mb={12}>
							SQL-injektion udnytter sårbare database-forespørgsler ved at indsætte ondsindede SQL-kommandoer. Angribere kan omgå login-systemer, ændre database-data eller endda slette hele databaser.
						</Text>

						<Divider my='md' />

						<Title order={5} mb={8}>
							Moderne sikkerhedsmekanismer
						</Title>
						<Text size='sm' mb={12}>
							Moderne frameworks som React har indbygget beskyttelse mod XSS-angreb ved at eskapere specialtegn. Dette er grunden til, at vi bruger simulationer til at vise, hvordan angrebene ville virke i ældre eller sårbare systemer.
						</Text>

						<Text size='xs' fs='italic' mt={12}>
							For virkelige sikkerhedstests bør der altid bruges specialiserede værktøjer og professionelle sikkerhedseksperter.
						</Text>
					</Paper>
				</SimpleGrid>
			</Container>

			<XssAttackModal />
		</Box>
	);
}

const CodeBlock = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <div className={`font-mono block ${className || ''}`}>{children}</div>;
};

export default LoginUnsafe;