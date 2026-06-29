import React, { useEffect } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  const { navigateTo } = useAppRouter();

  useEffect(() => {
    document.title = "StudyNook – Page Not Found";
  }, []);

  return (
    <div className="hero bg-base-100 py-16 px-4">
      <div className="hero-content flex-col text-center gap-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce">
          <Compass className="w-10 h-10 stroke-1" />
        </div>

        <div className="space-y-2 max-w-md">
          <h1 className="text-4xl font-serif font-black text-base-content leading-tight">
            Lost in the Archives
          </h1>
          <p className="text-base-content/70 text-sm font-sans leading-relaxed">
            The study hall, cabin room, or shelf category you are seeking has been relocated or unlisted. Let's return to the primary directory index.
          </p>
        </div>

        <button
          onClick={() => navigateTo("/")}
          className="btn btn-primary shadow-lg gap-2"
        >
          <Home className="w-4 h-4" /> Return to Home
        </button>
      </div>
    </div>
  );
}
