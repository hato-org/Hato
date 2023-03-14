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
const Settings = React.lazy(() => import('./pages/Settings'));
const Timetable = React.lazy(() => import('./pages/Timetable'));
const Posts = React.lazy(() => import('./pages/Posts'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const Library = React.lazy(() => import('./pages/Library'));
const LibrarySearch = React.lazy(() => import('./pages/LibrarySearch'));
const LibraryBookmarks = React.lazy(() => import('./pages/LibraryBookmarks'));
const Transit = React.lazy(() => import('./pages/Transit'));
const Classroom = React.lazy(() => import('./pages/Classroom'));
const ClassroomCourse = React.lazy(() => import('./pages/ClassroomCourse'));
const ClassroomCoursework = React.lazy(
  () => import('./pages/ClassroomCoursework')
);
const ClassroomMaterial = React.lazy(() => import('./pages/ClassroomMaterial'));
const ClassroomBookmarks = React.lazy(
  () => import('./pages/ClassroomBookmarks')
);

// function Router() {
//   const user = useRecoilValue(userAtom);
//   const location = useLocation();

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={user ? <Dashboard /> : <Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<RequireLogin />}>
//           <Route path="settings" element={<Settings />}>
//             <Route index element={<Setting.Top />} />
//             <Route path="account" element={<Setting.Account />} />
//             <Route path="theme" element={<Setting.Theme />} />
//           </Route>
//           <Route path="timetable" element={<Timetable />} />
//           <Route path="events">
//             <Route index element={<Events />} />
//             <Route path=":id" element={<EventDetail />} />
//           </Route>
//           <Route path="posts" element={<Posts />}>
//             <Route index element={<PostElement.Top />} />
//             {/* <Route path="subj-news" element={<PostElement.SubjectNews />} />
//             <Route path="exam-news" element={<PostElement.ExamNews />} /> */}
//             <Route path="hatoboard" element={<PostElement.Hatoboard />} />
//           </Route>
//           <Route path="posts/:id" element={<PostDetail />} />
//         </Route>
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </AnimatePresence>
//   );
// }

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
        ],
      },
      {
        path: 'timetable',
        element: <Timetable />,
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
        path: 'classroom/course/:id/courseWork/:courseworkId',
        element: <ClassroomCoursework />,
      },
      {
        path: 'classroom/course/:id/courseWorkMaterial/:materialId',
        element: <ClassroomMaterial />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
