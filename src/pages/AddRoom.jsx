import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
import {
  Plus,
  ShieldCheck,
  Building,
  Landmark,
  Users,
  DollarSign,
  ListChecks,
  Sparkles,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
const AMENITY_OPTIONS = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const PRE_FILL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    label: "Classic Library",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    label: "Collaborative Hub",
  },
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
    label: "Modern Lounge",
  },
  {
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600",
    label: "Acoustic Pod",
  },
];

export default function AddRoom() {
  const { navigateTo } = useAppRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(5);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – List a Study Nook";

    // Safety check: redirect to login if not authenticated
    if (!user) {
      toast.info("Please login to register or list a new room.");
      navigateTo("/login");
    }
  }, [user]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const handlePreFillImage = (url) => {
    setImage(url);
    toast.success("Beautiful library layout selected!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !image || !floor || !capacity || !hourlyRate) {
      toast.error("Please specify all required room attributes.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          image,
          floor,
          capacity: Number(capacity),
          hourlyRate: Number(hourlyRate),
          amenities: selectedAmenities,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room added successfully!");
        navigateTo("/my-listings");
      } else {
        toast.error(data.error || "Failed to submit room profile.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null; // Redirecting via useEffect
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="space-y-2">
        <span className="badge badge-accent font-mono text-xs font-bold uppercase tracking-widest p-3">
          Librarian Registry
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-base-content">
          List a New Study Cell
        </h1>
        <p className="text-base-content/70 text-sm font-sans max-w-xl">
          Register a physical lounge, conference wing, or whiteboard cabin you
          control. Define floor plans, capacity criteria, and dynamic hourly
          bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Form Column using daisyUI Cards */}
        <div className="card bg-base-100 border border-base-300 md:col-span-2 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="card-body p-6 sm:p-8 space-y-5"
          >
            {/* Room Name */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-primary" /> Study Room Title
                  *
                </span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Curie Collaborative Nook"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            {/* Description */}
            <div className="form-control w-full space-y-1">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span>Detailed Description *</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the workspace acoustics, seating arrangement, whiteboard features, proximity to power sockets, and natural lighting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-base-200 text-sm resize-none"
              />
            </div>

            {/* Image URL with pre-fills */}
            <div className="form-control w-full space-y-3">
              <div className="space-y-1">
                <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                  <span>Cover Photo URL *</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input input-bordered w-full bg-base-200 text-xs font-mono"
                />
              </div>

              {/* Curated Pre-fills */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-base-content/50 font-mono uppercase tracking-wider">
                  Or select a verified layout photo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRE_FILL_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePreFillImage(img.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 text-left transition-all ${
                        image === img.url
                          ? "border-primary ring-2 ring-primary/20 scale-95"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white truncate w-full">
                          {img.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Floor */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                  <span className="flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5 text-secondary" /> Floor
                    Level *
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3rd Floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="input input-bordered w-full bg-base-200 text-sm"
                />
              </div>

              {/* Seat Capacity */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary" /> Seats Cap *
                  </span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="input input-bordered w-full bg-base-200 text-sm"
                />
              </div>

              {/* Hourly Rate */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-accent" /> Hourly
                    Price *
                  </span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="input input-bordered w-full bg-base-200 text-sm"
                />
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="form-control space-y-2 pt-2">
              <label className="label text-[11px] font-mono font-bold text-base-content/60 uppercase tracking-wider p-0">
                <span className="flex items-center gap-1">
                  <ListChecks className="w-4 h-4 text-primary" /> Supported
                  Amenities
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 p-2.5 bg-base-200 border border-base-300 rounded-xl cursor-pointer text-xs transition hover:bg-base-300"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityChange(amenity)}
                        className="checkbox checkbox-primary checkbox-xs"
                      />
                      <span className="font-bold text-base-content/80 select-none">
                        {amenity}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <div className="card-actions pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-block shadow-lg gap-2"
              >
                <Plus className="w-5 h-5" />
                {submitting
                  ? "Publishing Cell Spec File..."
                  : "Publish Study Room Listing"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <div className="card bg-neutral text-neutral-content border border-neutral p-6 space-y-4 shadow-sm">
            <span className="text-accent text-[10px] uppercase font-mono font-bold block">
              Host Terms
            </span>
            <h3 className="card-title font-serif font-bold text-base leading-snug">
              Listing Trust & Maintenance Agreement
            </h3>
            <p className="text-neutral-content/75 text-xs leading-relaxed font-sans">
              By publishing, you confirm that you possess keys, authorization
              slots, or administrative permissions to list this workspace.
            </p>
            <div className="divider opacity-15 my-1"></div>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-neutral-content/80">
                  Ensure dry-erase boards are cleared and clean markers are
                  supplied.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-neutral-content/80">
                  Maintain the library quiet zone guidelines when transitioning
                  hours.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
