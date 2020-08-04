import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '../components/Toolbar';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AnimatedNumber from 'animated-number-react';

const styles = (theme) => ({
  toolbar: {
    justifyContent: 'space-between',
  },
  balance: {
    marginLeft: 15,
  },
});

function AppBar(props) {
  const { classes, balance } = props;

  const formatBalance = (balance) => parseFloat(balance).toFixed(4);
  console.log(balance);
  return (
    <div>
      <MuiAppBar elevation={0} position="fixed">
        <Toolbar className={classes.toolbar}>
          <Link variant="h5" underline="none" color="inherit" href="/">
            Coin Flip Dapp
          </Link>
          <Box display="flex" alignItems="center">
            {balance && <Typography variant="h6">Your Balance:</Typography>}
            {!!balance && (
              <Typography className={classes.balance} variant="h5">
                <AnimatedNumber formatValue={formatBalance} value={balance} />{' '}
                ETH
              </Typography>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

AppBar.displayName = 'AppBar';

export default withStyles(styles)(AppBar);
