import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartOverlay from './CartOverlay';
import SearchOverlay from './SearchOverlay';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CartOverlay />
      <SearchOverlay />
      <main className="flex-grow main-page">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#282828',
            color: '#FEFEFE',
          },
        }}
      />
    </div>
  );
};

export default RootLayout;
