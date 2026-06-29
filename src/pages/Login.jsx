import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const { navigateTo } = useAppRouter();
  const { login, loginWithGoogle, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – Student Login";
    // If user already logged in, redirect to home
    if (user) {
      navigateTo("/");
    }
  }, [user]);

  // Dynamically load Google GSI client library and render the button
  useEffect(() => {
    let script;
    let isMounted = true;

    async function initGoogle() {
      try {
        let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
          try {
            const res = await fetch("/api/auth/google/client-id", {
              credentials: "include",
            });
            if (res.ok) {
              const data = await res.json();
              clientId = data.clientId;
            }
          } catch (fetchErr) {
            console.warn(
              "Could not fetch Google Client ID from backend, will try to initialize anyway.",
              fetchErr,
            );
          }
        }

        if (!clientId) {
          console.warn(
            "Google Client ID is not configured. Google login button might not load.",
          );
          return;
        }

        if (!isMounted) return;

        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleCredentialResponse,
            });
            window.google.accounts.id.renderButton(
              document.getElementById("google-signin-btn"),
              { theme: "outline", size: "large", width: "100%" },
            );
          }
        };
      } catch (err) {
        console.error("Error creating Google client script:", err);
      }
    }

    initGoogle();

    return () => {
      isMounted = false;
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setSubmitting(true);
    try {
      const success = await loginWithGoogle({
        credential: response.credential,
      });
      if (success) {
        navigateTo("/");
      }
    } catch (err) {
      console.error("Google Auth callback error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      navigateTo("/");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="card bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body gap-6 p-8">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <span className="badge badge-accent font-mono text-[10px] uppercase font-bold tracking-widest p-2">
              Security Gate
            </span>
            <h1 className="text-3xl font-serif font-black text-base-content leading-tight">
              Welcome Back
            </h1>
            <p className="text-base-content/70 text-xs font-sans max-w-xs mx-auto leading-relaxed">
              Access your secure study desk bookings ledger, register new
              library nooks, and manage listings.
            </p>
          </div>

          {/* Traditional Credentials Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-primary" /> Email Address *
                </span>
              </label>
              <input
                type="email"
                required
                placeholder="sajid@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            {/* Password */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" /> Password *
                </span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block shadow-lg gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              {submitting ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>

          {/* Divider line */}
          <div className="divider text-base-content/40 text-[10px] font-mono uppercase tracking-wider">
            Or Sign In with
          </div>

          {/* Google Sign-In Container (Real Button) */}
          <div className="space-y-3">
            <div
              id="google-signin-btn"
              className="w-full flex justify-center overflow-hidden rounded-xl"
            ></div>
          </div>

          {/* Redirect to Register link */}
          <div className="text-center pt-2 text-sm text-base-content/60">
            Don't have an account?{" "}
            <button
              onClick={() => navigateTo("/register")}
              className="link link-primary font-bold font-mono text-xs ml-1"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
