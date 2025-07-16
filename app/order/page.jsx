"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const END_PHRASES = [
  "my order is done",
  "place order",
  "order done",
  "submit order",
  "finish order",
];

export default function OrderPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "👋 Hi there! What would you like to order today? Just speak or type — try 'large fries', 'garlic bread', or 'pizza'.",
    },
  ]);
  const [input, setInput] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [done, setDone] = useState(false);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

  const foodItems = [
    "fries",
    "garlic bread",
    "pasta",
    "salad",
    "burger",
    "pizza",
  ];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Please use Google Chrome – your browser doesn't support SpeechRecognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      handleVoiceInput(transcript);
    };

    recognition.onend = () => {
      if (!done) startListening();
    };

    recognition.onerror = (e) => {
      console.error("🧠 Speech error:", e);
    };

    recognitionRef.current = recognition;
    startListening();

    return () => {
      recognition.stop();
      listeningRef.current = false;
    };
  }, [done]);

  // 🎤 Speak AI messages
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.from === "ai") {
      const u = new window.SpeechSynthesisUtterance(last.text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }, [messages]);

  const startListening = () => {
    try {
      recognitionRef.current?.start();
      listeningRef.current = true;
    } catch {
      console.warn("Already listening");
    }
  };

  const handleVoiceInput = (msg) => {
    const lower = msg.toLowerCase();
    if (END_PHRASES.some((phrase) => lower.includes(phrase))) {
      setDone(true);
      recognitionRef.current?.stop();
      setMessages((msgs) => [
        ...msgs,
        { from: "user", text: msg },
        { from: "ai", text: "✅ Thank you so much, your order is placed and being prepared!" },
      ]);
      return;
    }
    sendMsg(msg);
  };

  const sendMsg = (msg) => {
    if (!msg.trim()) return;
    setMessages((m) => [...m, { from: "user", text: msg }]);

    const foundItems = foodItems.filter((item) =>
      msg.toLowerCase().includes(item)
    );

    if (foundItems.length) {
      setOrderList((list) => [
        ...list,
        ...foundItems.filter((item) => !list.includes(item)),
      ]);
    }

    setTimeout(() => {
      if (!done) {
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text: foundItems.length
              ? `🧾 Added: ${foundItems.join(", ")}. Say more items or say "my order is done" to finish.`
              : "🤔 I didn’t catch a food item. Try saying 'burger' or 'pasta'.",
          },
        ]);
      }
    }, 500);
  };

  const handleGoBack = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    listeningRef.current = false;
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 flex flex-col items-center px-4">
      {/* Topbar */}
      <div className="w-full max-w-5xl pt-6 flex justify-between items-center">
        <button
          onClick={handleGoBack}
          className="bg-gray-200 py-2 px-4 rounded-full text-sm font-semibold shadow hover:bg-gray-300"
        >
          ⬅️ Back to Home
        </button>
        <span className={`text-sm font-medium ${done ? 'text-green-600' : 'text-blue-600 animate-pulse'}`}>
          {done ? "🛒 Order submitted." : "🎙️ Listening... say 'my order is done' to finish"}
        </span>
      </div>

      {/* AI Chat Box */}
      <div className="w-full max-w-2xl mt-6 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">🤖 Chat with KhanaBuddy</h1>
        <div className="h-80 overflow-y-auto p-2 space-y-3 bg-gray-50 border rounded">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                msg.from === "ai"
                  ? "bg-blue-100 text-blue-900 self-start"
                  : "ml-auto bg-green-100 text-green-900 self-end"
              }`}
            >
              <b>{msg.from === "ai" ? "KhanaBuddy" : "You"}:</b> {msg.text}
            </div>
          ))}
        </div>

        {/* Text input box */}
        {!done && (
          <div className="flex gap-2 mt-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleVoiceInput(input)
              }
              placeholder="Type or just speak..."
              className="flex-1 border px-4 py-2 rounded focus:ring focus:ring-indigo-300"
            />
            <button
              onClick={() => handleVoiceInput(input)}
              className="bg-indigo-600 text-white font-bold px-5 rounded hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="w-full max-w-2xl mt-6 mb-8 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">🧾 Your Live Order</h2>
        {orderList.length === 0 ? (
          <p className="text-gray-500">No items yet. Start speaking or typing to add items.</p>
        ) : (
          <ul className="space-y-2 list-disc ml-6 text-gray-800">
            {orderList.map((item, index) => (
              <li key={index} className="capitalize">✅ {item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
