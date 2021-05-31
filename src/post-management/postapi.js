export const DeletePost = async (id) => {
    const status = await fetch(
        `/api/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.status);
      return status;
};

// 게시물 수정 알림
export const UpdatePostNotification = async (userId, projectId, postId) => {
  const project = await fetch(`/api/projects/${projectId}`)
  .then((res) => res.json());

  console.log(project);

  const res = await fetch('/pusher/push-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project,
      postId,
      source: userId,
      type: 'update_post',
    }),
  });
};
