import React, { Fragment, useState } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from './AppBar';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

export const styles = (theme) => ({
  betInput: {
    width: 195,
  },
});

function App(props) {
  const { randomFxn, potentialWinnings, accountBalance, classes } = props;
  const [flippping, setFlipping] = useState(false);
  const [didWin, setDidWin] = useState(null);
  const [betPlaced, setBetPlaced] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function onClickFlip() {
    const betPlacedNum = parseFloat(betPlaced);
    if (typeof betPlacedNum !== 'number' || isNaN(betPlacedNum)) {
      setErrorMsg('Enter a numeric value');
    } else if (betPlacedNum <= 0) {
      setErrorMsg('Bet must be non-zero');
    } else if (betPlacedNum > potentialWinnings) {
      setErrorMsg('Bet cannot be larger than jackpot');
    } else if (betPlacedNum > accountBalance) {
      setErrorMsg('Bet cannot exceed your balance');
    } else {
      setErrorMsg('');
      setFlipping(true);
      setDidWin(null);
      setDidWin(!!(await randomFxn()));
      setFlipping(false);
    }
  }

  function onBetPlacedChange(e) {
    setBetPlaced(e.target.value);
  }

  return (
    <Fragment>
      <AppBar balance={accountBalance} />
      <Container>
        <Box display="flex" alignItems="center" flexDirection="column" pt={15}>
          <Box textAlign="center" height={150} mb={10}>
            {flippping && didWin === null && (
              <CircularProgress size={120} color="secondary" />
            )}
            {!flippping && didWin === null && (
              <Box
                color="primary.main"
                display="flex"
                alignItems="center"
                flexDirection="column"
              >
                <Typography variant="h4">Current Max. Jackpot</Typography>
                <Box color="secondary.main">
                  <Typography variant="h2">{potentialWinnings} ETH</Typography>
                </Box>
              </Box>
            )}
            {didWin === false && (
              <Box color="success.main">
                <Typography variant="h1">You Won!</Typography>
              </Box>
            )}
            {didWin === true && (
              <Box color="error.main">
                <Typography variant="h1">Sorry, You Lost.</Typography>
              </Box>
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <TextField
              onChange={onBetPlacedChange}
              value={betPlaced}
              autoFocus
              label="Your Bet (ETH)"
              type="number"
              error={!!errorMsg}
              helperText={errorMsg}
              className={classes.betInput}
            />
            <Box mr={2} />
            <Button
              onClick={onClickFlip}
              color="primary"
              size="large"
              variant="contained"
              disabled={flippping}
            >
              {flippping
                ? 'Good Luck!'
                : didWin === null
                ? 'Flip Coin'
                : 'Try Again!'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}

export default withStyles(styles)(App);
