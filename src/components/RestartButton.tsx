import { Button } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

export const RestartButton = () => {
	const navigate = useNavigate();

	return (
		<Button variant='outline' color='gray' pos='fixed' style={{ bottom: '20px', left: '20px', zIndex: 1000 }} onClick={() => navigate({ to: '/' })}>
            Start forfra
		</Button>
	);
};

