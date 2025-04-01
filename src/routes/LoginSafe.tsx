import { useState, FormEvent } from 'react';
import { Box, TextInput, PasswordInput, Button, Title, Text, Container, Paper, Alert, Divider, Badge, SimpleGrid, Accordion, Progress, Group, Card, ThemeIcon } from '@mantine/core';
import { Shield, WarningCircle, Check, LockKey, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';

function LoginSafe() {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginAttempts, setLoginAttempts] = useState<number>(0);
	const [csrfToken, _setCsrfToken] = useState<string>(() => generateCSRFToken());
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [activeSecurityFeature, setActiveSecurityFeature] = useState<string | null>(null);
	const [completedLearningSections, setCompletedLearningSections] = useState<string[]>([]);

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
			highlightSecurityFeature('rate-limiting');
			return;
		}

		setLoginAttempts(loginAttempts + 1);

		const sanitizedUsername = sanitizeInput(username);

		if (username !== sanitizedUsername) {
			highlightSecurityFeature('xss-protection');
		}

		if (sanitizedUsername === 'admin' && password === 'secure123') {
			setSuccessMessage('Login lykkedes! Velkommen tilbage.');
			markSectionCompleted('successful-login');
		} else {
			setErrorMessage('Forkert brugernavn eller adgangskode.');
		}
	};

	const highlightSecurityFeature = (feature: string) => {
		setActiveSecurityFeature(feature);
		setTimeout(() => {
			setActiveSecurityFeature(null);
		}, 3000);
		markSectionCompleted(feature);
	};

	const markSectionCompleted = (section: string) => {
		if (!completedLearningSections.includes(section)) {
			setCompletedLearningSections([...completedLearningSections, section]);
		}
	};

	const securityFeatures = [
		{
			id: 'csrf-protection',
			title: 'CSRF-beskyttelse',
			description: 'Cross-Site Request Forgery (CSRF) angreb tvinger brugeren til at udføre uønskede handlinger på en webapplikation, hvor de er autentificeret. CSRF-tokens forhindrer dette ved at kræve en unik værdi for hver formular-indsendelse.',
			icon: <Shield weight='fill' />,
			demo: <CodeDisplay code={`<input type="hidden" name="csrf_token" value="${csrfToken}" />`} />,
		},
		{
			id: 'rate-limiting',
			title: 'Rate Limiting',
			description: 'Rate limiting begrænser antallet af loginforsøg fra samme bruger eller IP-adresse inden for et bestemt tidsrum. Dette forhindrer brute force-angreb, hvor angribere prøver mange adgangskoder hurtigt efter hinanden.',
			icon: <Shield weight='fill' />,
			demo: (
				<CodeDisplay
					code={`if (loginAttempts >= 5) {
  setErrorMessage('For mange loginforsøg. Prøv igen senere.');
  return;
}`}
				/>
			),
		},
		{
			id: 'xss-protection',
			title: 'XSS-beskyttelse',
			description: 'Cross-Site Scripting (XSS) angreb indsprøjter ondsindede scripts i webapplikationer. Sanitering af brugerinput fjerner potentielt farlige HTML- og JavaScript-tags, før de behandles eller vises.',
			icon: <Shield weight='fill' />,
			demo: (
				<CodeDisplay
					code={`const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};`}
				/>
			),
		},
		{
			id: 'secure-feedback',
			title: 'Sikker feedback',
			description: 'Generiske fejlmeddelelser giver minimal information til angribere. Ved at undgå specifikke fejl (som "brugernavn findes ikke" eller "adgangskode er forkert") gives angribere færre informationer om systemet.',
			icon: <Shield weight='fill' />,
			demo: (
				<CodeDisplay
					code={`// Generisk fejlmeddelelse i stedet for specifik
setErrorMessage('Forkert brugernavn eller adgangskode.');
// I stedet for:
// setErrorMessage('Brugernavn findes ikke.');
// eller
// setErrorMessage('Forkert adgangskode for denne bruger.');`}
				/>
			),
		},
		{
			id: 'secure-session',
			title: 'Sikker session',
			description: 'Sikre sessioner bruger krypterede cookies, korte udløbstider og andre mekanismer til at beskytte brugerens autentificerede session mod tyveri eller misbrug.',
			icon: <Shield weight='fill' />,
			demo: (
				<CodeDisplay
					code={`// Eksempel på sikker cookie-opsætning
res.cookie('sessionId', sessionToken, {
  httpOnly: true,  // Ikke tilgængelig via JavaScript
  secure: true,    // Kun sendt over HTTPS
  sameSite: 'strict',  // Begrænser cross-site sending
  maxAge: 3600000  // Udløber efter 1 time
});`}
				/>
			),
		},
	];

	return (
		<Box p='xl'>
			<Container size='xl'>
				<SimpleGrid cols={2} spacing='xl'>
					<Box>
						<Paper withBorder p='lg' radius='md' className='bg-blue-800/20 text-white mb-6'>
							<Group justify='space-between' mb='lg'>
								<Group>
									<Shield size={30} className='text-green-400' weight='fill' />
									<Title order={2}>Sikker Login</Title>
								</Group>
								<Badge color='green' size='lg'>
									Anbefalet
								</Badge>
							</Group>

							<Text size='md' className='mb-4'>
								Denne side implementerer de bedste praksisser for login-sikkerhed. Prøv at bruge følgende legitimationsoplysninger for at teste:
							</Text>

							<Text className='bg-blue-900/50 p-3 rounded mb-4 font-mono text-sm'>
								Brugernavn: admin
								<br />
								Adgangskode: secure123
							</Text>

							<Divider my='md' />

							<form onSubmit={handleLogin} className='relative'>
								<input type='hidden' name='csrf_token' value={csrfToken} />

								<TextInput label='Brugernavn' placeholder='Indtast dit brugernavn' required value={username} onChange={(e) => setUsername(e.target.value)} mb={12} className={activeSecurityFeature === 'xss-protection' ? 'ring-2 ring-green-400 transition-all' : ''} />

								<PasswordInput label='Adgangskode' placeholder='Indtast din adgangskode' required value={password} onChange={(e) => setPassword(e.target.value)} mb={16} visibilityToggleIcon={({ reveal }) => (reveal ? <EyeSlash size={16} /> : <Eye size={16} />)} className={activeSecurityFeature === 'rate-limiting' ? 'ring-2 ring-green-400 transition-all' : ''} />

								{successMessage && (
									<Alert color='green' mb={16} icon={<CheckCircle weight='fill' />}>
										{successMessage}
									</Alert>
								)}

								{errorMessage && (
									<Alert color='red' icon={<WarningCircle weight='fill' />} mb={16}>
										{errorMessage}
									</Alert>
								)}

								{isRateLimited && (
									<Alert color='yellow' icon={<WarningCircle weight='fill' />} mb={16}>
										Kontoen er midlertidigt låst på grund af for mange loginforsøg. Dette er en sikkerhedsforanstaltning for at forhindre brute force-angreb.
									</Alert>
								)}

								<Button type='submit' fullWidth color='green' size='md' disabled={isRateLimited}>
									<LockKey size={20} className='mr-2' weight='fill' />
									Log ind
								</Button>
							</form>
						</Paper>

						<Paper withBorder p='lg' radius='md' className='bg-blue-800/30 text-white'>
							<Title order={4} mb={16}>
								Historisk kontekst
							</Title>
							<Text size='sm' mb={12}>
								Sikker login-teknologi har sine rødder i krypteringsmetoder som blev brugt under 2. Verdenskrig. Enigma-maskinen repræsenterede et tidligt forsøg på at skabe sikker kommunikation.
							</Text>

							<Text size='sm' mb={12}>
								På samme måde som Enigma-koden til sidst blev knækket på grund af mønstre og gentagne fejl, kan moderne login-systemer kompromitteres hvis de ikke følger bedste praksis for sikkerhed.
							</Text>

							<Text size='sm'>Moderne login-beskyttelse bygger på disse historiske lektioner og tilføjer lag af sikkerhed som adgangskode-hashing, to-faktor autentifikation og beskyttelse mod forskellige angrebstyper.</Text>
						</Paper>
					</Box>

					<Box>
						<Paper withBorder p='lg' radius='md' className='bg-blue-800/30 text-white mb-6'>
							<Title order={3} mb={16} className='flex items-center'>
								<Shield size={24} className='mr-2 text-green-400' weight='fill' />
								Sikkerhedsforanstaltninger
							</Title>

							<Text size='sm' mb={16}>
								Denne side implementerer følgende sikkerhedsforanstaltninger. Klik på hver enkelt for at lære mere om hvordan de beskytter din login-proces.
							</Text>

							<Accordion variant='separated'>
								{securityFeatures.map((feature) => (
									<Accordion.Item key={feature.id} value={feature.id} className={activeSecurityFeature === feature.id ? 'bg-green-900/30 border-green-500' : 'bg-blue-900/20'}>
										<Accordion.Control>
											<Group>
												<ThemeIcon color='green' variant='light' size='md'>
													{feature.icon}
												</ThemeIcon>
												<Text fw={500}>{feature.title}</Text>
												{completedLearningSections.includes(feature.id) && (
													<Badge color='green' variant='light'>
														<Group gap={4}>
															<Check size={14} weight='bold' />
															<Text size='xs'>Set</Text>
														</Group>
													</Badge>
												)}
											</Group>
										</Accordion.Control>
										<Accordion.Panel>
											<Text size='sm' mb={12}>
												{feature.description}
											</Text>
											<Title order={6} mb={4}>
												Implementering:
											</Title>
											{feature.demo}
										</Accordion.Panel>
									</Accordion.Item>
								))}
							</Accordion>
						</Paper>

						<Paper withBorder p='lg' radius='md' className='bg-blue-800/40 text-white'>
							<Title order={4} mb={16}>
								Test Sikkerhedsmekanismer
							</Title>

							<Text size='sm' mb={12}>
								Lær ved at prøve! Test hver sikkerhedsmekanisme for at se hvordan de fungerer:
							</Text>

							<Card withBorder mb={8} className='bg-blue-900/20'>
								<Title order={5} mb={8}>
									Test XSS-beskyttelse:
								</Title>
								<Text size='sm' mb={8}>
									Kopier og indsæt dette i brugernavnfeltet:
								</Text>
								<CodeDisplay code={'<img src="x" onerror="alert(\'XSS Attack!\')">'} className='mb-4' />
								<Button
									size='sm'
									variant='light'
									color='blue'
									onClick={() => {
										setUsername('<img src="x" onerror="alert(\'XSS Attack!\')">');
										highlightSecurityFeature('xss-protection');
									}}
								>
									Indsæt XSS Test
								</Button>
								<Text size='xs' c='dimmed' mt={8}>
									På den sikre side vil dette blive saniteret og ikke udføre kode.
								</Text>
							</Card>

							<Card withBorder className='bg-blue-900/20'>
								<Title order={5} mb={8}>
									Test Rate Limiting:
								</Title>
								<Text size='sm' mb={8}>
									Klik på knappen nedenfor gentagne gange for at simulere flere loginforsøg:
								</Text>
								<Group justify='space-between'>
									<Text size='sm'>Login forsøg: {loginAttempts}/5</Text>
									<Text size='sm' c={isRateLimited ? 'red' : 'green'}>
										Status: {isRateLimited ? 'Låst' : 'Tilladt'}
									</Text>
								</Group>
								<Progress value={(loginAttempts / 5) * 100} className='my-2' color={isRateLimited ? 'red' : 'green'} />
								<Button
									size='sm'
									variant='light'
									color='blue'
									disabled={isRateLimited}
									onClick={() => {
										setLoginAttempts((prev) => Math.min(prev + 1, 5));
										if (loginAttempts >= 4) {
											highlightSecurityFeature('rate-limiting');
										}
									}}
								>
									Simuler login-forsøg
								</Button>
								<Button
									size='sm'
									variant='subtle'
									color='gray'
									className='mt-2'
									onClick={() => {
										setLoginAttempts(0);
									}}
								>
									Nulstil tæller
								</Button>
							</Card>
						</Paper>
					</Box>
				</SimpleGrid>
			</Container>
		</Box>
	);
}

const CodeDisplay = ({ code, className = '' }: { code: string; className?: string }) => {
	return <div className={`font-mono text-xs bg-blue-950 overflow-x-auto p-2 border border-blue-500 rounded ${className}`}>{code}</div>;
};

export default LoginSafe;
