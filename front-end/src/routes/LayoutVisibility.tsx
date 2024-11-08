import Footer from '@/features/public-pages/layouts/footer/Footer';
import Header from '@/features/public-pages/layouts/header/Header';
import { useLocation } from 'react-router-dom';

interface LayoutVisibilityProps {
  children: React.ReactNode;
}

const LayoutVisibility: React.FC<LayoutVisibilityProps> = ({ children }) => {
  const location = useLocation();

  // @TODO: refactor
  const hideHeaderPaths: string[] = [
    '/login',
    '/register',
    '/verify-email',
    '/dashboard',
    '/payment/success',
  ];
  const hideFooterPaths: string[] = [
    '/login',
    '/register',
    '/verify-email',
    '/dashboard',
    '/payment/success',
  ];

  const showHeader = !hideHeaderPaths.some((it) =>
    location.pathname.includes(it),
  );
  const showFooter = !hideFooterPaths.some((it) =>
    location.pathname.includes(it),
  );

  return (
    <>
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default LayoutVisibility;
