import { A } from '@solidjs/router'
import ListItem from '@suid/material/ListItem'
import ListItemButton from '@suid/material/ListItemButton'
import ListItemIcon from '@suid/material/ListItemIcon'
import ListItemText from '@suid/material/ListItemText'
import { children } from 'solid-js'

/**
 * @typedef {Object} SideBarItemProps
 * @property {string} text
 * @property {boolean} isFull
 * @property {string} link
 * @property {import("solid-js").JSXElement[]} children
 */

/**
 *
 * @param {SideBarItemProps} props
 */
const SideBarItem = (props) => {
	const c = children(() => props.children)

	return (
		<ListItem key={props.text} disablePadding sx={{ display: 'block' }}>
			<A href={props.link} class="sidebar-link">
				<ListItemButton
					sx={{
						minHeight: 46,
						justifyContent: props.isFull ? 'initial' : 'center',
						px: 2,
					}}
				>
					<ListItemIcon
						sx={{
							minWidth: 0,
							mr: props.isFull ? 2.5 : 'auto',
							justifyContent: 'center',
							color: 'inherit',
						}}
					>
						{c()}
					</ListItemIcon>
					<ListItemText
						primary={props.text}
						primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
						sx={{ display: props.isFull ? 'border-box' : 'none' }}
					/>
				</ListItemButton>
			</A>
		</ListItem>
	)
}

export default SideBarItem
