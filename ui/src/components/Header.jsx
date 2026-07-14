import AppBar from '@suid/material/AppBar'
import Toolbar from '@suid/material/Toolbar'
import Typography from '@suid/material/Typography'
import IconButton from '@suid/material/IconButton'
import { A, useNavigate } from '@solidjs/router'
import LogoutIcon from '@suid/icons-material/Logout'
import Box from '@suid/material/Box'

import AppIcon from './AppIcon'
import createLocalStore from '../../libs'

const Header = () => {
	const [_store, setStore] = createLocalStore()
	const navigate = useNavigate()

	const logout = (_) => {
		setStore('access_token')
		setStore('redirect', '/')

		navigate('/login')
	}

	return (
		<AppBar
			elevation={0}
			sx={{
				background: 'linear-gradient(90deg, #FF8F00 0%, #C62828 100%)',
				boxShadow: '0 6px 20px -8px rgba(198,40,40,0.55)',
			}}
		>
			<Toolbar sx={{ justifyContent: 'space-between' }}>
				<A href="/" style={{ 'text-decoration': 'none' }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<AppIcon />
						<Typography
							variant="h5"
							noWrap
							sx={{ pl: 1.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}
						>
							XenovraDrive
						</Typography>
					</Box>
				</A>

				<IconButton onClick={logout} sx={{ color: '#fff' }}>
					<LogoutIcon sx={{ color: 'white' }} />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}

export default Header
