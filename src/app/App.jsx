import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { initializeDefaultAccounts } from './utils/auth';

export default function App() {
  useEffect(() => {
    initializeDefaultAccounts();
  }, []);

  return <RouterProvider router={router} />;
}
