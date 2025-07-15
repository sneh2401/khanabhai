"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/order');
  };

  const handleAdmin = () => {
    router.push('/admin-login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">KhanaBuddy</h1>
        <p className="text-gray-600 mb-8 text-center">
          Your AI-powered voice ordering system
        </p>
        <button
          onClick={handleEnter}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg mb-4"
        >
          Enter
        </button>
        <button
          onClick={handleAdmin}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg text-md"
        >
          Admin
        </button>
        <p className="mt-8 text-gray-400 text-sm text-center">
          Built with React, Next.js, Tailwind CSS, Supabase & OpenAI Whisper
        </p>
      </div>
    </div>
  );
}
