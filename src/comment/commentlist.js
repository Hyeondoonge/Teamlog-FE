import { Box, Button, Grid, LinearProgress } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import {
  React,
  useEffect,
  useState,
  Fragment,
  useCallback,
  // useRef,
} from 'react';
import ChildCommentList from './childcommentlist';
import { Comment } from './comment';
import { GetComment } from './commentapi';
import CommentForm from './commentform';

const CommentList = ({ setCommentCounter, projectId, postId, type }) => {
  const [commentList, setCommentList] = useState([]);
  const [moreVisibility, setMoreVisibility] = useState([]);
  const [commentSize, setCommentSize] = useState(5); // 5의 배수
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRenewed, setIsRenewed] = useState(true);

  const RenewCommentList = useCallback(async (counterEvent) => {
      setIsRenewed(false);
      const response = await GetComment(postId, commentSize);
      setCommentList(response);
      setCommentCounter(counterEvent);

      if (response.last) {
        setMoreVisibility('none');
      } else {
        setMoreVisibility('block');
      }
      setIsRenewed(true);
  });

  useEffect(async () => {
    const response = await GetComment(postId, commentSize);
    setCommentList(response);
      setIsLoaded(true);
      if (response.last) {
        setMoreVisibility('none');
      }
  }, [postId, commentSize]);

  return isLoaded ?
   (
     <>
       { isRenewed ? (<></>) : (<LinearProgress />)}
       {
          commentList.content
            ? commentList.content.map((item) => {
               return (
                 <Box key={item.id}>
                   <Comment
                     id={item.id}
                     projectId={projectId}
                     contents={item.contents}
                     writer={item.writer}
                     commentMentions={item.commentMentions}
                     postId={postId}
                     writeTime={item.writeTime}
                     renewCommentList={RenewCommentList}
                     commentList={commentList}
                     type="parent"
                   />
                   <ChildCommentList
                     projectId={projectId}
                     postId={postId}
                     commentId={item.id}
                     commentList={commentList}
                   />
                 </Box>
            );
          })
        : []
        }
       <Box display={moreVisibility} style={{ padding: '15px 15px' }}>
         <span
           role="button"
           size="small"
           variant="text"
           tabIndex={0}
           style={{ fontSize: 13, cursor: 'pointer' }}
           onKeyPress={() => {
              console.log('헷^^');
            }}
           onClick={async () => {
              setCommentSize(commentSize + 5);
            }}
         >
           댓글 더 보기...
         </span>
       </Box>
       {type === 'compressed' ? (<></>) : (
         <CommentForm
           parentCommentId={null}
           projectId={projectId}
           postId={postId}
           renewCommentList={RenewCommentList}
         />
)}
     </>
  ) : (
    <>
      <Grid container direction="row" xs={12} justify="space-between" style={{ margin: '0.5em' }}>
        <Grid item container direction="row" xs={12}>
          <Grid item>
            <Skeleton animation="wave" variant="circle" width={35} height={35} />
          </Grid>
          <Grid item container direction="column" xs={2} style={{ padding: '0 1%', marginBottom: '0.5em' }}>
            <Skeleton animation="wave" height={25} width="100%" style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" height={12} width="80%" style={{ marginBottom: 1 }} />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginRight: '1em' }}>
          <Skeleton animation="wave" variant="rect" height={50} />
        </Grid>
      </Grid>
      <Grid container direction="row" xs={12} justify="space-between" style={{ margin: '0.5em' }}>
        <Grid item container direction="row" xs={12}>
          <Grid item>
            <Skeleton animation="wave" variant="circle" width={35} height={35} />
          </Grid>
          <Grid item container direction="column" xs={2} style={{ padding: '0 1%', marginBottom: '0.5em' }}>
            <Skeleton animation="wave" height={25} width="100%" style={{ marginBottom: 1 }} />
            <Skeleton animation="wave" height={12} width="80%" style={{ marginBottom: 1 }} />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginRight: '1em' }}>
          <Skeleton animation="wave" variant="rect" height={50} />
        </Grid>
      </Grid>
    </>
);
};

export default CommentList;
