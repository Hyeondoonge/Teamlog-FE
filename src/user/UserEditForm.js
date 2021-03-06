import {
  Grid,
  Badge,
  Popover,
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Avatar,
  Backdrop,
  CircularProgress,
  List,
  ListItem,
  Divider,
  Container,
  makeStyles,
  Button,
  TextField,
  withStyles,
  Box,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImageResize from 'image-resize';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { updateUser, getUser, validateLogin } from './userService';
import AuthContext from '../contexts/auth';
import { resizeImage, convertResourceUrl } from '../utils';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  input: {
    display: 'none',
  },
  bold: {
    background: 'black',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 30,
    height: 30,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const UserEditForm = ({ match }) => {
  const [___, __, _, setContextProfileImgPath] = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    profileImgPath: '',
    introduction: '',
  });
  const [name, setName] = useState();
  const [introduction, setIntroduction] = useState();
  const [defaultImage, setDefaultImage] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(anchorEl);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetName = (value) => {
    if (value.length <= 12) {
      setName(value);
    }
  };

  const handleSetIntroduction = (value) => {
    if (value.length <= 100) {
      setIntroduction(value);
    }
  };

  const handleUpload = (event) => {
    setAnchorEl(null);
    if (event.target.files[0].size > 5242880) {
      alert('???????????? 5Mb ???????????? ???????????????.');
      return;
    }
    setProfileImg(event.target.files[0]);
    setDefaultImage(false);
  };

  const rollbackImage = () => {
    setAnchorEl(null);
    setProfileImg(null);
    setDefaultImage(false);
  };

  const resetImage = () => {
    setAnchorEl(null);
    setProfileImg(null);
    setDefaultImage(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (name.length === 0) {
      setIsLoading(false);
      alert('?????? 1?????? ?????? ??????????????????.');
      return;
    }
    const data = {
      name,
      introduction,
      defaultImage,
    };
    formData.append(
      'key',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );

    try {
      if (profileImg) {
        const tempURL = URL.createObjectURL(profileImg);
        const resizedImage = await resizeImage(profileImg, tempURL);
        formData.append('profileImg', resizedImage);
      }
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      const response = await updateUser(formData);
      if (response.status === 200) {
        history.push(`/users/${match.params.userId}`);
        let res = await validateLogin();
        res = await res.json();
        setContextProfileImgPath(res.profileImgPath);
      } else if (response.status === 400) {
        const res = await response.json();
        alert(res.message);
      }
    } catch (err) {
      setIsLoading(false);
      alert(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      let userInfo;
      try {
        const response = await getUser(match.params.userId);
        userInfo = await response.json();
      } catch (err) {
        alert(err);
        setIsLoaded(false);
      }
      setUser(userInfo);
      setName(userInfo.name);
      setIntroduction(userInfo.introduction);
      if (userInfo.profileImgPath === null) setDefaultImage(true);
      setIsLoaded(true);
    })();
  }, []);

  if (!isLoaded) {
    return <div />;
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Popover
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          <input
            accept="image/*"
            className={classes.input}
            type="file"
            id="file"
            onChange={handleUpload}
          />
          <>
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
          </>
          <label htmlFor="file">
            <ListItem button>????????? ?????? ??????</ListItem>
          </label>
          <Divider />
          {(profileImg || defaultImage) && user.profileImgPath !== null ? (
            <>
              <ListItem button onClick={rollbackImage}>
                ?????? ???????????? ??????
              </ListItem>
            </>
          ) : null}
          {!defaultImage ? (
            <>
              <Divider />
              <ListItem button onClick={resetImage}>
                ?????? ???????????? ??????
              </ListItem>
            </>
          ) : null}
        </List>
      </Popover>
      <Container component="main" maxWidth="xs">
        <Grid container spacing={2}>
          <Grid item xs={12} align="center">
            <IconButton onClick={handleClick}>
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={(
                  <SmallAvatar>
                    <PhotoCamera />
                  </SmallAvatar>
                )}
              >
                {profileImg ? (
                  <Avatar
                    className={classes.large}
                    src={URL.createObjectURL(profileImg)}
                  />
                ) : (
                  <>
                    {defaultImage ? (
                      <Avatar className={classes.large} />
                    ) : (
                      <Avatar
                        className={classes.large}
                        src={convertResourceUrl(user.profileImgPath)}
                      />
                    )}
                  </>
                )}
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={12} align="center">
            <TextField
              id="name"
              label="??????"
              name="name"
              defaultValue={name}
              value={name}
              onChange={(event) => handleSetName(event.target.value)}
            />
            <Box display="flex" justifyContent="center">
              <Box>
                <Typography color="primary" variant="caption">
                  {name.length}/12
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} align="center">
            <TextField
              fullWidth
              variant="outlined"
              id="introduction"
              name="introduction"
              label="??????"
              multiline
              rows={5}
              defaultValue={introduction}
              value={introduction}
              onChange={(event) => handleSetIntroduction(event.target.value)}
            />
            <Box display="flex" justifyContent="center">
              <Box>
                <Typography color="primary" variant="caption">
                  {introduction === null ? 0 : introduction.length}/100
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} spacing={2} align="center">
            <Box
              display="flex"
              flexWrap="wrap"
              gridGap="8px"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                ??????
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setAlertOpen(true)}
              >
                ??????
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ width: 230, textAlign: 'start' }}>
          <DialogContentText id="alert-dialog-description">
            ??????????????? ???????????? ????????????.
            <br />
            ?????????????????????????
          </DialogContentText>
        </DialogContent>
        <Grid container direction="row" justify="space-evenly">
          <Button onClick={() => history.goBack()} color="primary" autoFocus>
            ??????
          </Button>
          <Button
            onClick={() => {
              setAlertOpen(false);
            }}
          >
            ??????
          </Button>
        </Grid>
      </Dialog>
    </>
  );
};

export default UserEditForm;
