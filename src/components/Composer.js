import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import CodeIcon from '@material-ui/icons/Code';
import LinkIcon from '@material-ui/icons/Link';
import ReactJson from 'react-json-view';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { baseURL } from '../modules/config';
import R from '../modules/requests';

const styles = theme => ({
    contain: {
        padding: 20
    },
    fullUrl: {
        fontFamily: 'monospace',
        fontSize: 14
    }
});

class Composer extends React.Component {
    state = {
        params: {},
        body: {},
        placeholders: {},
        url: baseURL,
        storageKey: '',
        resTabIndex: 0,
        loading: false,
        response: {}
    }

    componentDidMount() {
        this.initData(this.props);
    }

    componentWillReceiveProps(p) {
        this.initData(p);
    }

    initData(p) {
        const { placeholders, verb, basepoint, endpoint } = p;
        let storageKey = verb.toLowerCase() + basepoint + endpoint;
        let config = JSON.parse(localStorage.getItem(storageKey));

        if (!config) {
            config = {
                placeholders: placeholders,
                params: verb === 'GET' ? {
                    attributes: 'id',
                    filter: '',
                    order: '\\created_at',
                    limit: 20,
                    offset: 0
                } : {},
                body: {}
            };
            localStorage.setItem(storageKey, JSON.stringify(config));
        }

        this.setState({
            ...config,
            response: {},
            storageKey
        });
    }

    onUpdatePlaceholder(e) {
        const { storageKey } = this.state;
        const config = JSON.parse(localStorage.getItem(storageKey));
        config.placeholders = e.updated_src;
        localStorage.setItem(storageKey, JSON.stringify(config));
        this.setState({ placeholders: e.updated_src });
    }

    onUpdateParams(e) {
        const { storageKey } = this.state;
        const config = JSON.parse(localStorage.getItem(storageKey));
        config.params = e.updated_src;
        localStorage.setItem(storageKey, JSON.stringify(config));
        this.setState({ params: e.updated_src });
    }

    onUpdateBody(e) {
        const { storageKey } = this.state;
        const config = JSON.parse(localStorage.getItem(storageKey));
        config.body = e.updated_src;
        localStorage.setItem(storageKey, JSON.stringify(config));
        this.setState({ body: e.updated_src });
    }

    getUrl() {
        const { basepoint, endpoint } = this.props;
        const { params, placeholders, url } = this.state;
        let pure = url + basepoint + endpoint;
        // Placeholder
        Object.keys(placeholders).forEach((placeholder) => {
            pure = pure.replace(`:${placeholder}`, placeholders[placeholder]);
        });
        // Params - QueryString
        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        pure += queryString.length > 0 ? `?${queryString}` : '';
        return pure;
    }

    hit() {
        const { body } = this.state;
        const { verb: method } = this.props;
        const url = this.getUrl();
        this.setState({ loading: true }, () => {
            R({
                url, method, body,
                onSuccess: (r) => {
                    this.setState({ loading: false, response: r });
                },
                onError: (e) => {
                    this.setState({ loading: false, response: e.response });
                }
            });
        });
    }

    render() {
        const { classes, basepoint, endpoint, verb } = this.props;
        const { params, body, placeholders, loading, response } = this.state;
        return (
            <div>
                <Paper>
                    {loading && <LinearProgress />}
                    <div className={classes.contain}>
                        <Typography variant="h5" component="h3">
                            Request
                        </Typography><br />
                        <Divider /><br />
                        <Typography style={{ fontSize: 15, color: '#bdc3c7', marginBottom: 5 }} variant="h6" component="p">
                            Route
                        </Typography>
                        <TextField
                            fullWidth
                            id="outlined-simple-start-adornment"
                            className={classNames(classes.margin, classes.textField)}
                            variant="outlined"
                            color="#3498db"
                            value={basepoint + endpoint}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{verb}</InputAdornment>,
                            }}
                        />
                        {Object.keys(placeholders).length > 0 && (
                            <div>
                                <Typography style={{ fontSize: 15, color: '#bdc3c7', marginTop: 5, marginBottom: 5 }} variant="h6" component="p">
                                    Placeholder
                                </Typography>
                                <ReactJson
                                    name="placeholder"
                                    theme="flat"
                                    style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                    onEdit={this.onUpdatePlaceholder.bind(this)}
                                    src={placeholders} />
                            </div>
                        )}
                        <Typography style={{ fontSize: 15, color: '#bdc3c7', marginTop: 5, marginBottom: 5 }} variant="h6" component="p">
                            Query Parameter
                        </Typography>
                        <ReactJson
                            name="params"
                            theme="flat"
                            style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                            onAdd={this.onUpdateParams.bind(this)}
                            onEdit={this.onUpdateParams.bind(this)}
                            onDelete={this.onUpdateParams.bind(this)}
                            src={params} />
                        {(verb === 'POST' || verb === 'PUT') && (
                            <div>
                                <Typography style={{ fontSize: 15, color: '#bdc3c7', marginTop: 5, marginBottom: 5 }} variant="h6" component="p">
                                    Request Body
                                </Typography>
                                <ReactJson
                                    name="body"
                                    theme="flat"
                                    style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                    onAdd={this.onUpdateBody.bind(this)}
                                    onEdit={this.onUpdateBody.bind(this)}
                                    onDelete={this.onUpdateBody.bind(this)}
                                    src={body} />
                            </div>
                        )}
                        <Typography style={{ fontSize: 15, color: '#bdc3c7', marginTop: 5, marginBottom: 5 }} variant="h6" component="p">
                            Hasil URL
                        </Typography>
                        <Chip
                            icon={<LinkIcon />}
                            label={this.getUrl()}
                            className={classes.fullUrl}
                            color="primary"
                            variant="outlined"
                            clickable
                        />
                        <br /><br />
                        <Button onClick={this.hit.bind(this)} variant="contained" size="large" style={{ backgroundColor: '#2980b9', color: '#ffffff' }} className={classes.button}>
                            <CompareArrowsIcon /> &nbsp;Hit!
                        </Button>&nbsp;
                        <Button variant="contained" size="large" style={{ backgroundColor: '#2ecc71', color: '#ffffff' }} className={classes.button}>
                            <CodeIcon /> &nbsp;Kode
                        </Button>
                    </div>
                </Paper>
                <br />
                <Paper>
                    <div className={classes.contain}>
                        <Typography variant="h5" component="h3">
                            Response - {response.status} {response.statusText}
                        </Typography><br />
                        <Divider /><br />
                        <div className={classes.root}>
                            <Paper>
                                <Tabs
                                    value={this.state.resTabIndex}
                                    onChange={(e, i) => this.setState({ resTabIndex: i })}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    fullWidth>
                                    <Tab label="Body" />
                                    <Tab label="Headers" />
                                </Tabs>
                                <SwipeableViews
                                    axis="x"
                                    index={this.state.resTabIndex}
                                    onChangeIndex={(i) => this.setState({ resTabIndex: i })}>
                                    <div>
                                        <ReactJson
                                            name="body"
                                            collapsed={1}
                                            style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                            src={response.data} />
                                    </div>
                                    <div>
                                        <ReactJson
                                            name="headers"
                                            style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                            src={response.headers} />
                                    </div>
                                </SwipeableViews>
                            </Paper>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}

Composer.propTypes = {
    classes: PropTypes.object.isRequired,
    basepoint: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    verb: PropTypes.string.isRequired,
    placeholders: PropTypes.object.isRequired
};
export default withStyles(styles)(Composer);