import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppRouter } from "../context/RouteContext.jsx";
import { toast } from "sonner";
import { User, Image as ImageIcon, Lock, Mail, Sparkles, ShieldCheck, Save, Eye, EyeOff } from "lucide-react";

export default function MyProfile() {
  const { user, updateProfile } = useAuth();
  const { navigateTo } = useAppRouter();

  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – Edit My Profile";
    if (!user) {
      toast.info("Please login to manage your profile.");
      navigateTo("/login");
    } else {
      setName(user.name || "");
      setPhotoUrl(user.photoUrl || "");
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!photoUrl.trim()) {
      toast.error("Please provide a profile image URL.");
      return;
    }

    if (!user.isGoogle && password) {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one uppercase letter.");
        return;
      }
      if (!/[a-z]/.test(password)) {
        toast.error("Password must contain at least one lowercase letter.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      photoUrl: photoUrl.trim()
    };

    if (!user.isGoogle && password) {
      payload.password = password;
    }

    const success = await updateProfile(payload);
    setSaving(false);
    if (success) {
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header Info */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="badge badge-primary font-mono text-xs font-bold uppercase tracking-widest p-3">
          Account Settings
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-base-content leading-tight">
          My Profile Register
        </h1>
        <p className="text-base-content/70 text-sm font-sans max-w-xl">
          Customize your workspace identity, coordinate profile illustrations, and reset your vault password parameter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 flex flex-col items-center p-6 bg-base-100 border border-base-300 rounded-3xl h-fit space-y-4 shadow-sm text-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-base-300">
              <img
                src={photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
                alt={name || "User Avatar"}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-accent text-white p-1.5 rounded-full shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1 w-full">
            <h3 className="font-serif font-bold text-lg text-base-content truncate">
              {name || "Scholar Peer"}
            </h3>
            <p className="text-xs text-base-content/50 font-mono font-bold uppercase tracking-wide">
              {user.isGoogle ? "Google Account" : "Local Vault Login"}
            </p>
          </div>

          <div className="divider my-0"></div>

          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <Mail className="w-4 h-4 shrink-0 text-primary" />
              <span className="truncate" title={user.email}>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <ShieldCheck className="w-4 h-4 shrink-0 text-success" />
              <span>Status: Active Scholar</span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Profile Form */}
        <form onSubmit={handleSave} className="md:col-span-2 card bg-base-100 border border-base-300 rounded-3xl shadow-sm overflow-hidden">
          <div className="card-body p-6 sm:p-8 space-y-4">
            
            {/* Full Name field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold font-mono text-xs text-base-content/85 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> FULL SCHOLAR NAME
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sajid Hasan"
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:border-primary transition"
                required
              />
            </div>

            {/* Photo URL field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold font-mono text-xs text-base-content/85 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-secondary" /> PHOTO ILLUSTRATION LINK (URL)
                </span>
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:border-primary font-mono text-xs transition"
                required
              />
              <label className="label">
                <span className="label-text-alt text-base-content/40 font-sans">
                  Provide an Unsplash, Gravatar or any direct secure picture link.
                </span>
              </label>
            </div>

            {/* Password Section (Only for local credentials users) */}
            {user.isGoogle ? (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-4 space-y-2 text-success">
                <div className="flex items-center gap-2 font-serif font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  Google Authentication Bound
                </div>
                <p className="text-xs leading-relaxed font-sans opacity-90">
                  Your credentials are secure and verified through Google OAuth. Password modifications are managed directly within your Google Account settings, which protects your library vault.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2 border-t border-base-300">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-error" />
                  <h4 className="font-serif font-bold text-sm text-base-content">
                    Vault Cryptographic Password Reset
                  </h4>
                </div>
                
                <p className="text-xs text-base-content/60 font-sans leading-relaxed">
                  Fill these fields only if you want to reset your existing login password. Otherwise, leave them empty.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold font-mono text-[10px] text-base-content/85">
                        NEW PASSWORD
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input input-bordered w-full pr-10 bg-base-200/50 focus:bg-base-100 focus:border-primary font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/45 hover:text-base-content"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold font-mono text-[10px] text-base-content/85">
                        CONFIRM NEW PASSWORD
                      </span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:border-primary font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-base-content/45 font-mono leading-normal pl-1">
                  • Minimum 6 characters • 1 uppercase letter (A-Z) • 1 lowercase letter (a-z)
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="card-actions justify-end pt-4 border-t border-base-300 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="btn btn-ghost btn-sm sm:btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-sm sm:btn-md shadow-lg font-bold gap-1.5"
              >
                {saving ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Settings
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
