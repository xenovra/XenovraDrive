import { onMount } from 'solid-js'
import Box from '@suid/material/Box'
import TextField from '@suid/material/TextField'
import Button from '@suid/material/Button'
import Typography from '@suid/material/Typography'
import InputAdornment from '@suid/material/InputAdornment'
import PersonAddOutlinedIcon from '@suid/icons-material/PersonAddOutlined'
import EmailOutlinedIcon from '@suid/icons-material/EmailOutlined'
import LockOutlinedIcon from '@suid/icons-material/LockOutlined'
import createLocalStore from '../../libs'
import { A, useNavigate } from '@solidjs/router'

import API from '../api'
import { alertStore } from '../components/AlertStack'

// Palette: cream / amber / orange / deep red
const CREAM = '#F5F5DC'
const AMBER = '#FBC02D'
const ORANGE = '#FF8F00'
const RED = '#C62828'

const Register = () => {
	const [store, setStore] = createLocalStore()
	const { addAlert } = alertStore
	const navigate = useNavigate()

	onMount(() => {
		if (store.access_token) {
			navigate('/')
		}
	})

	/**
	 *
	 * @param {SubmitEvent} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		const email = data.get('email')
		const password = data.get('password')

		// Registerting
		await API.users.register(email, password)

		addAlert('You registered successfully')

		// Authenticating
		const tokenData = await API.auth.login(email, password)

		setStore('access_token', tokenData.access_token)

		const redirect_url = store.redirect || '/'
		navigate(redirect_url)
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 2,
				background:
					'radial-gradient(1100px 560px at 100% -12%, #ffe6c9 0%, rgba(255,230,201,0) 52%),' +
					'radial-gradient(900px 480px at -10% 110%, #ffd9d0 0%, rgba(255,217,208,0) 50%),' +
					'linear-gradient(180deg, #ffffff 0%, #f4f5f7 100%)',
			}}
		>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					width: '100%',
					maxWidth: 420,
					borderRadius: '24px',
					px: { xs: 3, sm: 5 },
					py: { xs: 4, sm: 5 },
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					background: '#ffffff',
					border: '1px solid #edeff3',
					boxShadow:
						'0 30px 70px -32px rgba(17,24,39,0.28), 0 10px 24px -16px rgba(198,40,40,0.14)',
					'& > :not(style)': { my: 1 },
				}}
			>
				{/* Brand badge */}
				<Box
					sx={{
						width: 68,
						height: 68,
						borderRadius: '20px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: `linear-gradient(135deg, ${AMBER} 0%, ${ORANGE} 55%, ${RED} 100%)`,
						boxShadow: `0 12px 26px -6px ${ORANGE}99`,
						mb: 1,
					}}
				>
					<PersonAddOutlinedIcon sx={{ color: '#fff', fontSize: 34 }} />
				</Box>

				<Typography
					variant="h5"
					sx={{ fontWeight: 700, color: RED, letterSpacing: '-0.5px' }}
				>
					Create your account
				</Typography>
				<Typography
					variant="body2"
					sx={{ color: '#8a6f45', mt: '-4px !important', mb: 1 }}
				>
					Join XenovraDrive — it only takes a minute
				</Typography>

				<TextField
					name="email"
					label="Email"
					placeholder="you@example.com"
					variant="outlined"
					type="email"
					required
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<EmailOutlinedIcon sx={{ color: ORANGE }} />
							</InputAdornment>
						),
					}}
					sx={fieldSx}
				/>
				<TextField
					name="password"
					label="Password"
					placeholder="••••••••"
					variant="outlined"
					type="password"
					required
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<LockOutlinedIcon sx={{ color: ORANGE }} />
							</InputAdornment>
						),
					}}
					sx={fieldSx}
				/>

				<Button
					type="submit"
					fullWidth
					sx={{
						mt: 2,
						py: 1.35,
						borderRadius: '14px',
						fontWeight: 700,
						fontSize: '1rem',
						textTransform: 'none',
						color: '#fff',
						background: `linear-gradient(135deg, ${ORANGE} 0%, ${RED} 100%)`,
						boxShadow: `0 12px 26px -10px ${RED}`,
						transition: 'transform .15s ease, box-shadow .15s ease',
						'&:hover': {
							background: `linear-gradient(135deg, ${ORANGE} 12%, ${RED} 100%)`,
							transform: 'translateY(-1px)',
							boxShadow: `0 16px 30px -10px ${RED}`,
						},
					}}
				>
					Create account
				</Button>

				<Typography variant="body2" sx={{ color: '#8a6f45', mt: 2 }}>
					Already have an account?{' '}
					<A
						class="default-link"
						href="/login"
						style={{ color: RED, 'font-weight': 600, 'text-decoration': 'none' }}
					>
						Sign in
					</A>
				</Typography>
			</Box>
		</Box>
	)
}

const fieldSx = {
	'& .MuiOutlinedInput-root': {
		borderRadius: '14px',
		background: 'rgba(255,255,255,0.65)',
		'& fieldset': { borderColor: 'rgba(255,143,0,0.30)' },
		'&:hover fieldset': { borderColor: 'rgba(255,143,0,0.55)' },
		'&.Mui-focused fieldset': { borderColor: '#FF8F00', borderWidth: '2px' },
	},
	'& label.Mui-focused': { color: '#C62828' },
}

export default Register
