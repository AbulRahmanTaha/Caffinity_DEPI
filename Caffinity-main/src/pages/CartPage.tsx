import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [currency, setCurrency] = useState(cartItems.length != 0 ? cartItems[0].currency : '$');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrency(cartItems.length != 0 ? cartItems[0].currency : '$')
  }, [cartItems]);

  return (
    <>
      <title>Caffinity - My Bag</title>

      <div className="bg-brand-white min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-12">
            <span className="font-semibold text-lg md:text-xl uppercase">1. My Bag</span>
            <div className="flex-grow h-px bg-brand-gray-dark"></div>
            <span className="text-lg md:text-xl uppercase text-brand-gray-dark">2. Checkout</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-6 p-4 border border-brand-gray rounded-xl shadow-md shadow-brand-gray-dark/20">
                    <img src={item.image!} alt={item.name} className="w-full sm:w-32 h-32 object-cover bg-brand-gray-light rounded-md" />
                    <div className="flex-grow flex flex-col justify-between">
                      <h3 className="font-medium text-xl leading-tight">{item.name}</h3>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-brand-gray rounded">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2"><Minus size={16} /></button>
                          <span className="px-4 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2"><Plus size={16} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <p className="font-semibold text-lg sm:text-right">{`${currency} ${(item.price * item.quantity).toFixed(2)}`}</p>
                      <button onClick={() => removeFromCart(item._id)} className="text-xs uppercase tracking-wider text-brand-red bg-brand-red/15 hover:opacity-60 transition rounded-xl p-2 shadow-sm shadow-brand-gray-dark/20"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border border-brand-gray">
                  <p className="text-brand-black/70">Your cart is empty.</p>
                </div>
              )}
              <Button asChild to="/collections" variant="outline">Back to shopping</Button>
            </div>

            <div className="bg-brand-gray-light p-8 h-fit rounded-2xl">
              <h2 className="font-heading text-2xl mb-6">Order summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{`${currency} ${totalPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currency} 3.95</span>
                </div>
                <hr className="border-brand-gray-dark my-4" />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{`${currency} ${(totalPrice + 3.95).toFixed(2)}`}</span>
                </div>
                <p className="text-sm text-brand-black/70">Estimated shipping time: 2 days</p>
                <Button asChild to="/checkout/payment" className="w-full mt-4" >Check out</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
