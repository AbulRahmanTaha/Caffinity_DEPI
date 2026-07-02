import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './contexts/CartContext';
import { SearchProvider } from './contexts/SearchContext';
import { UserProvider } from './contexts/UserContext';
import { useEffect } from 'react';
import { migrateUsersToHaveIds } from './utils/migrateUsers';

function App() {
  useEffect(() => {
    // Run migration on app load
    migrateUsersToHaveIds();
  }, []);

  return (
    <UserProvider>
      <CartProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
