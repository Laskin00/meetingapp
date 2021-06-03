import React, { ReactNode } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '2rem',
    },
  })
);

interface IProps {
  children: ReactNode;
}

export const Body = ({ children }: IProps) => {
  const classes = useStyles();

  return (
    <Container maxWidth='md' className={classes.container}>
      <>{children}</>
    </Container>
  );
};
