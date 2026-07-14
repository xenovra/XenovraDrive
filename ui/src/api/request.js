import { alertStore } from '../components/AlertStack'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

/**
 * @typedef {'get' | 'post' | 'patch' | 'delete'} Method
 */

/**
 *
 * @param {string} path
 * @param {Method} method
 * @param {string | null | undefined} auth_token
 * @param {any} body
 * @param {boolean} return_response
 * @returns
 */
const apiRequest = async (
	path,
	method,
	auth_token,
	body,
	return_response = false
) => {
	const { addAlert } = alertStore

	const fullpath = `${API_BASE}${path}`

	const headers = new Headers()
	headers.append('Content-Type', 'application/json')
	if (auth_token) {
		headers.append('Authorization', auth_token)
	}

	try {
		const response = await fetch(fullpath, {
			method,
			body: JSON.stringify(body),
			headers,
		})

		if (!response.ok) {
			throw new Error(await response.text())
		}

		if (return_response) {
			return response
		}

		try {
			return await response.json()
		} catch {}
	} catch (err) {
		addAlert(err.message, 'error')

		throw err
	}
}

/**
 *
 * @param {string} path
 * @param {string | null | undefined} auth_token
 * @param {FormData} form
 * @returns
 */
export const apiMultipartRequest = async (path, auth_token, form) => {
	const { addAlert } = alertStore

	const fullpath = `${API_BASE}${path}`

	const headers = new Headers()
	// headers.append("Content-Type", "multipart/form-data");
	if (auth_token) {
		headers.append('Authorization', auth_token)
	}

	try {
		const response = await fetch(fullpath, {
			method: 'post',
			body: form,
			headers,
		})

		if (!response.ok) {
			throw new Error(await response.text())
		}

		try {
			return await response.json()
		} catch {}
	} catch (err) {
		addAlert(err.message, 'error')

		throw err
	}
}

/**
 * Multipart upload with live progress via XMLHttpRequest (fetch can't report
 * upload progress). `onProgress` is called with an integer percentage 0..100
 * of the browser -> server transfer. After it reaches 100 the server still
 * forwards the file to Telegram, so callers may show a "processing" state until
 * the returned promise resolves.
 *
 * @param {string} path
 * @param {string | null | undefined} auth_token
 * @param {FormData} form
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<any>}
 */
export const apiMultipartUploadWithProgress = (
	path,
	auth_token,
	form,
	onProgress
) => {
	const { addAlert } = alertStore
	const fullpath = `${API_BASE}${path}`

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', fullpath)
		if (auth_token) {
			xhr.setRequestHeader('Authorization', auth_token)
		}

		xhr.upload.addEventListener('progress', (e) => {
			if (e.lengthComputable && onProgress) {
				onProgress(Math.round((e.loaded / e.total) * 100))
			}
		})
		xhr.upload.addEventListener('load', () => {
			if (onProgress) onProgress(100)
		})

		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					resolve(JSON.parse(xhr.responseText))
				} catch {
					resolve(undefined)
				}
			} else {
				const msg = xhr.responseText || `Upload failed (${xhr.status})`
				addAlert(msg, 'error')
				reject(new Error(msg))
			}
		})
		xhr.addEventListener('error', () => {
			addAlert('Upload failed', 'error')
			reject(new Error('Upload failed'))
		})

		xhr.send(form)
	})
}

export default apiRequest
