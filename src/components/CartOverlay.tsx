import { useCart } from '../contexts/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartOverlay = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-brand-gray">
              <h2 className="font-heading text-2xl">My Bag</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="h-6 w-6" /></button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <p className="text-brand-black/70">Your bag is empty.</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex gap-4">
                      <img src={item.image!} alt={item.name} className="w-24 h-24 object-cover bg-brand-gray-light rounded-md" />
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm leading-tight">{item.name}</h3>
                          <p className="text-sm font-semibold mt-1">{`${item.currency} ${item.price.toFixed(2)}`}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-brand-gray rounded-lg">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5"><Minus size={16} /></button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5"><Plus size={16} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} className="text-xs uppercase tracking-wider text-brand-red bg-brand-red/15 hover:opacity-60 transition rounded-xl p-2 shadow-sm shadow-brand-gray-dark/20"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-brand-gray space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <Link to="/cart" onClick={() => setIsCartOpen(false)} className="w-full" viewTransition>
                    <Button className="w-full">Go to Checkout</Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartOverlay;
