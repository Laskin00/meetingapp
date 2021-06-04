import {
  Box,
  Button,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Snackbar,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { IMeeting } from "../../api/meetings";
import { MeetingCard } from "../../components/generic/meeting-card/meeting-card";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as api from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { Form, Formik } from "formik";
import { Alert } from "@material-ui/lab";
import { SlideTransition } from "../SignUp/sign-up";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontWeight: 600,
      fontSize: "32px",
      textTransform: "uppercase",
      letterSpacing: "3px",
      color: theme.palette.text.primary,
    },
    iconBtn: {
      margin: theme.spacing(2),
      fontSize: "48px",
      color: theme.palette.primary.main,
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    wrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
      width: theme.breakpoints.width("md"),
      borderRadius: "8px",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(6, 8),
      margin: theme.spacing(2),

      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2, 4),
      },
    },
    paperContainer: {
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
    },
    paper: {
      width: "50%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(2, 4, 3),
      border: `1px solid ${theme.palette.text.disabled}`,
      borderRadius: "5px",
      "&:last-child": {
        marginLeft: "2rem",
      },

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        padding: theme.spacing(1, 3, 2),
        "&:last-child": {
          marginLeft: "0",
          marginTop: "2rem",
        },
      },
    },
    content: {
      margin: theme.spacing(2, 0),
      color: theme.palette.text.secondary,
    },
    title: {
      fontSize: "2rem",
      fontWeight: 900,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: theme.palette.primary.main,
      marginBottom: theme.spacing(6),

      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(2),
      },
    },
    gridItem: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

export const HomePage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [meetingCode, setMeetingCode] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const fetchMeetings = async (sessionToken: string) => {
    const meetingsResponse = await api.getUserMeetings(sessionToken);

    meetingsResponse && setMeetings(meetingsResponse);
  };

  useEffect(() => {
    const awaitAuthentication = async () => {
      const { user } = await useAuth();

      setSessionToken(user.sessionToken);
      fetchMeetings(user.sessionToken);
      setIsLoading(false);
    };

    awaitAuthentication();
  }, []);

  const handleRefetchMeetings = () => {
    sessionToken && fetchMeetings(sessionToken);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenSnackbar(false);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleChangeMeetingCode = (event: any) => {
    setMeetingCode(event.target.value);
  };

  const handleJoinMeeting = async () => {
    if (meetingCode && sessionToken) {
      const response = await api.joinMeeting(meetingCode, sessionToken);

      if (response.message) {
        setMessage(response.message);
        setError(undefined);
        setMeetingCode("");

        fetchMeetings(sessionToken);
      } else {
        setMessage(undefined);
        setError("Failed to join hangout.");
      }
      setOpenSnackbar(true);
    }
  };

  const handleTriggerSnackbar = (message: string, error?: boolean) => {
    error ? setError(message) : setMessage(message);
    setOpenSnackbar(true);
  };

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" className={classes.heading}>
            Your hangouts
          </Typography>

          <IconButton
            aria-label="settings"
            onClick={handleOpen}
            className={classes.iconBtn}
          >
            <AddCircleIcon fontSize="inherit" />
          </IconButton>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.wrapper}>
                <Typography variant="h4" className={classes.title}>
                  Lets hang out!
                </Typography>

                <Box
                  display="flex"
                  width="100%"
                  className={classes.paperContainer}
                >
                  <Grid container spacing={2} className={classes.paper}>
                    <Grid item xs={12} className={classes.gridItem}>
                      <Typography variant="h5">CREATE</Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                      <Typography variant="body1" className={classes.content}>
                        Create your own hangout.
                      </Typography>
                    </Grid>

                    <Formik
                      initialValues={{
                        description: "",
                        location: "",
                        date: "",
                        time: "",
                      }}
                      onSubmit={async (values, actions) => {
                        if (values && sessionToken) {
                          try {
                            const response = await api.createMeeting({
                              sessionToken,
                              ...values,
                            });

                            const inviteTokenResponse =
                              await api.getMeetingInviteToken(
                                response.meetingUuid
                              );

                            setMessage(
                              `Success! Hangout invite code is: ${inviteTokenResponse.inviteToken}`
                            );
                            setOpenSnackbar(true);

                            fetchMeetings(sessionToken);
                          } catch (error) {
                            setError("Failed to create hangout.");
                            setOpenSnackbar(true);
                          }
                        }

                        actions.setSubmitting(false);
                      }}
                    >
                      {({ handleChange, isSubmitting }) => (
                        <Grid item xs={12} className={classes.gridItem}>
                          <Form noValidate name="createMeeting">
                            <Grid container spacing={2}>
                              <Grid item xs={12} className={classes.gridItem}>
                                <TextField
                                  multiline
                                  autoComplete="off"
                                  variant="outlined"
                                  fullWidth
                                  name="description"
                                  label="Hangout Description"
                                  type="string"
                                  id="description"
                                  onChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12} className={classes.gridItem}>
                                <TextField
                                  autoComplete="off"
                                  variant="outlined"
                                  fullWidth
                                  name="location"
                                  label="Hangout Location"
                                  type="string"
                                  id="location"
                                  onChange={handleChange}
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <TextField
                                  autoComplete="off"
                                  variant="outlined"
                                  fullWidth
                                  name="date"
                                  label="Hangout Date (YYYY-MM-DD)"
                                  type="string"
                                  id="date"
                                  onChange={handleChange}
                                />
                              </Grid>

                              <Grid
                                item
                                xs={6}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <TextField
                                  autoComplete="off"
                                  variant="outlined"
                                  fullWidth
                                  name="time"
                                  label="Hangout Time (HH:MM:SS)"
                                  type="string"
                                  id="time"
                                  onChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12} className={classes.gridItem}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="secondary"
                                  disableElevation
                                  fullWidth
                                  size="large"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "Creating hangout..."
                                    : "Create hangout"}
                                </Button>
                              </Grid>
                            </Grid>
                          </Form>
                        </Grid>
                      )}
                    </Formik>
                  </Grid>
                  <Grid container spacing={2} className={classes.paper}>
                    <Grid item xs={12} className={classes.gridItem}>
                      <Typography variant="h5">JOIN</Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.gridItem}>
                      <Typography variant="body1" className={classes.content}>
                        Join a hangout using a special invite code.
                      </Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.gridItem}>
                      <TextField
                        autoComplete="off"
                        variant="outlined"
                        fullWidth
                        name="meetingCode"
                        label="Hangout Code"
                        type="string"
                        id="meetingCode"
                        value={meetingCode}
                        onChange={handleChangeMeetingCode}
                      />
                    </Grid>

                    <Grid item xs={12} className={classes.gridItem}>
                      <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        fullWidth
                        size="large"
                        onClick={handleJoinMeeting}
                      >
                        Join hangout
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </Fade>
          </Modal>

          {meetings.length > 0 && (
            <Box>
              {meetings.map((meeting: IMeeting, index) => (
                <MeetingCard
                  key={index}
                  meeting={meeting}
                  handleRefetchMeetings={handleRefetchMeetings}
                  triggerSnackbar={handleTriggerSnackbar}
                />
              ))}
            </Box>
          )}

          <Snackbar
            open={openSnackbar}
            onClose={handleCloseSnackbar}
            TransitionComponent={SlideTransition}
            autoHideDuration={3000}
          >
            <Alert
              severity={message ? "success" : "error"}
              onClose={handleClose}
            >
              {message || error}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
};
