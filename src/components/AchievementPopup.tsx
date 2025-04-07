import { useEffect } from 'react';
import { Paper, Text, Group, ThemeIcon, Transition, Box } from '@mantine/core';
import { Trophy } from '@phosphor-icons/react';

interface AchievementPopupProps {
	title: string;
	show: boolean;
	onComplete: () => void;
}

export function AchievementPopup({ title, show, onComplete }: AchievementPopupProps) {
	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				onComplete();
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [show, onComplete]);

	return (
		<Transition mounted={show} transition='slide-up' duration={400}>
			{(styles) => (
				<Paper style={{ ...styles, position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }} withBorder p='md' className='bg-gradient-to-r from-yellow-900 to-orange-900'>
					<Group>
						<ThemeIcon size='lg' radius='xl' color='yellow'>
							<Trophy size={20} weight='fill' />
						</ThemeIcon>
						<Box>
							<Text size='xs' c='white'>
								Bedrift Opnået!
							</Text>
							<Text fw='bold'>{title}</Text>
						</Box>
					</Group>
				</Paper>
			)}
		</Transition>
	);
}
