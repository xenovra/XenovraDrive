import Box from '@suid/material/Box'
import Paper from '@suid/material/Paper'
import Button from '@suid/material/Button'
import TextField from '@suid/material/TextField'
import Typography from '@suid/material/Typography'
import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import IconButton from '@suid/material/IconButton'
import HelpOutlineIcon from '@suid/icons-material/HelpOutline'
import ChevronLeftIcon from '@suid/icons-material/ChevronLeft'

import API from '../../api'
import { alertStore } from '../../components/AlertStack'

const ORANGE = '#FF8F00'
const RED = '#C62828'

const StorageCreateForm = () => {
	const [chatIdErr, setChatIdErr] = createSignal(null)
	const { addAlert } = alertStore
	const navigate = useNavigate()

	/**
	 *
	 * @param {SubmitEvent} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault()

		const data = new FormData(event.currentTarget)

		const name = data.get('name')
		const chatId = parseInt(data.get('chat_id'))

		await API.storages.createStorage(name, chatId)

		addAlert(`Created storage "${name}"`, 'success')

		navigate('/storages')
	}

	/**
	 *
	 * @param {SubmitEvent} event
	 */
	const validateChatId = (event) => {
		event.preventDefault()
		const value = event.currentTarget.value

		let err = null

		if (value > 0) {
			err = 'Chat id must be a valid negative integer'
		} else if (value === '') {
			err = 'Chat id is required and must be a valid negative integer'
		}

		setChatIdErr(err)
	}

	return (
		<Box sx={{ maxWidth: 480, mx: 'auto' }}>
			<Button
				onClick={() => navigate('/storages')}
				startIcon={<ChevronLeftIcon />}
				sx={{ color: '#667085', mb: 2, textTransform: 'none' }}
			>
				Back
			</Button>

			<Paper
				component="form"
				onSubmit={handleSubmit}
				sx={{
					p: { xs: 3, sm: 4 },
					borderRadius: '18px',
					boxShadow: '0 18px 40px -24px rgba(120,60,10,0.35)',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
					<Typography variant="h5" sx={{ fontWeight: 700, color: '#3a2417' }}>
						Register new storage
					</Typography>
					<a
						href="https://github.com/Xenovra/XenovraDrive/wiki/Creating-storages"
						target="_blank"
						rel="noreferrer"
					>
						<IconButton sx={{ py: 0, color: ORANGE }}>
							<HelpOutlineIcon fontSize="small" />
						</IconButton>
					</a>
				</Box>
				<Typography variant="body2" sx={{ color: '#8a6f45', mb: 3 }}>
					Link a Telegram chat as a storage backend
				</Typography>

				<TextField
					id="name"
					name="name"
					label="Name"
					variant="outlined"
					fullWidth
					required
					sx={{ mb: 2.5 }}
				/>
				<TextField
					id="chat_id"
					name="chat_id"
					label="Chat id"
					type="number"
					variant="outlined"
					onChange={validateChatId}
					helperText={chatIdErr()}
					error={typeof chatIdErr() === 'string'}
					fullWidth
					required
					sx={{ mb: 3 }}
				/>

				<Button
					type="submit"
					fullWidth
					sx={{
						py: 1.25,
						borderRadius: '12px',
						fontWeight: 700,
						color: '#fff',
						background: `linear-gradient(135deg, ${ORANGE} 0%, ${RED} 100%)`,
						boxShadow: `0 12px 26px -12px ${RED}`,
						'&:hover': {
							background: `linear-gradient(135deg, ${ORANGE} 12%, ${RED} 100%)`,
						},
					}}
				>
					Register storage
				</Button>
			</Paper>
		</Box>
	)
}

export default StorageCreateForm
