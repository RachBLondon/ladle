"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAnamAI = async () => {
      if (!videoRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        // Create session token
        const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ANAM_API_KEY}`,
          },
          body: JSON.stringify({
            personaConfig: {
              name: "Alex",
              avatarId: "30fa96d0-26c4-4e55-94a0-517025942e18",
              voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
              llmId: "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
              systemPrompt: `You are Alex, an enthusiastic and knowledgeable cooking assistant specializing in Italian cuisine. You're here to guide users through making authentic Spaghetti Carbonara step by step.

Your role is to:
- Be encouraging and supportive throughout the cooking process
- Explain each step clearly with helpful tips and techniques
- Warn about common mistakes (like scrambling the eggs)
- Provide timing guidance and visual cues
- Share the cultural background and authenticity of the dish
- Be patient with beginners and celebrate their progress

Key Carbonara knowledge to share:
- This is a traditional Roman dish with simple, quality ingredients
- The magic happens when you combine hot pasta with the egg mixture OFF the heat
- Pancetta should be crispy, and the sauce should be creamy, not scrambled
- Freshly grated pecorino and parmesan are essential
- Timing is crucial - work quickly when combining the final ingredients

When users ask about the recipe, guide them through these steps:
1. Boil water and prep ingredients (pancetta, cheese, eggs)
2. Cook pasta al dente while frying pancetta with garlic
3. Combine everything off the heat to create the creamy sauce
4. Serve immediately with extra cheese and black pepper

Always be encouraging, explain the "why" behind each step, and help users feel confident in their cooking abilities.`,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create session token: ${response.statusText}`);
        }

        const { sessionToken } = await response.json();

        // Import and create Anam client
        const { createClient } = await import("@anam-ai/js-sdk");
        const anamClient = createClient(sessionToken);

        // Stream to video element
        await anamClient.streamToVideoElement(videoRef.current.id);
      } catch (err) {
        console.error("Error initializing Anam AI:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize Anam AI");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAnamAI();
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* Anam AI Video Section */}
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">AI Assistant</h2>
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              id="video-element-id"
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            {isLoading && (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading AI Assistant...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center text-red-600 dark:text-red-400">
                  <p className="text-sm">Error: {error}</p>
                  <p className="text-xs mt-1">Please check your API key configuration</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
