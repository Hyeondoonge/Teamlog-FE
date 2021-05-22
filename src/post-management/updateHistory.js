import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Close } from '@material-ui/icons';
import { Divider } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { UserImage, UserId } from './user';
import { DateInfo } from './datetime';

const UpdateHistory = (props) => {
  const { id, updateOpen } = props;
  const [history, setHistory] = useState(null);

  useEffect(async () => {
    try {
      const response = await fetch(`/api/posts/${id}/historys`, {
        method: 'GET',
      });
      const result = await response.json();
      result.reverse();
      setHistory(result);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <Grid container justify="flex-end">
        <Close onClick={() => { updateOpen(false); }} />
      </Grid>
      <div style={{ width: 500, minHeight: 200, maxHeight: 300 }}>
        { (() => {
          if (history) {
            if (history.length) {
              return history.map((inform, index) => (
                <>
                  <Grid container direction="row" alignItems="center">
                    <UserImage imgPath={inform.writer.profileImgPath} />
                    <UserId userId={inform.writer.id} />님이&nbsp;
                    <DateInfo dateTime={inform.writeTime} />&nbsp;글을 수정했습니다.
                  </Grid>
                  {
                    index !== history.length - 1
                    ? <Divider />
                    : null
                  }
                </>
              ));
            } return (
              <Grid container justify="center" style={{ height: 200 }} alignItems="center">
                아직 수정 내역이 없어요!
              </Grid>
            );
          } return (
              new Array(5).fill(1).map((e, index) => (
                <>
                  <Skeleton variant="rect" animation="wave" height={30} style={{ margin: '1% 0' }} />
                  {
                    index !== 4
                    ? <Divider />
                    : null
                  }
                </>
            ))
            );
        })()}
      </div>
    </>
  );
};

export default UpdateHistory;