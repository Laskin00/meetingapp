import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Grid, Slide, Snackbar } from "@material-ui/core";
import { Form, Formik } from "formik";
import * as api from "../../api";
import Alert from "@material-ui/lab/Alert";
import { TransitionProps } from "@material-ui/core/transitions";
import { IUser } from "../../api";
import { useAuth } from "../../hooks/useAuth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: theme.palette.background.paper,
      padding: "1rem 2rem",
      borderRadius: "10px",
      boxShadow: theme.shadows[5],
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

export const SlideTransition = (props: TransitionProps) => {
  return <Slide {...props} direction="up" />;
};

export const SignUp = () => {
  const classes = useStyles();
  const [user, setUser] = useState<IUser | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    useAuth().then((res) => setUser(res.user));
  }, []);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {user?.isAdmin ? "Register Admin" : "Sign up"}
        </Typography>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          onSubmit={async (values, actions) => {
            const response =
              user && user.isAdmin
                ? await api.registerAdmin(values, user.sessionToken)
                : await api.signUp(values);

            setOpen(true);
            setError(response.error);
            setMessage(response.message);

            actions.setSubmitting(false);
          }}
        >
          {({ handleChange, isSubmitting }) => (
            <Form className={classes.form} noValidate name="signup">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                size="large"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>

              <Box textAlign="center">
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Box>

              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
              >
                <Alert
                  severity={message ? "success" : "error"}
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
