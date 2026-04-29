import { Outlet } from 'react-router';
import Header from './components/Header';
import { Toaster } from './components/ui/sonner';

export function Root() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}
