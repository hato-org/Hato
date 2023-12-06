import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RequireLogin from './components/login/RequireLogin';
import Setting from './components/settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PostElement from './components/posts';
import ErrorFallback from './components/common/ErrorFallback';
import Dashboard from './pages/Dashboard';

const Events = React.lazy(() => import('./pages/Events'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const Home = React.lazy(() => import('./pages/Home'));
const Status = React.lazy(() => import('./pages/Status'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Timetable = React.lazy(() => import('./pages/Timetable'));
const MyTimetable = React.lazy(() => import('./pages/MyTimetable'));
const Posts = React.lazy(() => import('./pages/Posts'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const Library = React.lazy(() => import('./pages/Library'));
const LibrarySearch = React.lazy(() => import('./pages/LibrarySearch'));
const LibraryBookmarks = React.lazy(() => import('./pages/LibraryBookmarks'));
const Transit = React.lazy(() => import('./pages/Transit'));
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
const Classmatch2023 = React.lazy(
  () => import('./pages/classmatch/Classmatch2023'),
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
    children: [
      {
        path: 'dashboard',
        errorElement: <ErrorFallback />,
        element: <Dashboard />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Setting.Top />,
          },
          {
            path: 'account',
            element: <Setting.Account />,
          },
          {
            path: 'theme',
            element: <Setting.Theme />,
          },
          {
            path: 'notification',
            element: <Setting.Notification />,
          },
        ],
      },
      {
        path: 'status',
        element: <Status />,
      },
      {
        path: 'timetable',
        element: <Timetable />,
      },
      {
        path: 'timetable/editor',
        element: <MyTimetable />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'events/:id',
        element: <EventDetail />,
      },
      {
        path: 'posts',
        element: <Posts />,
        children: [
          {
            path: 'hatoboard',
            element: <PostElement.Hatoboard />,
          },
        ],
      },
      {
        path: 'posts/:id',
        element: <PostDetail />,
      },
      {
        path: 'library',
        element: <Library />,
        // children: [
        //   {
        //     index: true,
        //     element: <LibraryElement.Top />
        //   },
        //   {
        //     path: 'search',
        //     element: <LibraryElement.Search />
        //   }
        // ]
      },
      {
        path: 'library/search',
        element: <LibrarySearch />,
      },
      {
        path: 'library/bookmarks',
        element: <LibraryBookmarks />,
      },
      {
        path: 'transit',
        element: <Transit />,
      },
      {
        path: 'classroom',
        element: <Classroom />,
      },
      {
        path: 'classroom/bookmarks',
        element: <ClassroomBookmarks />,
      },
      {
        path: 'classroom/course/:id',
        element: <ClassroomCourse />,
      },
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
      {
        path: 'classmatch/2023',
        element: <Classmatch2023 />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
