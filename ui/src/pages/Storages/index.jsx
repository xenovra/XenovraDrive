import Typography from '@suid/material/Typography'
import Box from '@suid/material/Box'
import Paper from '@suid/material/Paper'
import Table from '@suid/material/Table'
import TableBody from '@suid/material/TableBody'
import TableCell from '@suid/material/TableCell'
import TableContainer from '@suid/material/TableContainer'
import TableHead from '@suid/material/TableHead'
import TableRow from '@suid/material/TableRow'
import Button from '@suid/material/Button'
import AddIcon from '@suid/icons-material/Add'
import StorageIcon from '@suid/icons-material/Storage'
import { Show, createSignal, mapArray, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'

import API from '../../api'
import { convertSize } from '../../common/size_converter'

const ORANGE = '#FF8F00'
const RED = '#C62828'

const Storages = () => {
	/**
	 * @type {[import("solid-js").Accessor<import("../../api").StorageWithInfo[]>, any]}
	 */
	const [storages, setStorages] = createSignal([])
	const navigate = useNavigate()

	onMount(async () => {
		const storagesSchema = await API.storages.listStorages()
		setStorages(storagesSchema.storages)
	})

	return (
		<Box>
			{/* Header row */}
			<Box
				sx={{
					mb: 3,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				<Box>
					<Typography variant="h4" sx={{ fontWeight: 700, color: '#3a2417' }}>
						Storages
					</Typography>
					<Typography variant="body2" sx={{ color: '#8a6f45' }}>
						Manage your Telegram-backed storages
					</Typography>
				</Box>

				<Button
					onClick={() => navigate('/storages/register')}
					startIcon={<AddIcon />}
					sx={{
						py: 1.1,
						px: 2.5,
						borderRadius: '12px',
						fontWeight: 700,
						textTransform: 'none',
						color: '#fff',
						background: `linear-gradient(135deg, ${ORANGE} 0%, ${RED} 100%)`,
						boxShadow: `0 10px 22px -10px ${RED}`,
						'&:hover': {
							background: `linear-gradient(135deg, ${ORANGE} 12%, ${RED} 100%)`,
							transform: 'translateY(-1px)',
							boxShadow: `0 14px 26px -10px ${RED}`,
						},
					}}
				>
					Register new
				</Button>
			</Box>

			<TableContainer
				component={Paper}
				sx={{
					borderRadius: '18px',
					overflow: 'hidden',
					border: '1px solid rgba(198,40,40,0.10)',
					boxShadow: '0 18px 40px -24px rgba(120,60,10,0.35)',
				}}
			>
				<Table sx={{ minWidth: 650 }}>
					<Show
						when={storages().length}
						fallback={
							<TableBody>
								<TableRow>
									<TableCell sx={{ border: 0, py: 8 }}>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												color: '#a08a63',
												gap: 1,
											}}
										>
											<StorageIcon sx={{ fontSize: 48, color: '#e0b877' }} />
											<Typography sx={{ fontWeight: 600 }}>
												No storages yet
											</Typography>
											<Typography variant="body2">
												Click “Register new” to create your first storage
											</Typography>
										</Box>
									</TableCell>
								</TableRow>
							</TableBody>
						}
					>
						<TableHead>
							<TableRow sx={{ background: 'rgba(255,143,0,0.10)' }}>
								<TableCell sx={{ fontWeight: 700, color: '#5a3a1a' }}>Name</TableCell>
								<TableCell sx={{ fontWeight: 700, color: '#5a3a1a' }}>Chat ID</TableCell>
								<TableCell sx={{ fontWeight: 700, color: '#5a3a1a' }}>Size</TableCell>
								<TableCell sx={{ fontWeight: 700, color: '#5a3a1a' }}>Files</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{mapArray(storages, (storage) => (
								<TableRow
									onClick={() => navigate(`/storages/${storage.id}/files`)}
									sx={{
										cursor: 'pointer',
										transition: 'background .15s ease',
										'&:hover': { background: 'rgba(255,143,0,0.06)' },
										'&:last-child td, &:last-child th': { border: 0 },
									}}
								>
									<TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#3a2417' }}>
										{storage.name}
									</TableCell>
									<TableCell sx={{ color: '#6b5638' }}>{storage.chat_id}</TableCell>
									<TableCell sx={{ color: '#6b5638' }}>{convertSize(storage.size)}</TableCell>
									<TableCell sx={{ color: '#6b5638' }}>{storage.files_amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Show>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default Storages
