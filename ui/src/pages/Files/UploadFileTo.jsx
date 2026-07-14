import Box from '@suid/material/Box'
import Paper from '@suid/material/Paper'
import Button from '@suid/material/Button'
import TextField from '@suid/material/TextField'
import Typography from '@suid/material/Typography'
import { useNavigate, useParams } from '@solidjs/router'
import { createSignal } from 'solid-js'
import ChevronLeftIcon from '@suid/icons-material/ChevronLeft'

import API from '../../api'
import { alertStore } from '../../components/AlertStack'
import UploadProgress from '../../components/UploadProgress'

const ORANGE = '#FF8F00'
const RED = '#C62828'

const UploadFileTo = () => {
	const { addAlert } = alertStore
	const navigate = useNavigate()
	const params = useParams()
	const [upload, setUpload] = createSignal(null)

	const navigateToFiles = () => {
		navigate(`/storages/${params.id}/files`)
	}

	/**
	 *
	 * @param {SubmitEvent} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault()

		const data = new FormData(event.currentTarget)

		const path = data.get('path')
		const file = data.get('file')

		setUpload({ name: file?.name || path, pct: 0, processing: false })
		try {
			await API.files.uploadFileTo(params.id, path, file, (pct) =>
				setUpload((u) => (u ? { ...u, pct, processing: pct >= 100 } : u))
			)
			addAlert(`Uploaded file to "${path}"`, 'success')
			navigateToFiles()
		} finally {
			setUpload(null)
		}
	}

	return (
		<Box sx={{ maxWidth: 480, mx: 'auto' }}>
			<Button
				onClick={navigateToFiles}
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
				<Typography variant="h5" sx={{ fontWeight: 700, color: '#3a2417' }}>
					Upload file to
				</Typography>
				<Typography variant="body2" sx={{ color: '#8a6f45', mb: 3 }}>
					Upload a file to a specific path in this storage
				</Typography>

				<TextField
					id="path"
					name="path"
					label="Path"
					variant="outlined"
					fullWidth
					required
					sx={{ mb: 2.5 }}
				/>
				<TextField
					id="file"
					name="file"
					label="File"
					type="file"
					variant="outlined"
					InputLabelProps={{ shrink: true }}
					fullWidth
					required
					sx={{ mb: 3 }}
				/>

				<Button
					type="submit"
					fullWidth
					disabled={Boolean(upload())}
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
						'&.Mui-disabled': { color: '#fff', opacity: 0.7 },
					}}
				>
					{upload() ? 'Uploading…' : 'Upload'}
				</Button>
			</Paper>

			<UploadProgress info={upload()} />
		</Box>
	)
}

export default UploadFileTo
