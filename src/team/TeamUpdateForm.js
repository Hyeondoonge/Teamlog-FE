import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Divider,
    makeStyles,
    TextField,
    Typography,
  } from '@material-ui/core';
  import { ArrowLeft, Lock, LockOpen } from '@material-ui/icons';
  import React, { useContext, useEffect, useState } from 'react';
  import { useHistory } from 'react-router';
  import AuthContext from '../contexts/auth';

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

  export default function TeamUpdateForm({ updateOpen, team }) {
    const classes = useStyles();

    const [name, setName] = useState(team.name);
    const [introduction, setIntroduction] = useState(team.introduction);
    const [isPrivate, setIsPrivate] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
      if (team.accessModifier === 'PUBLIC') {
        setIsPrivate(false);
      } else {
        setIsPrivate(true);
      }
    }, []);

    const history = useHistory();

    const [id] = useContext(AuthContext);

    if (!id) {
      history.push('/');
      return null;
    }

    const request = () => {
      const data = {
        name,
        introduction,
        accessModifier: isPrivate ? 'PRIVATE' : 'PUBLIC',
        masterId: id,
      };

      return fetch(`/api/teams/${team.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-type': 'application/json' },
      });
    };

    const onClickUpdate = () => {
      if (isProcessing) {
        return;
      }
      setIsProcessing(true);

      request()
        .then((res) => {
          console.log(res.status);
          if (res.status >= 200 && res.status < 300) {
            res.json().then((teamItem) => {
              setIsProcessing(false);
              updateOpen(false);
              window.location.replace(`/teams/${team.id}/teammanagement`);
              // history.push(`/teams/${teamItem.id}`);
            });
          } else if (res.status === 400) {
            res.json().then((response) => {
              setIsProcessing(false);
              alert(response.message);
            });
          }
        })
        .catch(() => {
          setIsProcessing(false);
        });
    };

    return (
      <div
        style={{
          margin: 'auto',
          minWidth: '20em',
          maxWidth: '480px',
          padding: '1rem',
          // textAlign: 'center',
        }}
      >
        <Backdrop open={isProcessing} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box />
        <Divider />
        <div style={{ height: '1rem' }} />

        <Typography variant="h5" align="center">
          팀 수정
        </Typography>
        <div style={{ height: '0.5rem' }} />

        <Divider />
        <div style={{ height: '1rem' }} />

        <Typography color="textSecondary">
          팀명
        </Typography>
        <TextField
          size="large"
          fullWidth
          variant="outlined"
          autoFocus
          placeholder=""
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <div style={{ height: '1rem' }} />

        <Typography color="textSecondary">
          간단한 소개
        </Typography>
        <TextField
          multiline
          fullWidth
          rows={3}
          variant="outlined"
          placeholder="소개를 작성하세요"
          value={introduction}
          onChange={(event) => {
            setIntroduction(event.target.value);
          }}
        />
        <div style={{ height: '1rem' }} />

        <Typography color="textSecondary">
          공개 설정
        </Typography>
        <div style={{ display: 'flex' }}>
          <Button
            size="small"
            color={isPrivate ? 'default' : 'primary'}
            variant="outlined"
            // variant={isPrivate ? 'outlined' : 'contained'}
            disableElevation
            startIcon={<LockOpen />}
            onClick={() => {
              setIsPrivate(false);
            }}
            style={{ width: '100%', marginRight: '1rem' }}
          >
            전체 공개
          </Button>
          <Button
            size="small"
            color={!isPrivate ? 'default' : 'primary'}
            variant="outlined"
            // variant={!isPrivate ? 'outlined' : 'contained'}
            disableElevation
            startIcon={<Lock />}
            onClick={() => {
              setIsPrivate(true);
            }}
            style={{ width: '100%' }}
          >
            비공개
          </Button>
        </div>
        <div style={{ height: '1rem' }} />

        <Divider />
        <div style={{ height: '1rem' }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Button
            style={{ paddingRight: '1rem' }}
            onClick={() => {
              updateOpen(false);
              // history.goBack();
            }}
          >
            <ArrowLeft />
            나가기
          </Button>
          <Button
            color="primary"
            variant="contained"
            disableElevation
            style={{ fontSize: '1.0rem' }}
            onClick={onClickUpdate}
            size="small"
          >
            수정하기
          </Button>
        </div>
        <Box />
      </div>
    );
  }
