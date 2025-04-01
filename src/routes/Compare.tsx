import { useState } from 'react';
import { Box, Title, Text, Container, Paper, SimpleGrid, Group, ThemeIcon, Badge, Button, Divider, Timeline, Card, Collapse, List } from '@mantine/core';
import { Shield, WarningOctagon, ArrowsLeftRight, Check, X, CaretDown, CaretUp, Eye, EyeSlash, Book } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';

function Compare() {
	const [openedDetails, setOpenedDetails] = useState<string[]>([]);

	const toggleDetail = (id: string) => {
		if (openedDetails.includes(id)) {
			setOpenedDetails(openedDetails.filter((item) => item !== id));
		} else {
			setOpenedDetails([...openedDetails, id]);
		}
	};

	const isDetailOpen = (id: string) => openedDetails.includes(id);

	const securityFeatures = [
		{
			id: 'password-storage',
			title: 'Adgangskode Opbevaring',
			safeImplementation: {
				description: 'Adgangskoder hashes og saltes med bcrypt, en sikker hashing-algoritme designet til adgangskoder.',
				code: `// Server-side kode
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Gem adgangskode
const hashedPassword = await bcrypt.hash(password, saltRounds);
await db.users.create({ username, passwordHash: hashedPassword });

// Verificér adgangskode
const user = await db.users.findOne({ username });
const isValid = await bcrypt.compare(password, user.passwordHash);`,
				benefits: ['Selv hvis databasen kompromitteres, er adgangskoderne svære at genskabe', 'Individuelle salt-værdier forhindrer rainbow table angreb', 'Høj arbejdsfaktor gør brute force-angreb upraktiske'],
			},
			unsafeImplementation: {
				description: 'Adgangskoder gemmes i ren tekst, hvilket giver direkte adgang til alle brugerkonti hvis databasen kompromitteres.',
				code: `// Usikker implementation
const users = [
  { username: "admin", password: "password123" },
  { username: "user", password: "12345" }
];

// Gem adgangskode (direkte i klartekst)
await db.users.create({ username, password });

// Verificér adgangskode (simpel sammenligning)
const user = await db.users.findOne({ username });
const isValid = (password === user.password);`,
				risks: ['Enhver med adgang til databasen kan se alle adgangskoder', 'Datalæk eksponerer alle brugerkonti med det samme', 'Brugere genanvender ofte adgangskoder på tværs af tjenester, så én lækage kan kompromittere mange konti'],
			},
		},
		{
			id: 'csrf-protection',
			title: 'CSRF Beskyttelse',
			safeImplementation: {
				description: 'CSRF-tokens genereres for hver session og inkluderes i alle formularer for at bekræfte, at anmodningen kommer fra den autentiske webside.',
				code: `// Server-side kode
const csrfToken = crypto.randomBytes(32).toString('hex');
req.session.csrfToken = csrfToken;

// Client-side formular
<form action="/api/change-password" method="POST">
  <input type="hidden" name="csrf_token" value="${'{csrfToken}'}" />
  <!-- Andre formularfelter -->
</form>

// Server-side validering
if (req.body.csrf_token !== req.session.csrfToken) {
  return res.status(403).send('Ugyldig CSRF token');
}`,
				benefits: ['Forhindrer hackere i at udføre handlinger på vegne af logget ind bruger', 'Beskytter mod angreb fra ondsindede tredjepartswebsteder', 'Bekræfter at anmodningen kom fra din egen applikation'],
			},
			unsafeImplementation: {
				description: 'Ingen CSRF-beskyttelse implementeret, hvilket gør det muligt for ondsindede websites at udføre handlinger på brugerens vegne.',
				code: `// Usikker formular uden beskyttelse
<form action="/api/change-password" method="POST">
  <!-- Ingen CSRF token -->
  <input type="password" name="new_password" />
  <button type="submit">Skift adgangskode</button>
</form>

// Server-side uden validering
app.post('/api/change-password', (req, res) => {
  // Ingen validering af CSRF token
  changeUserPassword(req.session.userId, req.body.new_password);
});`,
				risks: ['Hackere kan lave skjulte formularer på deres websteder, der udfører handlinger på brugerens vegne', 'Angreb kan ændre brugerdata, adgangskoder eller foretage overførsler uden brugerens samtykke', 'Brugeren behøver blot at besøge den ondsindede side, mens de er logget ind på dit website'],
			},
		},
		{
			id: 'xss-protection',
			title: 'XSS Beskyttelse',
			safeImplementation: {
				description: 'Input saniteres før det gemmes eller vises, hvilket fjerner potentielt ondsindet kode og forhindrer cross-site scripting angreb.',
				code: `// Server-side kode
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};

const sanitizedUsername = sanitizeInput(username);

// Alternativt med et bibliotek
const sanitizedHtml = DOMPurify.sanitize(userInput);

// React's JSX eskaper automatisk HTML
return <div>{userContent}</div>;  // Sikker rendering`,
				benefits: ['Forhindrer indsprøjtning af ondsindede scripts i webapplikationen', 'Beskytter brugere mod at få deres cookies eller sessionsdata stjålet', 'Undgår phishing-angreb via din applikation'],
			},
			unsafeImplementation: {
				description: 'Brugerinput vises direkte uden sanitering, hvilket tillader ondsindede brugere at indsprøjte JavaScript-kode.',
				code: `// Usikker rendering af brugerinput
document.getElementById('profile').innerHTML = userInput;

// Usikker server-side rendering
res.send(\`<div>\${userInput}</div>\`);

// Farlig indlejring af data
const username = '<script>alert("XSS Attack!");</script>';
document.getElementById('greeting').innerHTML = 'Velkommen, ' + username;`,
				risks: ['Angribere kan indsprøjte JavaScript, der stjæler brugerdata eller session-cookies', 'Ondsindet kode udføres i ofrets browser med ofrets rettigheder', 'Kan omdirigere brugere til phishing-sider eller installere keyloggere'],
			},
		},
		{
			id: 'sql-injection',
			title: 'SQL Injektion Beskyttelse',
			safeImplementation: {
				description: 'Parameteriserede forespørgsler eller prepared statements adskiller SQL-kode fra bruger-input, hvilket forhindrer SQL-injektion.',
				code: `// Sikker kode med prepared statements
const query = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';
db.query(query, [username, passwordHash], (err, results) => {
  // Håndtér resultaterne
});

// Med ORM (f.eks. Sequelize)
const user = await User.findOne({
  where: {
    username: username
  }
});`,
				benefits: ['Forhindrer manipulation af database-forespørgsler gennem brugerinput', 'Beskytter databasen mod tyveri, ændring eller sletning af data', 'Opretholder dataintegritet og forebygger uautoriseret adgang'],
			},
			unsafeImplementation: {
				description: 'SQL-forespørgsler konstrueres ved direkte at indsætte brugerinput i SQL-strenge, hvilket gør dem sårbare over for injektion.',
				code: `// Usikker direkte string-interpolation
const query = \`SELECT * FROM users 
  WHERE username = '\${username}' 
  AND password = '\${password}'\`;
db.query(query, (err, results) => {
  // Håndtér resultaterne
});

// Hackere kan indsprøjte SQL som:
// username: admin' --
// Dette kommenterer resten af forespørgslen ud`,
				risks: ['Angribere kan omgå autentifikation uden at kende adgangskoder', 'Hele databaser kan blive stjålet, ændret eller slettet', 'Kan give adgang til følsomme data eller administrative funktioner'],
			},
		},
		{
			id: 'rate-limiting',
			title: 'Rate Limiting',
			safeImplementation: {
				description: 'Implementerer begrænsninger på antal loginforsøg, hvilket beskytter mod brute force-angreb ved at låse konti eller IP-adresser efter for mange fejlede forsøg.',
				code: `// Server-side rate limiting
const loginAttempts = {};

app.post('/login', (req, res) => {
  const ip = req.ip;
  const username = req.body.username;
  
  const key = \`\${ip}:\${username}\`;
  loginAttempts[key] = (loginAttempts[key] || 0) + 1;
  
  if (loginAttempts[key] >= 5) {
    return res.status(429).send('For mange loginforsøg. Prøv igen senere.');
  }
  
  // Normal login proces
});`,
				benefits: ['Gør brute force-angreb upraktiske ved at begrænse antal gæt', 'Forebygger automatiserede angreb mod mange brugerkonti samtidigt', 'Giver administratorer tid til at opdage og reagere på angrebsforsøg'],
			},
			unsafeImplementation: {
				description: 'Ingen begrænsning på loginforsøg, hvilket tillader uendeligt mange forsøg på at gætte adgangskoder.',
				code: `// Usikker login uden rate limiting
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Tjek brugeroplysninger uden begrænsning på antal forsøg
  const user = users.find(u => u.username === username);
  
  if (user && user.password === password) {
    req.session.user = user;
    return res.redirect('/dashboard');
  }
  
  return res.status(401).send('Ugyldigt brugernavn eller adgangskode');
});`,
				risks: ['Angribere kan prøve tusindvis af adgangskoder på få minutter', 'Automatiserede scripts kan målrette svage adgangskoder', 'Systemet kan overbelastes af massive login-anmodninger'],
			},
		},
		{
			id: 'error-handling',
			title: 'Sikker Fejlhåndtering',
			safeImplementation: {
				description: 'Bruger generiske fejlmeddelelser, der ikke afslører specifikke detaljer om systemet eller gyldig/ugyldig information.',
				code: `// Sikker fejlhåndtering
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Login logik...
    if (!authenticated) {
      return res.status(401).send('Ugyldigt brugernavn eller adgangskode');
    }
    
    // Success...
  } catch (error) {
    // Log den fulde fejl på serveren
    console.error(error);
    
    // Send generisk fejl til klienten
    return res.status(500).send('Der opstod en fejl. Prøv igen senere.');
  }
});`,
				benefits: ['Giver ikke angribere information om gyldige brugernavne eller konti', 'Skjuler tekniske detaljer, der kan udnyttes i målrettede angreb', 'Reducerer informationslækage om systemets indre virkemåde'],
			},
			unsafeImplementation: {
				description: 'Giver specifikke fejlmeddelelser, der kan afsløre eksistensen af brugerkonti eller andre systemdetaljer.',
				code: `// Usikker specifik fejlhåndtering
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).send('Brugernavn findes ikke');
  }
  
  if (user.password !== password) {
    return res.status(401).send('Forkert adgangskode for denne bruger');
  }
  
  // Success...
});`,
				risks: ['Gør det muligt for angribere at bekræfte eksistensen af brugerkonti', 'Muliggør målrettede angreb mod bekræftede konti', 'Blotlægger systemdetaljer, der kan udnyttes i mere avancerede angreb'],
			},
		},
	];

	return (
		<Box p='xl'>
			<Container size='xl'>
				<Paper withBorder p='lg' radius='md' className='bg-purple-900/10 text-white mb-6'>
					<Group justify='space-between' className='mb-4'>
						<Group>
							<ArrowsLeftRight size={30} className='text-purple-400' weight='fill' />
							<Title order={2}>Sammenligning af Sikker vs. Usikker Login</Title>
						</Group>
						<Badge color='grape' size='lg'>
							Læringsværktøj
						</Badge>
					</Group>

					<Text size='lg' mb={24}>
						Denne side giver en side-om-side sammenligning af sikre og usikre implementeringer af login-funktionalitet. Udforsk hver sikkerhedsfunktion for at forstå forskellen og lær hvordan du beskytter dine brugere.
					</Text>

					<SimpleGrid cols={2} spacing='md' className='mb-6'>
						<Card withBorder className='bg-green-900/20'>
							<Group mb={12}>
								<Shield size={24} className='text-green-400' weight='fill' />
								<Title order={3}>Sikker Implementation</Title>
							</Group>
							<Text>Følger industriens bedste praksis og beskytter brugerdata mod almindelige angreb. Klik på "Prøv Sikker Login" for at se disse principper implementeret.</Text>
							<Link to='/login-safe' className='w-full mt-4'>
								<Button color='green' fullWidth>
									<Eye size={18} className='mr-2' />
									Prøv Sikker Login
								</Button>
							</Link>
						</Card>

						<Card withBorder className='bg-red-900/20'>
							<Group mb={12}>
								<WarningOctagon size={24} className='text-red-400' weight='fill' />
								<Title order={3}>Usikker Implementation</Title>
							</Group>
							<Text>Indeholder almindelige sikkerhedssårbarheder, der kan udnyttes af angribere. Klik på "Prøv Usikker Login" for at se disse sårbarheder demonstreret.</Text>
							<Link to='/login-unsafe' className='w-full mt-4'>
								<Button color='red' fullWidth>
									<EyeSlash size={18} className='mr-2' />
									Prøv Usikker Login
								</Button>
							</Link>
						</Card>
					</SimpleGrid>

					<Divider my='xl' label='Sikkerhedsfunktioner' labelPosition='center' />

					<Box>
						{securityFeatures.map((feature, _index) => (
							<Paper key={feature.id} withBorder className='bg-purple-900/20 mb-6' p='lg' radius='md'>
								<Group justify='space-between' mb={16}>
									<Title order={3}>{feature.title}</Title>
									<Button variant='subtle' color='grape' onClick={() => toggleDetail(feature.id)} rightSection={isDetailOpen(feature.id) ? <CaretUp size={14} /> : <CaretDown size={14} />}>
										{isDetailOpen(feature.id) ? 'Skjul detaljer' : 'Vis detaljer'}
									</Button>
								</Group>

								<SimpleGrid cols={2} spacing='lg'>
									<Card withBorder className='bg-green-900/20'>
										<Group mb={12}>
											<ThemeIcon color='green' size='md' radius='xl'>
												<Check size={18} weight='bold' />
											</ThemeIcon>
											<Text fw='bold'>Sikker Implementering</Text>
										</Group>

										<Text size='sm' mb={16}>
											{feature.safeImplementation.description}
										</Text>

										<Collapse in={isDetailOpen(feature.id)}>
											<Paper withBorder p='sm' radius='md' className='bg-green-900/10 mb-4'>
												<Title order={6} mb={8}>
													Fordele:
												</Title>
												<List size='sm' spacing='xs'>
													{feature.safeImplementation.benefits.map((benefit, i) => (
														<List.Item
															key={i}
															icon={
																<ThemeIcon color='green' size='sm' radius='xl'>
																	<Check size={12} weight='bold' />
																</ThemeIcon>
															}
														>
															{benefit}
														</List.Item>
													))}
												</List>
											</Paper>

											<Title order={6} mb={4}>
												Sikker Kode:
											</Title>
											<div className='font-mono text-xs bg-green-950 overflow-x-auto p-2 border border-green-500 rounded'>{feature.safeImplementation.code}</div>
										</Collapse>
									</Card>

									<Card withBorder className='bg-red-900/20'>
										<Group mb={12}>
											<ThemeIcon color='red' size='md' radius='xl'>
												<X size={18} weight='bold' />
											</ThemeIcon>
											<Text fw='bold'>Usikker Implementering</Text>
										</Group>

										<Text size='sm' mb={16}>
											{feature.unsafeImplementation.description}
										</Text>

										<Collapse in={isDetailOpen(feature.id)}>
											<Paper withBorder p='sm' radius='md' className='bg-red-900/10 mb-4'>
												<Title order={6} mb={8}>
													Risici:
												</Title>
												<List size='sm' spacing='xs'>
													{feature.unsafeImplementation.risks.map((risk, i) => (
														<List.Item
															key={i}
															icon={
																<ThemeIcon color='red' size='sm' radius='xl'>
																	<WarningOctagon size={12} weight='bold' />
																</ThemeIcon>
															}
														>
															{risk}
														</List.Item>
													))}
												</List>
											</Paper>

											<Title order={6} mb={4}>
												Usikker Kode:
											</Title>
											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded'>{feature.unsafeImplementation.code}</div>
										</Collapse>
									</Card>
								</SimpleGrid>
							</Paper>
						))}
					</Box>

					<Box mt={32}>
						<Group justify='center' gap='xl'>
							<Card withBorder p='lg' radius='md' className='bg-blue-900/20 w-full max-w-md'>
								<Title order={4} mb={16} ta='center'>
									Hvad har du lært?
								</Title>

								<Timeline active={3} bulletSize={24} lineWidth={2} mb={20}>
									<Timeline.Item bullet={<Shield size={12} />} title='Sikkerhedsgrundlag'>
										<Text size='sm' color='dimmed'>
											Adgangskoder skal altid hashes og saltes
										</Text>
									</Timeline.Item>
									<Timeline.Item bullet={<Shield size={12} />} title='Beskyttelse mod angreb'>
										<Text size='sm' color='dimmed'>
											Implementering af CSRF-beskyttelse og XSS-sanitering
										</Text>
									</Timeline.Item>
									<Timeline.Item bullet={<Shield size={12} />} title='Datavalidering'>
										<Text size='sm' color='dimmed'>
											Sikker håndtering af brugerinput og sikre SQL-forespørgsler
										</Text>
									</Timeline.Item>
									<Timeline.Item bullet={<Shield size={12} />} title='Brugercentreret sikkerhed'>
										<Text size='sm' color='dimmed'>
											Balance mellem sikkerhed og brugervenlighed
										</Text>
									</Timeline.Item>
								</Timeline>

								<SimpleGrid cols={2} spacing='sm'>
									<Link to='/learn' className='w-full'>
										<Button variant='outline' color='blue' fullWidth leftSection={<Book size={16} />}>
											Fortsæt læring
										</Button>
									</Link>

									<Link to='/' className='w-full'>
										<Button variant='outline' color='grape' fullWidth>
											Tilbage til forside
										</Button>
									</Link>
								</SimpleGrid>
							</Card>
						</Group>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
}

export default Compare;
