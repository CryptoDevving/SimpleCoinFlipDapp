import { withStyles } from '@material-ui/core/styles';
import { default as Tb } from '@material-ui/core/Toolbar';

export const styles = (theme) => ({
  root: {
    height: 64,
    [theme.breakpoints.up('sm')]: {
      height: 70,
    },
  },
});

const Toolbar = withStyles(styles)(Tb);
Toolbar.displayName = 'Toolbar';

export default Toolbar;
