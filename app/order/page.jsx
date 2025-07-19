"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const END_PHRASES = [
  "my order is done",
  "place order",
  "order done",
  "submit order",
  "finish order",
  "murder is done"
];

const menuItems = {
  fries: 59,
  "garlic bread": 99,
  pasta: 149,
  salad: 89,
  burger: 129,
  pizza: 199,
  "coca-Cola": 50,
  "cold coffee": 90,
};

export default function OrderPage() {
  const router = useRouter();
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi, What would you like to order?" },
  ]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [showProceedButton, setShowProceedButton] = useState(false);

  // AI voice response
  useEffect(() => {
    if (typeof window === "undefined") return;
    const last = messages[messages.length - 1];
    if (last?.from === "ai") {
      const u = new window.SpeechSynthesisUtterance(last.text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }, [messages]);

  // SpeechRecognition setup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Please use Google Chrome — Speech Recognition is not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.trim();
      handleVoiceInput(text);
    };
    recognition.onend = () => {
      // FIXED: Only restart if not done and proceed button not shown
      if (!done && !showProceedButton && listeningRef.current) {
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };
    recognition.onerror = (e) => console.warn("Speech recognition error:", e);

    recognitionRef.current = recognition;

    setTimeout(() => {
      startListening();
    }, 3000);

    return () => {
      recognition.stop();
      listeningRef.current = false;
    };
  }, [done, showProceedButton]); // Added showProceedButton dependency

  const startListening = () => {
    if (showProceedButton || done) return; // Don't start if order is done
    try {
      recognitionRef.current?.start();
      listeningRef.current = true;
    } catch {}
  };

  const handleGoBack = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    listeningRef.current = false;
    router.push("/");
  };

  const handleProceedToPayment = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    listeningRef.current = false;

    const total = orderList.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    localStorage.setItem(
      "orderData",
      JSON.stringify({
        items: orderList,
        total: total,
      })
    );

    router.push("/payment");
  };

  const handleVoiceInput = (msg) => {
    const lower = msg.toLowerCase();

    // MOST RELIABLE FIX: End order with direct state access
    if (END_PHRASES.some((p) => lower.includes(p))) {
      recognitionRef.current?.stop();
      listeningRef.current = false;
      setShowProceedButton(true);
      setDone(true);

      // Add user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "user", text: msg },
      ]);

      // Use functional update to get current orderList value
      setOrderList((currentOrderList) => {
        // Calculate total from current order list
        const total = currentOrderList.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

        console.log("Current Order List:", currentOrderList); // Debug line
        console.log("Calculated Total:", total); // Debug line

        // Update messages with correct total
        setMessages([
          {
            from: "ai",
            text: `Thank you for your order ! Your bill amount is ₹${total}. Now proceed to payment.`,
          },
        ]);

        return currentOrderList;
      });

      return;
    }

    // Don't process any other inputs if order is done
    if (done || showProceedButton) return;

    // 2. Price query
    const priceQuery = Object.keys(menuItems).find(
      (item) => lower.includes("price") && lower.includes(item)
    );
    if (priceQuery) {
      setMessages((m) => [
        ...m,
        { from: "user", text: msg },
        {
          from: "ai",
          text: `The price of ${priceQuery} is ₹${menuItems[priceQuery]}.`,
        },
      ]);
      return;
    }

    // Add user message first
    setMessages((m) => [...m, { from: "user", text: msg }]);

    // Number parsing
    const quantityWords = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      n1: 1,
      n2: 2,
      n3: 3,
      n4: 4,
      n5: 5,
    };

    const isRemove = lower.includes("remove") || lower.includes("cancel");
    const ordersToAdd = [];
    const words = lower.split(" ");

    Object.keys(menuItems).forEach((item) => {
      const regex = new RegExp(`\\b${item.replace(/ /g, "\\s+")}\\b`, "i");
      if (regex.test(lower)) {
        const itemWords = item.split(" ");
        let startIndex = -1;
        for (let i = 0; i <= words.length - itemWords.length; i++) {
          if (
            words
              .slice(i, i + itemWords.length)
              .join(" ")
              .toLowerCase() === item.toLowerCase()
          ) {
            startIndex = i;
            break;
          }
        }
        let qty = 1;
        if (startIndex > 0) {
          const beforeWord = words[startIndex - 1];
          if (!isNaN(parseInt(beforeWord))) {
            qty = parseInt(beforeWord);
          } else if (quantityWords[beforeWord]) {
            qty = quantityWords[beforeWord];
          }
        }
        ordersToAdd.push({ name: item, quantity: qty });
      }
    });

    if (ordersToAdd.length > 0) {
      // Update order list
      setOrderList((prev) => {
        let updated = [...prev];

        for (const { name, quantity } of ordersToAdd) {
          const price = menuItems[name];
          const existingIndex = updated.findIndex((i) => i.name === name);

          if (isRemove) {
            if (existingIndex === -1) {
              setMessages((msgs) => [
                ...msgs,
                {
                  from: "ai",
                  text: `You don't have any ${name} in your order.`,
                },
              ]);
              continue;
            }

            const existing = updated[existingIndex];
            const prevQty = existing.quantity;

            if (quantity > prevQty) {
              setMessages((msgs) => [
                ...msgs,
                {
                  from: "ai",
                  text: `let's check ....`,
                },
              ]);
              continue;
            }

            updated[existingIndex].quantity -= quantity;
            if (updated[existingIndex].quantity <= 0) {
              updated.splice(existingIndex, 1);
            }

            setTimeout(() => {
              setMessages((msgs) => [
                ...msgs,
                { from: "ai", text: `${name} is removed` },
              ]);
            }, 500);
          } else {
            if (existingIndex !== -1) {
              updated[existingIndex].quantity += quantity;
            } else {
              updated.push({ name, price, quantity });
            }

            setTimeout(() => {
              setMessages((msgs) => [
                ...msgs,
                { from: "ai", text: `${name} is added` },
              ]);
            }, 500);
          }
        }

        // ADDED DEBUG: Log the updated order list
        console.log("Updated Order List:", updated);
        return updated;
      });
    } else {
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: "I didn't understand, say again" },
        ]);
      }, 500);
    }
  };

  const handleSend = () => {
    if (!input.trim() || done || showProceedButton) return;
    handleVoiceInput(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 pb-12">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur shadow-md sticky top-0 z-20 py-4 px-6 flex justify-between items-center border-b border-amber-200">
        <h1 className="text-xl font-bold text-amber-900">
          🍽️ KhanaBuddy Order Assistant
        </h1>
        <button
          onClick={handleGoBack}
          className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          ⬅ Back
        </button>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Box */}
        <section className="col-span-2 bg-white rounded-3xl shadow-xl border border-orange-200/50 p-6 space-y-4">
          <h2 className="text-xl font-bold text-amber-900 mb-2">
            🤖 Chat with KhanaBuddy
          </h2>

          <div className="h-80 overflow-y-auto space-y-3 bg-rose-50 border border-rose-100 rounded-xl p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                  msg.from === "ai"
                    ? "bg-amber-100 text-amber-900 self-start"
                    : "ml-auto bg-green-100 text-green-900 self-end"
                }`}
              >
                <b>{msg.from === "ai" ? "KhanaBuddy" : "You"}:</b> {msg.text}
              </div>
            ))}
          </div>

          {/* Show Proceed Button when order is done */}
          {showProceedButton ? (
            <div className="mt-4 text-center">
              <button
                onClick={handleProceedToPayment}
                className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                🛒 Proceed to Payment
              </button>
            </div>
          ) : (
            !done && (
              <div className="flex gap-2 mt-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type or just speak..."
                  className="flex-1 px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold px-5 py-2 rounded-xl shadow hover:scale-105 transition"
                >
                  Send
                </button>
              </div>
            )
          )}
        </section>

        {/* Order Summary */}
        <section className="bg-white p-6 rounded-3xl shadow-xl border border-orange-200/50">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            🧾 Your Order
          </h2>
          {orderList.length === 0 ? (
            <p className="text-gray-600 italic">
              Your cart is empty. Add items to see them here.
            </p>
          ) : (
            <>
              <ul className="divide-y mb-4 border-t border-orange-100">
                {orderList.map((item, i) => (
                  <li
                    key={i}
                    className="py-3 text-sm flex justify-between text-gray-900"
                  >
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span>₹{item.quantity * item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right text-lg font-bold text-amber-800">
                Total: ₹
                {orderList.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
