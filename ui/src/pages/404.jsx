import Typography from '@suid/material/Typography'
import Box from '@suid/material/Box'
import Button from '@suid/material/Button'
import { useNavigate } from '@solidjs/router'

const NotFound = () => {
	const navigate = useNavigate()

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				mt: 14,
				textAlign: 'center',
			}}
		>
			<Typography
				sx={{
					fontSize: { xs: '5rem', sm: '7rem' },
					fontWeight: 800,
					lineHeight: 1,
					background: 'linear-gradient(135deg, #FF8F00 0%, #C62828 100%)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
					backgroundClip: 'text',
				}}
			>
				404
			</Typography>
			<Typography variant="h5" sx={{ fontWeight: 700, color: '#3a2417', mt: 1 }}>
				Page not found
			</Typography>
			<Typography variant="body2" sx={{ color: '#8a6f45', mt: 1, mb: 3 }}>
				The page you're looking for doesn't exist or was moved.
			</Typography>
			<Button
				variant="contained"
				color="secondary"
				onClick={() => navigate('/storages')}
			>
				Back to home
			</Button>
		</Box>
	)
}

export default NotFound
