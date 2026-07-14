import { Routes, Route, Navigate } from '@solidjs/router'
import { ThemeProvider, createTheme } from '@suid/material'

import Login from './pages/Login'
import BasicLayout from './layouts/Basic'
import Storages from './pages/Storages'
import StorageCreateForm from './pages/Storages/StorageCreateForm'
import AlertStack from './components/AlertStack'
import StorageWorkers from './pages/StorageWorkers'
import StorageWorkerCreateForm from './pages/StorageWorkers/StorageWorkerCreateForm'
import Files from './pages/Files'
import UploadFileTo from './pages/Files/UploadFileTo'
import Register from './pages/Register'
import NotFound from './pages/404'

const BRAND_GRADIENT = 'linear-gradient(135deg, #FF8F00 0%, #C62828 100%)'

const theme = createTheme({
	palette: {
		primary: { main: '#C62828', contrastText: '#ffffff' },
		secondary: { main: '#FF8F00', contrastText: '#ffffff' },
		background: { default: '#f4f5f7', paper: '#ffffff' },
		text: { primary: '#1f2430', secondary: '#667085' },
		divider: '#eceef2',
	},
	shape: { borderRadius: 12 },
	typography: {
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		h1: { fontWeight: 800, letterSpacing: '-1px' },
		h4: { fontWeight: 700, letterSpacing: '-0.5px' },
		h5: { fontWeight: 700, letterSpacing: '-0.3px' },
		h6: { fontWeight: 700 },
		button: { fontWeight: 600, textTransform: 'none' },
	},
	components: {
		MuiPaper: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					border: '1px solid #edeff3',
				},
			},
		},
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: {
				root: {
					borderRadius: 10,
					textTransform: 'none',
					fontWeight: 600,
					paddingTop: 8,
					paddingBottom: 8,
				},
				containedSecondary: {
					background: BRAND_GRADIENT,
					boxShadow: '0 10px 22px -12px #C62828',
					'&:hover': {
						background: 'linear-gradient(135deg, #FF8F00 12%, #C62828 100%)',
					},
				},
				containedPrimary: {
					background: BRAND_GRADIENT,
					boxShadow: '0 10px 22px -12px #C62828',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 10,
					background: '#fff',
					'& fieldset': { borderColor: '#e2e5ea' },
					'&:hover fieldset': { borderColor: '#FF8F0088' },
					'&.Mui-focused fieldset': { borderColor: '#FF8F00', borderWidth: '2px' },
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: { fontWeight: 700, color: '#5a3a1a', background: '#faf6ee' },
				root: { borderColor: '#f0f1f4' },
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 600,
					borderColor: '#e2e5ea',
					'&.Mui-selected': {
						color: '#C62828',
						background: 'rgba(255,143,0,0.10)',
						'&:hover': { background: 'rgba(255,143,0,0.16)' },
					},
				},
			},
		},
		MuiDialog: {
			styleOverrides: { paper: { borderRadius: 16 } },
		},
	},
})

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Routes>
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />

				<Route path="/" component={BasicLayout}>
					<Route path="/" element={<Navigate href="/storages" />} />
					<Route path="/storages" component={Storages} />
					<Route path="/storages/register" component={StorageCreateForm} />
					<Route path="/storages/:id/files/*path" component={Files} />
					<Route path="/storages/:id/upload_to" component={UploadFileTo} />
					<Route path="/storage_workers" component={StorageWorkers} />
					<Route
						path="/storage_workers/register"
						component={StorageWorkerCreateForm}
					/>
					<Route path="*404" component={NotFound} />
				</Route>
			</Routes>

			<AlertStack />
		</ThemeProvider>
	)
}

export default App
