"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import carbonaraRecipe from "@/data/recipes/carbonara.json";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anamClient, setAnamClient] = useState<any>(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(carbonaraRecipe[0]); // Default to carbonara
  const [currentStage, setCurrentStage] = useState(0); // Track current cooking stage
  const [currentView, setCurrentView] = useState<'ingredients' | 'steps'>('ingredients'); // Track current view

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
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-4">
            🍝 Sous Chef
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your AI-powered cooking assistant. Learn to make delicious dishes with step-by-step guidance from Alex, your personal chef.
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - AI Assistant */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
                  Chat with Alex - Your Personal Chef
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Get personalized cooking guidance from an AI chef who can help you master any recipe
                </p>
              </div>
              
              <div className="relative bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
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
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                      Ready to start cooking with personalized guidance?
                    </p>
                    <button
                      onClick={startChat}
                      className="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    >
                        Start Cooking with Alex
                      </button>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="w-full h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
                      <p className="text-lg text-slate-600 dark:text-slate-300">Connecting to Alex...</p>
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
                        className="bg-lime-500 hover:bg-lime-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
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

            {/* Right Column - Recipe Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <div className="h-full flex flex-col">
                {/* Recipe Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    {currentRecipe.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>👥</span>
                      {currentRecipe.servings} servings
                    </span>
                    <span className="flex items-center gap-1">
                      <span>⏱️</span>
                      {currentRecipe.estimateMins} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🔥</span>
                      {currentRecipe.nutritionPerServing.kcal} kcal
                    </span>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="mb-6">
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentView('ingredients')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        currentView === 'ingredients'
                          ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      🥘 Ingredients
                    </button>
                    <button
                      onClick={() => setCurrentView('steps')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        currentView === 'steps'
                          ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      👨‍🍳 Steps
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  {currentView === 'ingredients' ? (
                    /* Ingredients View */
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Ingredients List
                      </h4>
                      <div className="space-y-3">
                        {currentRecipe.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <div className="w-2 h-2 bg-lime-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <span className="text-slate-800 dark:text-white font-medium">
                                {ingredient.qty && ingredient.unit 
                                  ? `${ingredient.qty}${ingredient.unit} ${ingredient.name}`
                                  : ingredient.name
                                }
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Steps View */
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Current Step: {currentStage + 1} of {currentRecipe.steps.length}
                      </h4>
                      
                      {currentRecipe.steps[currentStage] && (
                        <div className="bg-lime-50 dark:bg-lime-900/20 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-lime-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {currentStage + 1}
                            </div>
                            <div>
                              <p className="text-slate-800 dark:text-slate-200 font-medium">
                                {currentRecipe.steps[currentStage].text}
                              </p>
                              {currentRecipe.steps[currentStage].timer && (
                                <div className="mt-2 text-sm text-lime-600 dark:text-lime-400">
                                  ⏰ {Math.floor(currentRecipe.steps[currentStage].timer.secs / 60)} minutes
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(((currentStage + 1) / currentRecipe.steps.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStage + 1) / currentRecipe.steps.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stage Navigation */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
                          disabled={currentStage === 0}
                          className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          ← Previous
                        </button>
                        <button
                          onClick={() => setCurrentStage(Math.min(currentRecipe.steps.length - 1, currentStage + 1))}
                          disabled={currentStage === currentRecipe.steps.length - 1}
                          className="flex-1 bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500 dark:text-slate-400">
          <p>© 2024 Sous Chef - Your AI Cooking Companion</p>
      </footer>
      </div>
    </div>
  );
}
