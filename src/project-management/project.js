import { React } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './header';
import ProjectMain from './projectmain';
import PostMain from './postmain';
import MemberTab from './MemberTab';
import TaskContainer from '../task/TaskContainer';

export default function Project() {
  const sections = [
    { title: '홈', url: '', component: ProjectMain },
    { title: '포스트', url: '/post', component: PostMain },
    { title: '태스크', url: '/task', component: TaskContainer },
    { title: '멤버', url: '/member', component: MemberTab },
    { title: '팔로워', url: '/follower' },
  ];

  return (
    <>
      <Header sections={sections} />

      <Switch>
        {sections.map((section, index) => (
          <Route
            key={index}
            exact
            path={`/projects/:id${section.url}`}
            component={section.component}
          />
        ))}
      </Switch>
    </>
  );
}
