import React, { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  createStyles,
  Divider,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  ownerDocument,
  Theme,
  Typography,
} from "@material-ui/core";
import { IMeeting } from "../../../api/meetings";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as api from "../../../api";
import { IUser } from "../../../api";
import { useAuth } from "../../../hooks/useAuth";

interface IMeetingCardProps {
  meeting: IMeeting;
  handleRefetchMeetings: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      boxShadow: "0 8px 20px -8px rgba(0, 0, 0, 0.25)",
      overflowWrap: "break-word",
      borderRadius: "1rem",

      [theme.breakpoints.up("sm")]: {
        width: theme.breakpoints.width("sm"),
      },
    },
    cardWrapperShadow: {
      background: theme.palette.grey[200],
      padding: "0.5rem 0",
      marginBottom: "4rem",
      borderRadius: "2rem",
      "&:nth-child(odd)": {
        "& > div": {
          transform: "rotate(-2deg)",
          "& > div": {
            transform: "rotate(2deg)",
          },
        },
      },
      "&:nth-child(even)": {
        "& > div": {
          transform: "rotate(2deg)",
          "& > div": {
            transform: "rotate(-2deg)",
          },
        },
      },
    },
    cardWrapper: {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      padding: "4rem 6rem",
      borderRadius: "2rem",
    },
    header: {
      display: "flex",
      alignItems: "center",
      background: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    description: {
      fontSize: "20px",
      color: theme.palette.text.primary,
    },
    dataRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    icon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1),
    },
    deleteIcon: {
      color: theme.palette.error.main,
    },
    information: {
      fontSize: "16px",
      fontWeight: 400,
      color: theme.palette.text.secondary,
    },
    avatar: {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      fontSize: "20px",
      fontWeight: 500,
      color: theme.palette.primary.contrastText,
    },
    subheader: {
      fontWeight: 400,
      color: theme.palette.primary.main,
    },
    action: {
      marginTop: "0",
    },
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    cardActions: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    userContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    usersContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
      width: theme.breakpoints.width("sm"),
      borderRadius: "8px",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(6, 8),
      margin: theme.spacing(4),
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
  })
);

export const MeetingCard = ({
  meeting,
  handleRefetchMeetings,
}: IMeetingCardProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser>();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [meetingOwner, setMeetingOwner] = useState<IUser>();
  const [meetingUsers, setMeetingUsers] = useState<IUser[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const fetchMeetingUsers = async () => {
    const owner = await api.getMeetingOwner(meeting.id);
    const users = await api.getMeetingUsers(meeting.id);

    owner && setMeetingOwner(owner);
    users && setMeetingUsers(users);
  };

  useEffect(() => {
    const awaitAuthentication = async () => {
      const { user } = await useAuth();

      setCurrentUser(user);
      setSessionToken(user.sessionToken);
      fetchMeetingUsers();
      setIsLoading(false);
    };

    awaitAuthentication();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLeaveMeeting = async () => {
    if (currentUser && sessionToken && meetingOwner) {
      try {
        if (meetingOwner.id === currentUser.id) {
          await api.deleteMeeting(meeting.id, sessionToken);
        } else {
          await api.leaveMeeting(meeting.id, sessionToken);
        }

        handleClose();
        handleRefetchMeetings();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {!isLoading && (
        <Box className={classes.cardWrapperShadow}>
          <Box className={classes.cardWrapper}>
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    className={classes.avatar}
                    variant="rounded"
                  >
                    {meetingOwner && meetingOwner.firstName.charAt(0)}
                  </Avatar>
                }
                action={
                  <IconButton
                    aria-label="settings"
                    className={classes.deleteIcon}
                    onClick={handleOpen}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                }
                title={
                  meetingOwner &&
                  meetingOwner.firstName + " " + meetingOwner.lastName
                }
                subheader="Hangout creator"
                className={classes.header}
                classes={{
                  title: classes.title,
                  subheader: classes.subheader,
                  action: classes.action,
                }}
              />

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
                    <Typography
                      variant="h4"
                      align="center"
                      className={classes.modalTitle}
                    >
                      {`Are you sure you want to ${
                        meetingOwner &&
                        currentUser &&
                        meetingOwner.id === currentUser.id
                          ? "delete"
                          : "leave"
                      } this meeting?`}
                    </Typography>

                    <Grid container spacing={4} style={{ marginTop: "1rem" }}>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          color="default"
                          disableElevation
                          fullWidth
                          size="large"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>

                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          disableElevation
                          fullWidth
                          size="large"
                          onClick={handleLeaveMeeting}
                        >
                          Confirm
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              </Modal>

              <CardContent>
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.description}
                >
                  {meeting.description}
                </Typography>

                <Divider className={classes.divider} />

                <Grid container spacing={2}>
                  <Grid item xs={4} className={classes.dataRow}>
                    <LocationOnIcon className={classes.icon} />
                    <Typography variant="body2" className={classes.information}>
                      {meeting.location}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} className={classes.dataRow}>
                    <EventIcon className={classes.icon} />
                    <Typography variant="body2" className={classes.information}>
                      {meeting.date}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} className={classes.dataRow}>
                    <AccessTimeIcon className={classes.icon} />
                    <Typography variant="body2" className={classes.information}>
                      {meeting.time}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider className={classes.divider} />

                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography className={classes.information} variant="body1">
                    View meeting participants
                  </Typography>
                  <IconButton
                    className={`${classes.expand} ${
                      expanded && classes.expandOpen
                    }`}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </CardContent>

              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    className={classes.usersContainer}
                  >
                    {meetingUsers.map((user: IUser, index) => (
                      <Grid
                        item
                        xs={3}
                        key={index}
                        className={classes.userContainer}
                      >
                        <Avatar
                          aria-label="recipe"
                          variant="rounded"
                          className={classes.avatar}
                        >
                          {user.firstName.charAt(0)}
                        </Avatar>
                        <Typography
                          style={{ marginTop: "0.5rem" }}
                          className={classes.information}
                          variant="body1"
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
};
