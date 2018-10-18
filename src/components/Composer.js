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
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import CodeIcon from '@material-ui/icons/Code';
import ReactJson from 'react-json-view';

const styles = theme => ({
    contain: {
        padding: 20
    }
});

class Composer extends React.Component {
    state = {
        params: {},
        body: {}
    }
    render() {
        const { classes, basepoint, endpoint, verb } = this.props;
        const { params, body } = this.state;
        return (
            <div>
                <Paper>
                    <div className={classes.contain}>
                        <Typography variant="h5" component="h3">
                            Request
                        </Typography><br />
                        <Divider /><br />
                        <TextField
                            fullWidth
                            id="outlined-simple-start-adornment"
                            className={classNames(classes.margin, classes.textField)}
                            variant="outlined"
                            label="URL"
                            color="#3498db"
                            value={basepoint + endpoint}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{verb}</InputAdornment>,
                            }}
                        />
                        <ReactJson
                            theme="flat"
                            style={{ padding: 20, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                            name="Query Parameters"
                            onAdd={(e) => this.setState({ params: e.updated_src })}
                            onEdit={(e) => this.setState({ params: e.updated_src })}
                            onDelete={(e) => this.setState({ params: e.updated_src })}
                            src={params} />
                        {(verb === 'POST' || verb === 'PUT') && <ReactJson
                            theme="flat"
                            style={{ padding: 20, borderRadius: 5, marginTop: 5, marginBottom: 5 }}
                            name="Request Body"
                            onAdd={(e) => this.setState({ body: e.updated_src })}
                            onEdit={(e) => this.setState({ body: e.updated_src })}
                            onDelete={(e) => this.setState({ body: e.updated_src })}
                            src={body} />}
                        <Button variant="raised" size="large" style={{ backgroundColor: '#2980b9', color: '#ffffff' }} className={classes.button}>
                            <CompareArrowsIcon /> &nbsp;Hit!
                        </Button>&nbsp;
                        <Button variant="raised" size="large" style={{ backgroundColor: '#2ecc71', color: '#ffffff' }} className={classes.button}>
                            <CodeIcon /> &nbsp;Kode
                        </Button>
                    </div>
                </Paper>
            </div>
        )
    }
}

Composer.propTypes = {
    classes: PropTypes.object.isRequired,
    endpoint: PropTypes.string.isRequired,
    verb: PropTypes.string.isRequired
};
export default withStyles(styles)(Composer);