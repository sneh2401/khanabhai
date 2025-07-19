"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function PaymentPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState({ items: [], total: 0 });
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Load order data from localStorage
  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    }
  }, []);

  // Generate QR Code when component mounts
  useEffect(() => {
    if (orderData.total > 0) {
      generateQRCode();
    }
  }, [orderData]);

  const generateQRCode = async () => {
    try {
      const paymentData = {
        status: "PAYMENT_SUCCESS",
        message: "Payment Completed Successfully",
        amount: orderData.total,
        orderId: Date.now(),
        paymentMethod: "QR_SCAN",
        timestamp: new Date().toISOString()
      };

      const qrString = await QRCode.toDataURL(JSON.stringify(paymentData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#92400e', // amber-700 to match theme
          light: '#fffbeb'  // amber-50
        }
      });
      
      setQrCodeImage(qrString);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleStartScan = () => {
    setShowQR(true);
    // Simulate payment processing animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setPaymentProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleYesClick = () => {
    setPaymentComplete(true);
    localStorage.removeItem('orderData');
  };

  const handleNoClick = () => {
    setPaymentCancelled(true);
  };

  const handleGoBack = () => {
    router.back();
  };

  // Payment Complete Screen - matching order page theme
  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-200/50 p-8 text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            Payment Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for choosing KhanaBuddy! Your payment of ₹{orderData.total} has been processed successfully.
          </p>
          <button
            onClick={() => router.push(process.env.NEXT_PUBLIC_HOST_URL || '/')}
            className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Payment Cancelled Screen - matching order page theme
  if (paymentCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-200/50 p-8 text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-rose-600 mb-4">
            Payment Cancelled!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment of ₹{orderData.total} has been cancelled. No charges were made to your account.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push(process.env.NEXT_PUBLIC_HOST_URL || '/')}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform"
            >
              🏠 Back to Home
            </button>
            <button
              onClick={() => {
                setPaymentCancelled(false);
                setShowQR(false);
                setPaymentProgress(0);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 pb-12">
      {/* Header - matching order page exactly */}
      <header className="bg-white/90 backdrop-blur shadow-md sticky top-0 z-20 py-4 px-6 flex justify-between items-center border-b border-amber-200">
        <h1 className="text-xl font-bold text-amber-900">
          💳 KhanaBuddy Payment Gateway
        </h1>
        <button
          onClick={handleGoBack}
          className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          ⬅ Back
        </button>
      </header>

      {/* Main Layout - matching order page grid system */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Section - taking 2 columns like chat box */}
        <section className="col-span-2 bg-white rounded-3xl shadow-xl border border-orange-200/50 p-6 space-y-4">
          <h2 className="text-xl font-bold text-amber-900 mb-2">
            📱 Scan QR Code to Pay
          </h2>

          {!showQR ? (
            <div className="space-y-6">
              {/* QR Placeholder - matching chat box style */}
              <div className="h-80 bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="font-semibold text-amber-700">Ready to Generate Payment QR</p>
                  <p className="text-sm mt-2">Click below to create your secure payment code</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleStartScan}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition transform text-lg"
                >
                  🔍 Generate Payment QR
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>💡 How it works:</strong> Click the button to generate your payment QR code. 
                  Scan it with any phone camera to see "Payment Completed Successfully" and return here to confirm.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* QR Code Display - matching chat area styling */}
              <div className="h-80 bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-center">
                {qrCodeImage ? (
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <img 
                      src={qrCodeImage} 
                      alt="Payment QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center text-amber-600">
                    <div className="animate-spin text-4xl mb-2">🔄</div>
                    <p className="font-semibold">Generating secure QR code...</p>
                  </div>
                )}
              </div>

              {/* Progress Bar - matching theme colors */}
              {paymentProgress > 0 && paymentProgress < 100 && (
                <div className="bg-amber-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-700 font-semibold">🔒 Securing Payment</span>
                    <span className="text-sm text-amber-600">{paymentProgress}%</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${paymentProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {paymentProgress >= 100 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <h3 className="text-xl font-bold text-green-600 mb-4">
                      QR Code Ready!
                    </h3>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-bold text-green-700 mb-2">📲 Scan Instructions:</h4>
                    <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                      <li>Open your phone's camera app</li>
                      <li>Point at the QR code above</li>
                      <li>Tap the notification that appears</li>
                      <li>You'll see "Payment Completed Successfully"</li>
                      <li>Return here and click "Yes" below</li>
                    </ol>
                  </div>

                  <p className="text-center text-gray-600 mb-4">
                    After scanning, did you see "Payment Completed Successfully"?
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleNoClick}
                      className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition transform"
                    >
                      ❌ No, Cancel
                    </button>
                    <button
                      onClick={handleYesClick}
                      className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition transform"
                    >
                      ✅ Yes, Payment Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Order Summary - matching order page sidebar exactly */}
        <section className="bg-white p-6 rounded-3xl shadow-xl border border-orange-200/50">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            🧾 Payment Summary
          </h2>
          {orderData.items.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-amber-700 font-semibold mb-2">Order Details:</p>
                <ul className="divide-y mb-4 border-t border-orange-100">
                  {orderData.items.map((item, i) => (
                    <li
                      key={i}
                      className="py-3 text-sm flex justify-between text-gray-900"
                    >
                      <span>{item.quantity} × {item.name}</span>
                      <span>₹{item.quantity * item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center text-lg font-bold text-amber-800">
                  <span>Total Amount:</span>
                  <span>₹{orderData.total}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• No hidden charges</p>
                <p>• Secure payment gateway</p>
                <p>• Instant confirmation</p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 italic">
              No order data found. Please go back to place an order.
            </p>
          )}
        </section>
      </div>

      {/* Security Info - matching order page info style */}
      <div className="max-w-6xl mx-auto mt-6">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-bold text-amber-900">Secure KhanaBuddy Payment</h3>
              <p className="text-sm text-amber-700">
                Your payment is protected by advanced encryption. The QR code contains secure payment confirmation data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
