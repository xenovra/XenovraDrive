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
import SmartToyIcon from '@suid/icons-material/SmartToyOutlined'
import { Show, createSignal, mapArray, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'

import API from '../../api'

const ORANGE = '#FF8F00'
const RED = '#C62828'

const mask = (token) =>
	typeof token === 'string' && token.length > 12
		? `${token.slice(0, 6)}…${token.slice(-4)}`
		: token

const StorageWorkers = () => {
	/**
	 * @type {[import("solid-js").Accessor<import("../../api").StorageWorker[]>, any]}
	 */
	const [storageWorkers, setStorageWorkers] = createSignal([])
	const navigate = useNavigate()

	onMount(async () => {
		const storageWorkers = await API.storageWorkers.listStorageWorkers()
		setStorageWorkers(storageWorkers)
	})

	return (
		<Box>
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
						Storage Workers
					</Typography>
					<Typography variant="body2" sx={{ color: '#8a6f45' }}>
						Telegram bots that upload and serve your files
					</Typography>
				</Box>

				<Button
					onClick={() => navigate('/storage_workers/register')}
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
					boxShadow: '0 18px 40px -24px rgba(120,60,10,0.35)',
				}}
			>
				<Table sx={{ minWidth: 650 }}>
					<Show
						when={storageWorkers().length}
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
											<SmartToyIcon sx={{ fontSize: 48, color: '#e0b877' }} />
											<Typography sx={{ fontWeight: 600 }}>
												No storage workers yet
											</Typography>
											<Typography variant="body2">
												Register a Telegram bot to start storing files
											</Typography>
										</Box>
									</TableCell>
								</TableRow>
							</TableBody>
						}
					>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Storage</TableCell>
								<TableCell>Token</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{mapArray(storageWorkers, (sw) => (
								<TableRow
									sx={{
										transition: 'background .15s ease',
										'&:hover': { background: 'rgba(255,143,0,0.06)' },
										'&:last-child td, &:last-child th': { border: 0 },
									}}
								>
									<TableCell
										component="th"
										scope="row"
										sx={{ fontWeight: 600, color: '#3a2417' }}
									>
										{sw.name}
									</TableCell>
									<TableCell sx={{ color: '#6b5638' }}>{sw.storage_id}</TableCell>
									<TableCell
										sx={{
											color: '#6b5638',
											fontFamily: 'monospace',
											fontSize: '0.85rem',
										}}
									>
										{mask(sw.token)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Show>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default StorageWorkers
