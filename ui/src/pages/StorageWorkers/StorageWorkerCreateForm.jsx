import Box from '@suid/material/Box'
import Paper from '@suid/material/Paper'
import Button from '@suid/material/Button'
import TextField from '@suid/material/TextField'
import Select from '@suid/material/Select'
import InputLabel from '@suid/material/InputLabel'
import FormControl from '@suid/material/FormControl'
import Typography from '@suid/material/Typography'
import { createSignal, mapArray, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import MenuItem from '@suid/material/MenuItem'
import IconButton from '@suid/material/IconButton'
import HelpOutlineIcon from '@suid/icons-material/HelpOutline'
import ChevronLeftIcon from '@suid/icons-material/ChevronLeft'

import API from '../../api'
import { alertStore } from '../../components/AlertStack'

const ORANGE = '#FF8F00'
const RED = '#C62828'

const StorageWorkerCreateForm = () => {
	/**
	 * @type {[import("solid-js").Accessor<import("../../api").StorageWorker[]>, any]}
	 */
	const [storages, setStorages] = createSignal([])
	const { addAlert } = alertStore
	const navigate = useNavigate()

	onMount(async () => {
		const storagesSchema = await API.storages.listStorages()
		setStorages(storagesSchema.storages)
	})

	/**
	 *
	 * @param {SubmitEvent} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault()

		const data = new FormData(event.currentTarget)

		const name = data.get('name')
		const token = data.get('token')
		const storageId = data.get('storage_id')

		await API.storageWorkers.createStorageWorker(name, token, storageId)

		addAlert(`Created storage worker "${name}"`, 'success')

		navigate('/storage_workers')
	}

	return (
		<Box sx={{ maxWidth: 480, mx: 'auto' }}>
			<Button
				onClick={() => navigate('/storage_workers')}
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
						Register new storage worker
					</Typography>
					<a
						href="https://github.com/Xenovra/XenovraDrive/wiki/Creating-storage-workers"
						target="_blank"
						rel="noreferrer"
					>
						<IconButton sx={{ py: 0, color: ORANGE }}>
							<HelpOutlineIcon fontSize="small" />
						</IconButton>
					</a>
				</Box>
				<Typography variant="body2" sx={{ color: '#8a6f45', mb: 3 }}>
					Connect a Telegram bot token to a storage
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
					id="token"
					name="token"
					label="Token"
					variant="outlined"
					fullWidth
					required
					sx={{ mb: 2.5 }}
				/>
				<FormControl fullWidth variant="outlined" required sx={{ mb: 3 }}>
					<InputLabel id="storage-select-label">Storage</InputLabel>
					<Select
						labelId="storage-select-label"
						label="Storage"
						name="storage_id"
					>
						{mapArray(storages, (storage) => (
							<MenuItem value={storage.id}>{storage.name}</MenuItem>
						))}
					</Select>
				</FormControl>

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
					Register worker
				</Button>
			</Paper>
		</Box>
	)
}

export default StorageWorkerCreateForm
