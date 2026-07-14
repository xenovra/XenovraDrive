import Paper from '@suid/material/Paper'
import Box from '@suid/material/Box'
import Typography from '@suid/material/Typography'
import LinearProgress from '@suid/material/LinearProgress'
import CloudUploadOutlinedIcon from '@suid/icons-material/CloudUploadOutlined'
import { Show } from 'solid-js'

/**
 * Fixed bottom-right upload progress card.
 *
 * @param {{ info: { name: string, pct: number, processing: boolean } | null }} props
 */
const UploadProgress = (props) => {
	return (
		<Show when={props.info}>
			<Paper
				sx={{
					position: 'fixed',
					right: 24,
					bottom: 24,
					width: 340,
					maxWidth: 'calc(100vw - 48px)',
					p: 2,
					borderRadius: '16px',
					zIndex: 1400,
					boxShadow: '0 22px 50px -20px rgba(120,60,10,0.45)',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
					<Box
						sx={{
							width: 38,
							height: 38,
							borderRadius: '11px',
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'linear-gradient(135deg, #FF8F00 0%, #C62828 100%)',
						}}
					>
						<CloudUploadOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />
					</Box>
					<Box sx={{ minWidth: 0, flexGrow: 1 }}>
						<Typography
							noWrap
							sx={{ fontWeight: 600, color: '#3a2417', fontSize: '0.9rem' }}
						>
							{props.info.name}
						</Typography>
						<Typography variant="caption" sx={{ color: '#a08a63' }}>
							{props.info.processing
								? 'Uploading to Telegram…'
								: 'Uploading…'}
						</Typography>
					</Box>
					<Typography
						sx={{
							fontWeight: 700,
							color: '#C62828',
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{props.info.processing ? '…' : `${props.info.pct}%`}
					</Typography>
				</Box>

				<LinearProgress
					variant={props.info.processing ? 'indeterminate' : 'determinate'}
					value={props.info.pct}
					sx={{
						height: 8,
						borderRadius: 6,
						backgroundColor: 'rgba(255,143,0,0.16)',
						'& .MuiLinearProgress-bar': {
							borderRadius: 6,
							background: 'linear-gradient(90deg, #FF8F00 0%, #C62828 100%)',
						},
					}}
				/>
			</Paper>
		</Show>
	)
}

export default UploadProgress
