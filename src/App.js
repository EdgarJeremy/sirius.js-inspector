import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Composer from './components/Composer';

const drawerWidth = 300;

const styles = theme => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		backgroundColor: '#3498db',
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing.unit * 7,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing.unit * 9,
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		height: '100vh',
		overflow: 'auto',
		backgroundColor: '#ecf0f1'
	},
	chartContainer: {
		marginLeft: -22,
	},
	tableContainer: {
		height: 320,
	},
	h5: {
		marginBottom: theme.spacing.unit * 2,
	},
	nested: {
		paddingLeft: theme.spacing.unit * 4,
		fontSize: 12
	},
	chipget: {
		color: '#ffffff',
		backgroundColor: '#3498db'
	},
	chippost: {
		color: '#ffffff',
		backgroundColor: '#34495e'
	},
	chipput: {
		color: '#ffffff',
		backgroundColor: '#2ecc71'
	},
	chipdelete: {
		color: '#ffffff',
		backgroundColor: '#e74c3c'
	}
});

class App extends React.Component {
	state = {
		open: true,
		expandTarget: null,
		routes: [],
		models: [],
		endpoint: '',
		basepoint: '',
		verb: ''
	};

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false, expandTarget: null });
	};

	componentDidMount() {
		// TODO : Use dynamic URL
		let url = window.location.origin;
		fetch(`http://localhost:8080/app_meta`).then((res) => res.json()).then((data) => {
			let { routes, models } = data;
			this.setState({ routes, models });
		});
	}

	render() {
		const { classes } = this.props;

		return (
			<React.Fragment>
				<CssBaseline />
				<div className={classes.root}>
					<AppBar
						position="absolute"
						className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
						<Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
							<IconButton
								color="inherit"
								aria-label="Open drawer"
								onClick={this.handleDrawerOpen}
								className={classNames(
									classes.menuButton,
									this.state.open && classes.menuButtonHidden,
								)}>
								<MenuIcon />
							</IconButton>
							<Typography
								component="h1"
								variant="h6"
								color="inherit"
								noWrap
								className={classes.title}>
								Sirius.js Inspector
              </Typography>
							{/* <IconButton color="inherit">
								<Badge badgeContent={4} color="secondary">
									<NotificationsIcon />
								</Badge>
							</IconButton> */}
						</Toolbar>
					</AppBar>
					<Drawer
						variant="permanent"
						classes={{
							paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
						}}
						open={this.state.open}>
						<div className={classes.toolbarIcon}>
							<IconButton onClick={this.handleDrawerClose}>
								<ChevronLeftIcon />
							</IconButton>
						</div>
						<Divider />
						<List
							component="nav"
							subheader={this.state.open && <ListSubheader component="div">Route Resource</ListSubheader>}>
							{(this.state.routes).map((route, i) => (
								<div key={i}>
									<ListItem button selected={this.state.expandTarget === i} onClick={() => this.setState({ expandTarget: this.state.expandTarget === i ? null : i, open: true })}>
										<ListItemIcon>
											{this.state.expandTarget === i ? <FolderOpenIcon /> : <FolderIcon />}
										</ListItemIcon>
										<ListItemText primary={route.basepoint} secondary="basepoint" />
									</ListItem>
									{route.endpoints.length &&
										<Collapse in={this.state.expandTarget === i} timeout="auto" unmountOnExit>
											<List component="div" disablePadding>
												{route.endpoints.map((endpoint, z) => (
													<ListItem button className={classes.nested} key={z} onClick={() => {
														this.setState({
															endpoint: endpoint.endpoint,
															basepoint: route.basepoint,
															verb: endpoint.verbs
														});
													}}>
														<Chip label={endpoint.verbs} style={{ fontSize: 10, padding: 0, height: 25, width: 50, borderRadius: 3 }} className={classes[`chip${endpoint.verbs.toLowerCase()}`]} />
														<ListItemText primaryTypographyProps={{ style: { fontSize: 11 } }} primary={endpoint.endpoint} secondary="endpoint" />
													</ListItem>
												))}
											</List>
										</Collapse>
									}
								</div>
							))}

						</List>
						<Divider />
						<List
							component="nav"
							subheader={this.state.open && <ListSubheader component="div">Model Resource</ListSubheader>}>
							{(this.state.models.map((model, i) => (
								<ListItem key={i} button>
									<ListItemIcon>
										<AssignmentIcon />
									</ListItemIcon>
									<ListItemText primary={model.name} />
								</ListItem>
							)))}
						</List>
					</Drawer>
					<main className={classes.content}>
						<div className={classes.appBarSpacer} />

						<Composer basepoint={this.state.basepoint} endpoint={this.state.endpoint} verb={this.state.verb} />

					</main>
				</div>
			</React.Fragment>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);