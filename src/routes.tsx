import React from 'react';
import { createBrowserRouter } from 'react-router';
import RequireLogin from './components/login/RequireLogin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ErrorFallback from './components/common/ErrorFallback';
import Home from './pages/Home';
import { GlobalLoading } from './components/common/Loading';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));

const Events = React.lazy(() => import('./pages/Events'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const Status = React.lazy(() => import('./pages/Status'));
const Timetable = React.lazy(() => import('./pages/Timetable'));
const MyTimetable = React.lazy(() => import('./pages/MyTimetable'));
const Library = React.lazy(() => import('./pages/Library'));
const LibrarySearch = React.lazy(() => import('./pages/LibrarySearch'));
const LibraryBookmarks = React.lazy(() => import('./pages/LibraryBookmarks'));
const Transit = React.lazy(() => import('./pages/Transit'));

const Posts = React.lazy(() => import('./pages/Posts'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const Hatoboard = React.lazy(() => import('./pages/posts/Hatoboard'));

const Classroom = React.lazy(() => import('./pages/classroom/Classroom'));
const ClassroomCourse = React.lazy(
  () => import('./pages/classroom/ClassroomCourse'),
);
const ClassroomAnnouncement = React.lazy(
  () => import('./pages/classroom/ClassroomAnnouncement'),
);
const ClassroomCoursework = React.lazy(
  () => import('./pages/classroom/ClassroomCoursework'),
);
const ClassroomMaterial = React.lazy(
  () => import('./pages/classroom/ClassroomMaterial'),
);
const ClassroomBookmarks = React.lazy(
  () => import('./pages/classroom/ClassroomBookmarks'),
);
const Classmatch = React.lazy(() => import('./pages/Classmatch'));

const Settings = React.lazy(() => import('./pages/Settings'));
const SettingsTop = React.lazy(() => import('./pages/settings/Top'));
const SettingsAccount = React.lazy(() => import('./pages/settings/Account'));
const SettingsTheme = React.lazy(() => import('./pages/settings/Theme'));
const SettingsNotification = React.lazy(
  () => import('./pages/settings/Notification'),
);

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorFallback />,
    element: <Home />,
  },
  {
    path: '/login',
    errorElement: <ErrorFallback />,
    element: <Login />,
  },
  {
    path: '/',
    element: <RequireLogin />,
    errorElement: <ErrorFallback />,
    hydrateFallbackElement: <GlobalLoading />,
    children: [
      // ダッシュボード
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'status', element: <Status /> },

      // 時間割
      { path: 'timetable', element: <Timetable /> },
      { path: 'timetable/editor', element: <MyTimetable /> },

      // イベント
      { path: 'events', element: <Events /> },
      { path: 'events/:id', element: <EventDetail /> },

      // 投稿
      {
        path: 'posts',
        element: <Posts />,
        children: [{ path: 'hatoboard', element: <Hatoboard /> }],
      },
      { path: 'posts/:id', element: <PostDetail /> },

      // 図書館
      { path: 'library', element: <Library /> },
      { path: 'library/search', element: <LibrarySearch /> },
      { path: 'library/bookmarks', element: <LibraryBookmarks /> },

      // Google Classroom
      { path: 'classroom', element: <Classroom /> },
      { path: 'classroom/bookmarks', element: <ClassroomBookmarks /> },
      { path: 'classroom/course/:id', element: <ClassroomCourse /> },
      {
        path: 'classroom/course/:id/announcement/:announcementId',
        element: <ClassroomAnnouncement />,
      },
      {
        path: 'classroom/course/:id/courseWork/:courseworkId',
        element: <ClassroomCoursework />,
      },
      {
        path: 'classroom/course/:id/courseWorkMaterial/:materialId',
        element: <ClassroomMaterial />,
      },

      // クラスマッチ
      { path: 'classmatch/:year?', element: <Classmatch /> },

      // 交通
      { path: 'transit', element: <Transit /> },

      // 設定
      {
        path: 'settings',
        element: <Settings />,
        children: [
          { index: true, element: <SettingsTop /> },
          { path: 'account', element: <SettingsAccount /> },
          { path: 'theme', element: <SettingsTheme /> },
          { path: 'notification', element: <SettingsNotification /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
