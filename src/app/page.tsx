"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anamClient, setAnamClient] = useState<any>(null);
  const [isChatActive, setIsChatActive] = useState(false);

  const startChat = async () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get session token from our backend API
      const response = await fetch("/api/session-token", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to create session token: ${response.statusText}`);
      }

      const { sessionToken } = await response.json();

      // Import and create Anam client
      const { createClient } = await import("@anam-ai/js-sdk");
      const client = createClient(sessionToken);

      // Start streaming to the video element
      await client.streamToVideoElement(videoRef.current.id);

      setAnamClient(client);
      setIsChatActive(true);
    } catch (err) {
      console.error("Error starting chat:", err);
      setError(err instanceof Error ? err.message : "Failed to start chat");
    } finally {
      setIsLoading(false);
    }
  };

  const stopChat = () => {
    if (anamClient) {
      // Disconnect the client
      anamClient.stopStreaming();
      setAnamClient(null);
      setIsChatActive(false);

      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🍝 Sous Chef
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI-powered cooking assistant. Learn to make authentic Italian dishes with step-by-step guidance from Alex, your personal chef.
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* AI Assistant Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Chat with Alex - Your Carbonara Chef
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized cooking guidance from an AI chef who specializes in authentic Italian cuisine
              </p>
            </div>
            
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                id="video-element-id"
                autoPlay
                playsInline
                className="w-full h-80 object-cover"
                style={{ display: (isLoading || !isChatActive) ? 'none' : 'block' }}
              />
              {!isChatActive && !isLoading && !error && (
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍🍳</div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Ready to learn how to make authentic Spaghetti Carbonara?
                    </p>
                    <button
                      onClick={startChat}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    >
                      Start Cooking with Alex
                    </button>
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Connecting to Alex...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-center text-red-600 dark:text-red-400">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-lg mb-2">Error: {error}</p>
                    <p className="text-sm mb-4">Please check your API key configuration</p>
                    <button
                      onClick={startChat}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Control Buttons */}
            {isChatActive && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={stopChat}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Stop Chat
                </button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Step-by-Step Guidance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get detailed instructions for each cooking step with helpful tips and techniques.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Perfect Timing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Learn the crucial timing techniques that make authentic carbonara perfect every time.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🇮🇹</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Authentic Italian
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Master traditional Roman techniques with cultural context and authentic methods.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>© 2024 Sous Chef - Your AI Cooking Companion</p>
        </footer>
      </div>
    </div>
  );
}
