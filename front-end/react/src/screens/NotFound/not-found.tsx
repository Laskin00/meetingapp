import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontWeight: 'normal',
      color: theme.palette.text.primary,
    },
  })
);

export const NotFound = () => {
  const classes = useStyles();

  return (
    <Box display='flex' justifyContent='center'>
      <Typography className={classes.heading} variant='h3'>
        Page not found
      </Typography>
    </Box>
  );
};
