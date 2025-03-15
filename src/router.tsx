import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage/LandingPage';
import WelcomePage from './pages/Index/WelcomePage';
import Index from './pages/Index';
import Notfound from './pages/Notfound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage navigate={(path) => router.navigate(path)} />
  },
  {
    path: '/welcome',
    element: <WelcomePage navigate={(path) => router.navigate(path)} />
  },
  {
    path: '/app',
    element: (
      <Layout>
        <Index />
      </Layout>
    ), // Main App Workflow
  },
  {
    path: '*',
    element: <Notfound />,
  },
]);

export default router;
