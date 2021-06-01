import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Form, Formik } from 'formik';
import { Grid, Snackbar } from '@material-ui/core';
import { SlideTransition } from '../SignUp/sign-up';
import { Alert } from '@material-ui/lab';
import * as api from '../../api';
import { setSessionCookie } from '../../session';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: theme.palette.background.paper,
      padding: '1rem 2rem',
      borderRadius: '10px',
      boxShadow: theme.shadows[5],
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

export const SignIn = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message] = useState<string | undefined>(undefined);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Container component='main' maxWidth='sm'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={async (values, actions) => {
            const res = await api.signIn(values);

            res.id && setSessionCookie(res.id);

            if (res.sessionToken) {
              window.location.reload();
            } else {
              setError('Sign in failed.');
              setOpen(true);
            }

            actions.setSubmitting(false);
          }}
        >
          {({ handleChange, isSubmitting }) => (
            <Form className={classes.form} noValidate name='signin'>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                type='submit'
                size='large'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box textAlign='center'>
                <Link href='/signup' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>

              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
              >
                <Alert
                  severity={message ? 'success' : 'error'}
                  onClose={handleClose}
                >
                  {message || error}
                </Alert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};
