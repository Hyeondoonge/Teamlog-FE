import { useMediaQuery } from 'react-responsive';
import Carousel from 'react-material-ui-carousel';
import './carousel-theme.css';
import './carousel.css';
import RoomIcon from '@material-ui/icons/Room';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Menu, History, Delete, Edit, Close } from '@material-ui/icons';
import { Avatar, Button, Card, Chip, Grid, Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, Tooltip } from '@material-ui/core';

import { Route } from 'react-router';
import FileList from './fileList';
import CommentList from '../comment/commentlist';
import { UserImage, UserId } from './user';
import { LikerCounter, CommentCounter } from './counter';
import { Media } from './media';
import { DateInfo } from './datetime';
import MyPage from '../user/MyPage';
import { DeletePost } from './postapi';
import ResponsiveDialog from '../organisms/ResponsiveDialog';
import PostFormPage from '../pages/PostFormPage';
import UpdateHistory from './updateHistory';

/** 관계와 접근제어자를 입력받아서
 * visible 한지 반환
 */
const canAccess = (relation, modifier) => modifier === 'PUBLIC' ||
            (relation === 'MEMBER' || relation === 'MASTER');

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '5% 0',
  },
  children: {
    padding: '1%',
  },
  chip: {
    zIndex: 1,
    position: 'absolute',
    padding: '3px 12px',
    borderRadius: '500px',
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      margin: '2%',
    },
    [theme.breakpoints.up('md')]: {
      margin: '0.5%',
    },
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #eee',
  },
  header: {
    position: 'relative',
  },
  tags: {
    width: '100%',
    display: 'inline-block',
    textAlign: 'left',
  },
  menu: {
    cursor: 'pointer',
    position: 'absolute',
    right: 0,
  },
  postMenu: {
    zIndex: 3,
    position: 'absolute',
    right: -30,
  },
  media: {
    position: 'relative',
    backgroundColor: 'black',
    width: '100%',
    // '&::after': {
    //   content: '',
    //   display: 'block',
    //   paddingBottom: '100%',
    // }
    // 모바일 ver, pc ver 높이 필요할 듯
  },
  temp: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'pink',
  },
  content: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
    textAlign: 'left',
    marginLeft: '0.25em',
  },
  files: {
    marginTop: '0.5em',
    marginBottom: '0.5em',
    cursor: 'pointer',
    border: `1px solid ${theme.palette.divider}`,
    textAlign: 'left',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  etc: {
    height: '2.5em',
    marginTop: '0.25em',
    marginBottom: '0.5em',
    marginLeft: '0.25em',
    textAlign: 'left',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  span: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.6,
    },
  },
}));

const PostMenu = (props) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const anchorRef = useRef(null);
  const { content, setIsPostLoading, setFormData, initPosts,
    updateOpen, updateHistoryOpen } = props;

  const handleToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setMenuOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setMenuOpen(false);
    }
  };

  const handlePostDelete = async (event) => {
    const status = await DeletePost(content.id);
    if (status === 200) {
      setIsPostLoading(false);
      setFormData(null);
      initPosts();
    }
    setAlertOpen(false);
  };

  const prevOpen = useRef(menuOpen);
  useEffect(() => {
    if (prevOpen.current === true && menuOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={menuOpen ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Menu color="action" />
        </Button>
        <Popper
          open={menuOpen}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{ zIndex: 2 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
                zIndex: 3,
              }}
            >
              <Paper className={classes.postMenu} style={{ zIndex: 2 }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={menuOpen}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={() => {
                        if (!updateOpen) return;
                        updateOpen(true);
                      }}
                    >
                      <Edit />&nbsp;포스트 수정
                    </MenuItem>
                    <MenuItem onClick={() => { updateHistoryOpen(true); }}>
                      <History />&nbsp;수정 내역
                    </MenuItem>
                    <MenuItem onClick={() => { setAlertOpen(true); }}>
                      <Delete />&nbsp;포스트 삭제
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <Dialog
        open={alertOpen}
        onClose={() => { setAlertOpen(false); }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">포스트 삭제</DialogTitle>
        <DialogContent style={{ width: 200, textAlign: 'center' }}>
          <DialogContentText id="alert-dialog-description">
            정말로 삭제할까요?
          </DialogContentText>
        </DialogContent>
        <Grid container direction="row" justify="space-evenly">
          <Button
            onClick={handlePostDelete}
            color="primary"
            autoFocus
          >삭제
          </Button>
          <Button onClick={() => { setAlertOpen(false); }} color="primary">
            취소
          </Button>
        </Grid>
      </Dialog>
    </div>
  );
};

const MediaList = ({ media }) => {
  const classes = useStyles();

  const [curIndex, setCurIndex] = useState(1);

  const isPc = useMediaQuery({
    query: '(min-width:1024px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width:768px) and (max-width:1023px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width:767px)',
  });

  let size = null;
  if (isPc) {
    size = '60em';
  } else if (isTablet) {
    size = '45em';
  } else if (isMobile) {
    size = '30em';
  }

  return (
    <>
      <Grid container direction="row-reverse">
        <span
          className={classes.chip}
        >
          {`${curIndex}/${media.length}`}
        </span>
      </Grid>
      <Box id="mediaBox" textAlign="center">
        <Carousel
          onChange={(index) => {
            setCurIndex(index + 1);
          }}
          autoPlay={false}
          animation="slide"
          cycleNavigation={false}
          indicatorIconButtonProps={{
          }}
          activeIndicatorIconButtonProps={{
              style: {
                  color: '#C16AF5', // 2
              },
          }}
        >
          {media.map((item, i) => (
            <Box className={classes.media} height={size}>
              <Media key={i} file={item} />
            </Box>
          ))}
        </Carousel>
      </Box>
    </>
  );
};

export const Post = (props) => {
  const { content, maxWidth, setIsPostLoading, setFormData,
    initPosts, relation, updatePost } = props;

  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const classes = useStyles();
  const [likerCounter, setLikerCounter] = useState(content.likeCount);
  const [commentCounter, setCommentCounter] = useState(content.commentCount);

  const SetCommentCounter = useCallback((counterEvent) => {
    setCommentCounter(commentCounter + counterEvent);
  }); // 댓글 개수 조정

  const SetLikerCounter = useCallback((counterEvent) => {
    setLikerCounter(likerCounter + counterEvent);
  }); // 좋아요 개수 조정

  useEffect(() => {
    setCommentCounter(content.commentCount);
    setLikerCounter(content.likeCount);
  }, [content.id]);

  return (
    <>
      <Route exact path="/users/:userId" component={MyPage} />
      <Container
        className={classes.root}
        component="main"
        disableGutters
        maxWidth={maxWidth}
      >
        <Card className={classes.paper} elevation={0}>
          <Container disableGutters>
            <Box className={classes.children}>
              <Grid container className={classes.header} xs={12} direction="row">
                <Grid item xs={10}>
                  <Grid container className={classes.user} alignItems="center">
                    <Grid item>
                      <UserImage imgPath={content.writer.profileImgPath} />
                    </Grid>
                    <Grid item container direction="column" xs={2} style={{ padding: '0 1%' }}>
                      <UserId userId={content.writer.id} />
                      <DateInfo dateTime={content.writeTime} />
                    </Grid>
                  </Grid>
                </Grid>
                {
                  relation === 'MEMBER' || relation === 'MASTER'
                  ? (
                    <Grid item className={classes.menu}>
                      <PostMenu
                        content={content}
                        setIsPostLoading={setIsPostLoading}
                        setFormData={setFormData}
                        initPosts={initPosts}
                        updateOpen={setOpen}
                        updateHistoryOpen={setHistoryOpen}
                      />
                    </Grid>
                  ) : null
                }
              </Grid>
            </Box>
          </Container>
          {
            canAccess(relation, content.accessModifier) ?
            (
              <>
                <Grid className={classes.children} container alignItems="center">
                  {
                    content.address ? (
                      <Grid container alignItems="center">
                        <RoomIcon color="primary" />
                        {content.address.split('#')[0]}&nbsp;
                      </Grid>
                       ) : null
                  }
                </Grid>
                <Grid className={classes.children}>
                  <Grid container direction="row" spacing={1}>
                    {content.hashtags
                      ? content.hashtags.map((item, index) => {
                          return (
                            <Grid item>
                              <Chip
                                className="tags"
                                key={index}
                                label={`#${item}`}
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  // handleChipClick(index);
                                  // handleToggle(index);
                                }}
                                color="primary"
                              />
                            </Grid>
                          );
                        })
                      : ''}
                  </Grid>
                </Grid>
                {
                  content.files.length !== 0 && (
                    <FileList files={content.files} />
                  )
                }
                {content.media.length === 0 ? null : (
                  <Container disableGutters>
                    <MediaList media={content.media} />
                  </Container>
                )}
                <Container disableGutters>
                  <Box className={classes.content}>
                    <Typography>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{content.contents}</p>
                    </Typography>
                  </Box>
                </Container>
                <Container disableGutters>
                  <Box className={classes.etc}>
                    <LikerCounter
                      count={likerCounter}
                      setLikerCounter={SetLikerCounter}
                      postId={content.id}
                    />
                    <CommentCounter count={commentCounter} />
                  </Box>
                </Container>
                {
                  canAccess(relation, content.commentModifier) ? (
                    <Container disableGutters>
                      <CommentList
                        projectId={content.project.id}
                        postId={content.id}
                        setCommentCounter={SetCommentCounter}
                      />
                    </Container>
                  ) : (
                    <span
                      style={{
                        backgroundColor: '#F8F8F8',
                        textAlign: 'center',
                        padding: '1% 0',
                        fontSize: 'smaller' }}
                    >
                      댓글을 볼 수 있는 권한이 없습니다
                    </span>
                      )
                  }
              </>
          ) : (
            <Grid
              style={{
                backgroundColor: '#F8F8F8',
                textAlign: 'center',
                padding: '10% 0',
                }}
            >
              포스트를 볼 수 있는 권한이 없습니다
            </Grid>
            )
          }
          <Container disableGutters />
        </Card>
      </Container>
      <ResponsiveDialog open={open} updateOpen={setOpen}>
        <PostFormPage
          content={content}
          updateOpen={setOpen}
          updatePost={updatePost}
        />
      </ResponsiveDialog>
      <Dialog
        open={historyOpen}
        updateOpen={setHistoryOpen}
        onClose={() => { setHistoryOpen(false); }}
      >
        <UpdateHistory id={content.id} updateOpen={setHistoryOpen} />
      </Dialog>
    </>
  );
};

export const CompressedPost = (props) => {
  const { post } = props;
  const classes = useStyles();

  return (
    <>
      {/* 사용자 정보 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '16px',
        }}
      >
        <Avatar src={post.writer.profileImgPath} />
        <Typography>{post.writer.name}</Typography>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          margin: '16px',
        }}
      >
        <Carousel useKeyboardArrows autoPlay={false} showStatus={false} showThumbs={false}>
          {post.media.map((file) => (
            <Box key={file.fileDownloadUri} className={classes.media} height="30em">
              <Media file={file} />
            </Box>
        ))}
        </Carousel>

        {/* 날짜 */}
        <DateInfo dateTime={post.writeTime} fs="12px" />

        {/* 해쉬태그들 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {post.hashtags.map((item) => {
          return (
            <Chip
              className="tags"
              key={item}
              label={`#${item}`}
              variant="outlined"
              size="small"
              color="primary"
            />
          );
        })}
        </div>

        {/* 본문 */}
        <Typography>{post.contents}</Typography>

        {/* 첨부 파일 및 좋아요 댓글 개수 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <FileList className={classes.file} files={post.files} />
          <LikerCounter count={post.likeCount} />
          <CommentCounter count={post.commentCount} />
        </div>

        {/* 댓글 */}
        {/* <CommentList projectId={post.project.id} postId={post.id} /> */}
      </div>
    </>
  );
};
