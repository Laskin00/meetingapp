import { ChangeEvent, useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  createStyles,
  Divider,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { IMeeting } from "../../../api/meetings";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import LinkIcon from "@material-ui/icons/Link";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";
import * as api from "../../../api";
import { IUser } from "../../../api";
import { useAuth } from "../../../hooks/useAuth";

interface IMeetingCardProps {
  meeting: IMeeting;
  triggerSnackbar: (message: string, error?: boolean) => void;
  handleRefetchMeetings: () => void;
}

export const cardTilt: number = 3;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      boxShadow: "0 8px 20px -8px rgba(0, 0, 0, 0.5)",
      overflowWrap: "break-word",
      borderRadius: "1rem",
      background: theme.palette.primary.dark,

      [theme.breakpoints.up("sm")]: {
        width: theme.breakpoints.width("sm"),
      },
    },
    cardWrapperShadow: {
      background: theme.palette.background.paper,
      padding: "0.5rem 0",
      marginBottom: "4rem",
      borderRadius: "2rem",
      "&:nth-child(odd)": {
        "& > div": {
          transform: `rotate(-${cardTilt}deg)`,
          "& > div": {
            transform: `rotate(${cardTilt}deg)`,
          },
        },
      },
      "&:nth-child(even)": {
        "& > div": {
          transform: `rotate(${cardTilt}deg)`,
          "& > div": {
            transform: `rotate(-${cardTilt}deg)`,
          },
        },
      },
    },
    cardWrapper: {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      padding: "4rem 6rem",
      [theme.breakpoints.down("sm")]: {
        padding: "1rem 1.5rem",
      },
      borderRadius: "2rem",
    },
    header: {
      display: "flex",
      alignItems: "center",
      background: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    description: {
      fontSize: "20px",
      color: theme.palette.text.primary,
      textAlign: "center",
    },
    dataRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      background: "transparent",
    },
    icon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1),
    },
    deleteIcon: {
      color: theme.palette.primary.main,
    },
    copyIcon: {
      color: theme.palette.text.secondary,
    },
    information: {
      fontWeight: 400,
      fontSize: "16px",
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    avatar: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      fontWeight: 500,
      fontSize: "20px",
      color: theme.palette.text.primary,
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
    commentsContainer: {
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
      background: theme.palette.primary.light,
      boxShadow: "0 8px 18px -10px rgba(0, 0, 0, 0.2)",
      "&:nth-last-child(2)": {
        marginBottom: "1rem",
      },
    },
    commentRow: {
      padding: "13px 1rem",
    },
    commentInputContainer: {
      width: "100%",
      height: "100%",
      padding: "0 0 0 1rem",
      borderRadius: "0.5rem",
      background: theme.palette.primary.light,
      boxShadow: "0 8px 18px -10px rgba(0, 0, 0, 0.2)",
      "&:nth-last-child(2)": {
        marginBottom: "1rem",
      },
    },
    commentInput: {
      padding: "0 !important",
    },
    commentContent: {
      fontWeight: 400,
      fontSize: "16px",
      color: theme.palette.text.primary,
    },
    commentAvatar: {
      width: "1.5rem",
      height: "1.5rem",
      fontSize: "12px",
      marginRight: "1rem",
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    submitComment: {
      color: theme.palette.primary.main,
    },
  })
);

export const MeetingCard = ({
  meeting,
  triggerSnackbar,
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
  const [comment, setComment] = useState<string>("");

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

  const handleCopyInvite = (link?: boolean) => {
    navigator.clipboard.writeText(
      link
        ? `http://localhost:3000/meeting/join/${meeting.inviteToken}`
        : meeting.inviteToken
    );
    triggerSnackbar(`Copied invite ${link ? "link" : "code"} to clipboard.`);
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
        triggerSnackbar("Hangout left.", true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChangeComment = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(event.currentTarget.value);
  };

  const handleSubmitComment = async () => {
    if (comment && sessionToken) {
      try {
        await api.createComment(meeting.id, sessionToken, comment);
        handleRefetchMeetings();
        setComment("");
      } catch (error) {
        console.log(error);
      }
    }
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
                  <>
                    <Tooltip arrow title="Copy invite code">
                      <IconButton
                        aria-label="copy"
                        className={classes.copyIcon}
                        onClick={() => handleCopyInvite(false)}
                      >
                        <FileCopyOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip arrow title="Copy invite link">
                      <IconButton
                        aria-label="copy-link"
                        className={classes.copyIcon}
                        onClick={() => handleCopyInvite(true)}
                      >
                        <LinkIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip arrow title="Delete hangout">
                      <IconButton
                        aria-label="delete"
                        className={classes.deleteIcon}
                        onClick={handleOpen}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </>
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
                      } this hangout?`}
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
                    View hangout participants
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

                <Divider className={classes.divider} />

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  {meeting.comments.length > 0 && (
                    <Box className={classes.commentsContainer}>
                      {meeting.comments.map((comment, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          className={classes.commentRow}
                        >
                          <Tooltip
                            arrow
                            title={
                              comment.user.firstName +
                              " " +
                              comment.user.lastName
                            }
                          >
                            <Avatar
                              variant="rounded"
                              aria-label="avatar"
                              className={classes.commentAvatar}
                            >
                              {comment.user.firstName.charAt(0)}
                            </Avatar>
                          </Tooltip>
                          <Typography
                            variant="body2"
                            className={classes.commentContent}
                          >
                            {comment.content}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  <Box className={classes.commentInputContainer}>
                    <TextField
                      multiline
                      placeholder="Comment something nice :)"
                      size="small"
                      autoComplete="off"
                      variant="standard"
                      fullWidth
                      name="comment"
                      type="string"
                      id="comment"
                      value={comment}
                      onChange={(event) => handleChangeComment(event)}
                      InputProps={{
                        disableUnderline: true,
                        className: classes.commentInput,
                        endAdornment: (
                          <IconButton
                            aria-label="copy"
                            disabled={!comment}
                            onClick={handleSubmitComment}
                            className={classes.submitComment}
                          >
                            <SendIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
};
