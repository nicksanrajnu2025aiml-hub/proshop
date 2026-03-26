import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import { CreditCard, Wallet, Landmark } from 'lucide-react';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-140px)] py-12 flex justify-center items-start">
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col p-8 sm:p-10">
        
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center text-brand-accent">
             <CreditCard size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Payment Method</h1>
          <p className="text-gray-500 font-medium text-center text-sm">
            Please choose how you'd like to pay
          </p>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col flex-1">
          <div className="space-y-4 mb-8">
            
            {/* Stripe Option */}
            <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-[#f3a847] bg-[#fffaf0]' : 'border-gray-100 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  className="w-5 h-5 accent-[#f3a847] cursor-pointer"
                  name="paymentMethod"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex-1">
                  <span className="font-bold text-brand-dark block">Credit / Debit Card</span>
                  <span className="text-xs text-gray-500 font-medium pt-0.5 block">Secured by Stripe (Demo)</span>
                </div>
                <CreditCard className={paymentMethod === 'Stripe' ? 'text-brand-accent' : 'text-gray-400'} />
              </div>
            </label>
            
            {/* PayPal Option */}
            <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'PayPal' ? 'border-[#f3a847] bg-[#fffaf0]' : 'border-gray-100 hover:border-gray-300'}`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  className="w-5 h-5 accent-[#f3a847] cursor-pointer"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex-1">
                  <span className="font-bold text-brand-dark block">PayPal</span>
                  <span className="text-xs text-gray-500 font-medium pt-0.5 block">Pay with your PayPal balance</span>
                </div>
                <Wallet className={paymentMethod === 'PayPal' ? 'text-blue-500' : 'text-gray-400'} />
              </div>
            </label>

          </div>

          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3.5 rounded-full font-black text-[15px] shadow-xl shadow-brand-primary/50 transition-all border border-brand-primary"
          >
            Continue to confirm
          </button>
        </form>
      </div>
    </div>
  );
};
export default PaymentScreen;
