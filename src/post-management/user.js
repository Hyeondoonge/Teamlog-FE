import React from 'react';
import { Avatar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  user: {
    display: 'flex',
    cursor: 'pointer',
  },
  image: {
    backgroundColor: 'black',
  },
  small: {
    width: '25px',
    height: '25px',
    margin: '2px',
    border: '1px solid grey',
  },
}));

const UserImage = (props) => {
  // 차라리 이미지 용도에 따라 클래스를 선택하는 것이 나으려나...?
  const classes = useStyles();

  const { imgPath } = props;

  return <Avatar className={classes.small} src={imgPath} />;
};

const UserId = (props) => {
  const { userId, fontSize } = props;

  return (
    <Box display="inline-block" marginLeft="0.25em" fontSize={fontSize}>
      {userId}
    </Box>
  );
};

const UserInfo = (props) => {
  const classes = useStyles();
  const { userId, imgWidth, imgHeight, imgPath, fontSize } = props;
  return (
    <Box display="inline-block" className={classes.user}>
      <UserImage imgWidth={imgWidth} imgHeight={imgHeight} imgPath={imgPath} />
      <UserId userId={userId} fontSize={fontSize} />
    </Box>
  );
};

export default UserInfo;