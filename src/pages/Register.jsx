import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, User, Image, Sparkles } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
export default function Register() {
  const { navigateTo } = useAppRouter();
  const { register, loginWithGoogle, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password validation state
  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    document.title = "StudyNook – Scholar Registry";
    if (user) {
      navigateTo("/");
    }
  }, [user]);

  // Validate password dynamically as user types
  useEffect(() => {
    const errors = [];
    if (password.length > 0) {
      if (password.length < 6) {
        errors.push("At least 6 characters");
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("At least one uppercase letter (A-Z)");
      }
      if (!/[a-z]/.test(password)) {
        errors.push("At least one lowercase letter (a-z)");
      }
    }
    setPasswordErrors(errors);
  }, [password]);

  // Load Google GSI for signup
  useEffect(() => {
    let script;
    let isMounted = true;

    async function initGoogle() {
      try {
        let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
          try {
            const res = await fetch(`${API_URL}/api/auth/google/client-id`, {
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
            "Google Client ID is not configured. Google signup button might not load.",
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
              document.getElementById("google-signup-btn"),
              { theme: "outline", size: "large", width: "100%" },
            );
          }
        };
      } catch (err) {
        console.error(
          "Error loading Google client script inside Register:",
          err,
        );
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
      console.error("Google auth callback error inside Register:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submit
    const finalErrors = [];
    if (password.length < 6) {
      finalErrors.push("At least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      finalErrors.push("At least one uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
      finalErrors.push("At least one lowercase letter (a-z)");
    }

    if (finalErrors.length > 0) {
      setPasswordErrors(finalErrors);
      toast.error("Please satisfy all password safety criteria.");
      return;
    }

    setSubmitting(true);
    const success = await register({
      name,
      email,
      photoUrl,
      password,
    });
    setSubmitting(false);

    if (success) {
      navigateTo("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="card bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body gap-6 p-8">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <span className="badge badge-accent font-mono text-[10px] uppercase font-bold tracking-widest p-2">
              Academic Ledger
            </span>
            <h1 className="text-3xl font-serif font-black text-base-content leading-tight">
              Create Account
            </h1>
            <p className="text-base-content/70 text-xs font-sans max-w-xs mx-auto leading-relaxed">
              Join StudyNook. Register your study halls, list private whiteboard
              rooms, and lock desk bookings.
            </p>
          </div>

          {/* Credentials Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Full Scholar Name *
                </span>
              </label>
              <input
                type="text"
                required
                placeholder="Sajid Hasan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

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

            {/* Photo URL */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-secondary" /> Scholar Photo URL
                  *
                </span>
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="input input-bordered w-full bg-base-200 text-xs font-mono"
              />
              <span className="text-[10px] text-base-content/50">
                Provide an online photo link (e.g. from Unsplash, Imgur).
              </span>
            </div>

            {/* Password */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" /> Secure Password *
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

              {/* Dynamic Password criteria indicator */}
              {password.length > 0 && passwordErrors.length > 0 && (
                <div className="alert alert-error shadow-xs rounded-xl p-3 text-xs space-y-1">
                  <div>
                    <span className="font-bold text-[11px] block text-error-content">
                      Password requirements:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-error-content">
                      {passwordErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {password.length > 0 && passwordErrors.length === 0 && (
                <div className="alert alert-success shadow-xs rounded-xl p-3 text-xs text-success-content font-bold">
                  ✓ Password meets all criteria!
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block shadow-lg gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? "Registering account..." : "Create Free Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-base-content/40 text-[10px] font-mono uppercase tracking-wider">
            Or Register with
          </div>

          {/* Google signup button container */}
          <div className="space-y-3">
            <div
              id="google-signup-btn"
              className="w-full flex justify-center overflow-hidden rounded-xl"
            ></div>
          </div>

          {/* Redirect to Login link */}
          <div className="text-center pt-2 text-sm text-base-content/60">
            Already have an account?{" "}
            <button
              onClick={() => navigateTo("/login")}
              className="link link-primary font-bold font-mono text-xs ml-1"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
