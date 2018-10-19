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
        reqTabIndex: 0,
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
                params: {},
                body: {}
            };
            localStorage.setItem(storageKey, JSON.stringify(config));
        }

        this.setState({
            ...config,
            response: {},
            reqTabIndex: 0,
            resTabIndex: 0,
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
            <div style={{ display: 'flex', height: '100%', paddingTop: 64 }}>
                <div style={{ padding: '24px 0', paddingRight: 24, width: '50%', height: '100%', flex: '1 0 auto', }}>
                    <Paper style={{ position: 'relative' }}>
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
                            <br /><br />
                            <Paper>
                                <Tabs
                                    value={this.state.reqTabIndex}
                                    onChange={(e, i) => this.setState({ reqTabIndex: i })}
                                    indicatorColor="secondary"
                                    textColor="secondary"
                                    fullWidth>
                                    <Tab label={`Query Parameter (${Object.keys(params).length})`} />
                                    <Tab label={`Body (${Object.keys(body).length})`} disabled={verb !== 'POST' && verb !== 'PUT'} />
                                    <Tab label={`Placeholder (${Object.keys(placeholders).length})`} disabled={Object.keys(placeholders).length === 0} />
                                </Tabs>
                                <SwipeableViews
                                    axis="x"
                                    index={this.state.reqTabIndex}
                                    onChangeIndex={(i) => this.setState({ reqTabIndex: i })}>
                                    <div>
                                        <ReactJson
                                            name="params"
                                            style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                            onAdd={this.onUpdateParams.bind(this)}
                                            onEdit={this.onUpdateParams.bind(this)}
                                            onDelete={this.onUpdateParams.bind(this)}
                                            src={params} />
                                    </div>
                                    <div>
                                        <ReactJson
                                            name="body"
                                            style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                            onAdd={this.onUpdateBody.bind(this)}
                                            onEdit={this.onUpdateBody.bind(this)}
                                            onDelete={this.onUpdateBody.bind(this)}
                                            src={body} />
                                    </div>
                                    <div>
                                        <ReactJson
                                            name="placeholder"
                                            style={{ padding: 10, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                                            onEdit={this.onUpdatePlaceholder.bind(this)}
                                            src={placeholders} />
                                    </div>
                                </SwipeableViews>
                            </Paper>
                            <br />
                            <pre style={{ overflowY: 'hidden', backgroundColor: '#ddd', padding: 5, borderRadius: 4, color: '#333' }}>{this.getUrl()}</pre>
                            <br />
                            <Button onClick={this.hit.bind(this)} variant="contained" size="large" style={{ backgroundColor: '#2980b9', color: '#ffffff' }} className={classes.button}>
                                <CompareArrowsIcon /> &nbsp;Hit!
                        </Button>&nbsp;
                        <Button variant="contained" size="large" style={{ backgroundColor: '#2ecc71', color: '#ffffff' }} className={classes.button}>
                                <CodeIcon /> &nbsp;Kode
                        </Button>
                        </div>
                    </Paper>
                </div>
                <div style={{ width: '50%', height: '100%', padding: '24px 0', flex: '1 0 auto', }}>
                    <Paper className={classes.contain} style={{ overflowX: 'hidden', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" component="h3">
                            Response {Object.keys(response).length > 0 && <span style={{ fontWeight: 'bold', float: 'right', color: '#ffffff', fontSize: 14, padding: 5, borderRadius: 5, backgroundColor: (response.status >= 200 && response.status < 400) ? '#2ecc71' : ((response.status >= 400 && response.status < 500) ? '#e67e22' : '#e74c3c') }}>{response.status} - {response.statusText}</span>}
                        </Typography><br />
                        <Divider /><br />
                        {loading && <LinearProgress />}
                        {(Object.keys(response).length === 0 && !loading) && (
                            <div>
                                <Typography variant="h6" gutterBottom>
                                    Belum ada hasil
                            </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Hit endpoint untuk memulai request dan melihat hasil
                            </Typography>
                            </div>)
                        }
                        {(Object.keys(response).length > 0 && !loading) && (
                            <Paper>
                                <Tabs
                                    value={this.state.resTabIndex}
                                    onChange={(e, i) => this.setState({ resTabIndex: i })}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    fullWidth>
                                    <Tab label={`Body (${Object.keys(response.data).length})`} />
                                    <Tab label={`Headers (${Object.keys(response.headers).length})`} />
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
                        )}
                    </Paper>
                </div>
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