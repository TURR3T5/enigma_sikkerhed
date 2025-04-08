import { Button, Group, Box } from '@mantine/core';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';

export function NavigationButtons({ prevRoute, nextRoute }: { prevRoute: string; nextRoute: string }) {
	const navigate = useNavigate();

	return (
		<Box pos='fixed' top={20} right={20} style={{zIndex: 1000}}>
			<Group>
				<Button variant='light' color='gray' leftSection={<ArrowLeft size={16} />} onClick={() => navigate({ to: prevRoute })}>
					Gå tilbage
				</Button>

				<Button variant='filled' color='blue' rightSection={<ArrowRight size={16} />} onClick={() => navigate({ to: nextRoute })}>
					Gå videre
				</Button>
			</Group>
		</Box>
	);
}
