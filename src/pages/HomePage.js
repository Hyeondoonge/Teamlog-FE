import { Divider } from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../contexts/auth';

// 1. 프로젝트 2. 게시물 (3. 댓글)
// 태스크
// 초대장, 팔로워

// 내가 속한 프로젝트의 (최신 태스크) 가능 fetch(`api/projects/{projectid}/tasks`); - 완료🔥
// (나에게로 온 초대장) 가능 fetch(`/api/users/project-invitation`); - 완료🔥
// (나의 새로운 팔로워) X: 팔로워리스트 받을때 팔로우한 시간도 받을수있어야함
// 내가 속한 프로젝트의 (새로운 게시물) 가능 fetch(`/api/projects/user/${userId}`); - 완료🔥
// 내가 팔로우하는 프로젝트의 (새로운 게시물) 가능 fetch(`/api/users/${userId}/following-projects`); - 완료🔥
// 내가 팔로우하는 사람이 작성한 (새로운 게시물) X: userId로 포스트 받아오는것 있어야함

//
// 지도로 탐험하기 버튼 -> MapPage로 이동

//
// 최신, 인기?
export default function HomePage() {
  const [userId] = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [invitations, setInvitations] = useState(null);
  const [belongingProjects, setBelongingProjects] = useState(null);
  const [followingProjects, setFollowingProjects] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(null);
  const [taskWrappers, setTaskWrappers] = useState([]);
  const tasksCounter = useRef(0);
  const [belongingPosts, setBelongingPosts] = useState([]);
  const belongingPostsCounter = useRef(0);
  const [followingPosts, setFollowingPosts] = useState([]);
  const followingPostsCounter = useRef(0);

  useEffect(() => {
    // 초대장
    fetch('/api/users/project-invitation')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setInvitations(res);
      });

    // 속한 프로젝트
    fetch(`/api/projects/user/${userId}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setBelongingProjects(res);
      });

    // 팔로우 프로젝트
    fetch(`/api/users/${userId}/following-projects`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setFollowingProjects(res);
      });

    // 나의 팔로워
    fetch(`/api/users/${userId}/following`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setFollowingUsers(res);
      });
  }, []);

  useEffect(() => {
    if (!belongingProjects) {
      return;
    }

    // 테스크
    // 프로젝트 단위로 받는데,
    // 최신 (5일 이내? 기준시간값을 변경하기 쉽게 구현하세요)측에 속하는 것만 가지고 나머지는 날린다. (이러고 남은게 없으면 패스~)
    // 정렬 후 포장해서 저장한다. wrapper.isTask = true
    belongingProjects.forEach(({ id }) => {
      fetch(`/api/projects/${id}/tasks`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          const filteredTasks = res; // TODO: 최신 항목 분리

          if (filteredTasks.length > 0) {
            filteredTasks.sort(); // TODO: 최신 순 정렬
            const taskWrapper = { type: 'TASK', tasks: filteredTasks, projectId: id, wrapperTime: filteredTasks[0].updateTime }; // TODO: 기준시각 속성 변경
            setTaskWrappers((prev) => [...prev, taskWrapper]);
          }
          tasksCounter.current += 1;
        });
    });

    // 게시물
    // 프로젝트 단위로 받는데, 딱히 구분하진 않는다.
    // 최신 측에 속하는 것만 가지고 나머지는 날린다.
    // 상태변수에 추가한다. (정렬은 나중에 한번에)
    belongingProjects.forEach(({ id }) => {
      fetch(`/api/posts/project/${id}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setBelongingPosts((prev) => [...prev, ...res.content]);
          belongingPostsCounter.current += 1;
        });
    });
  }, [belongingProjects]);

  useEffect(() => {
    if (!followingProjects) {
      return;
    }

    // 게시물
    // 프로젝트 단위로 받는데, 딱히 구분하진 않는다.
    // 최신 측에 속하는 것만 가지고 나머지는 날린다.
    // 상태변수에 추가한다. (정렬은 나중에 한번에)
    followingProjects.forEach(({ id }) => {
      fetch(`/api/posts/project/${id}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setFollowingPosts((prev) => [...prev, ...res.content]);
          followingPostsCounter.current += 1;
        });
    });
  }, [followingProjects]);

  useEffect(() => {
    if (
      invitations === null ||
      belongingProjects === null ||
      tasksCounter.current !== belongingProjects.length ||
      belongingPostsCounter.current !== belongingProjects.length ||
      followingProjects === null ||
      followingPostsCounter.current !== followingProjects.length
    ) {
      return;
    }

    console.log(invitations);

    //

    console.log(taskWrappers);
    console.log(belongingPosts);
    console.log(followingPosts);

    // 여기서 포스트 및 태스크 요소의 정렬이 필요함. 중복 포스트도 날려야함

    setIsLoaded(true);
  }, [invitations, taskWrappers, belongingPosts, followingPosts]);

  // == render ========
  if (!isLoaded) {
    return <h1>환영합니다, 최신 뉴스 피드를 준비하는 중입니다!</h1>;
  }

  return (
    <>
      <h1>최신 뉴스 피드</h1>
      <Divider />
      <h1>내가 받은 프로젝트 초대장</h1>
      {invitations.map((unit) => (
        <div key={unit.id}>{unit.projectName}</div>
      ))}
      <Divider />
      {/* <h1>내가 속한 프로젝트의 최근 테스크 업데이트 소식</h1>
      {tasks.map((task) => (
        <div key={task.id}>{task.taskName}</div>
      ))} */}
      <Divider />
      <h1>내가 속한 프로젝트의 최근 게시물 업데이트 소식</h1>
      {belongingPosts.map((post) => (
        <div key={post.id}>{post.contents}</div>
      ))}
      <Divider />
      <h1>내가 팔로우하는 프로젝트의 최근 게시물 업데이트 소식</h1>
      {followingPosts.map((post) => (
        <div key={post.id}>{post.contents}</div>
      ))}
      <Divider />
    </>
  );
}
