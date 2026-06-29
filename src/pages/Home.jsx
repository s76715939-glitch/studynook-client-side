import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import Loader from "../components/Loader.jsx";
import {
  Calendar,
  Users,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  MessageSquare,
  Star,
  Laptop,
  Award,
  Library,
} from "lucide-react";
import { motion } from "motion/react";
const API_URL = import.meta.env.VITE_API_URL;
export default function Home() {
  const { navigateTo } = useAppRouter();
  const [latestRooms, setLatestRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set browser tab title dynamically
  useEffect(() => {
    document.title = "StudyNook – Find Your High-Focus Study Cell";
  }, []);

  // Fetch latest 6 rooms
  useEffect(() => {
    async function fetchLatestRooms() {
      try {
        const res = await fetch(`${API_URL}/api/rooms?limit=6&latest=true`);
        if (res.ok) {
          const data = await res.json();
          setLatestRooms(data);
        }
      } catch (err) {
        console.error("Error fetching latest rooms:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestRooms();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section using daisyUI 'hero' */}
      <div className="hero bg-base-200 rounded-3xl min-h-[550px] overflow-hidden relative shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-1" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-1" />

        <div className="hero-content text-center py-12 px-4 md:px-12">
          <div className="max-w-3xl space-y-8">
            <div className="badge badge-primary gap-2 p-4 font-mono uppercase tracking-widest text-xs font-bold shadow-xs mx-auto">
              <Sparkles className="w-3.5 h-3.5" /> Modern Library Companion
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-base-content leading-tight">
              Secure Your High-Focus{" "}
              <span className="text-primary underline decoration-accent decoration-wavy">
                Study Cell
              </span>
            </h1>

            <p className="text-base md:text-lg text-base-content/70 leading-relaxed font-sans max-w-2xl mx-auto">
              Eliminate double-booking chaos. Discover and book quiet study
              rooms, whiteboard cabins, and creative lounges inside your campus
              library ecosystem in just 3 clicks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigateTo("/rooms")}
                className="btn btn-primary btn-lg shadow-lg flex items-center gap-2 group"
              >
                Explore Rooms Catalog
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={() => navigateTo("/add-room")}
                className="btn btn-outline btn-lg"
              >
                List a Library Nook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Section using daisyUI 'stats' */}
      <section className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-xs">
        <div className="stats stats-vertical lg:stats-horizontal w-full bg-transparent">
          <div className="stat">
            <div className="stat-figure text-primary">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <div className="stat-title">Completed Quiet Sessions</div>
            <div className="stat-value text-primary font-serif">12,400+</div>
            <div className="stat-desc">Through verified student cards</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="stat-title">Conflict-Free Guarantee</div>
            <div className="stat-value text-secondary font-serif">99.8%</div>
            <div className="stat-desc">Double-booking block system</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Active University Nooks</div>
            <div className="stat-value text-accent font-serif">50+</div>
            <div className="stat-desc">
              Across Engineering, Arts, & Law wings
            </div>
          </div>
        </div>
      </section>

      {/* 3. Available Study Rooms catalog */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-black text-base-content">
              Featured Study Rooms
            </h2>
            <p className="text-base-content/60 text-sm max-w-xl font-sans">
              Handpicked high-focus quiet spaces. Discover, review amenities,
              book instantly, and unlock your academic flow.
            </p>
          </div>
          <button
            onClick={() => navigateTo("/rooms")}
            className="btn btn-ghost text-primary hover:bg-primary/10 gap-2 cursor-pointer"
          >
            View all available spaces
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <Loader message="Fetching featured library spaces..." />
        ) : latestRooms.length === 0 ? (
          <div className="alert alert-info shadow-md rounded-2xl flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 text-info-content" />
              <div>
                <h3 className="font-bold">No active listings!</h3>
                <p className="text-xs">
                  No rooms have been registered in the database yet. Be the
                  absolute first student leader to register one!
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo("/add-room")}
              className="btn btn-sm btn-outline text-info-content"
            >
              Add Room Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestRooms.map((room) => (
              <div
                key={room._id}
                className="card card-compact bg-base-100 shadow-xl hover:-translate-y-2 transition-all duration-300 border border-base-300"
              >
                <figure className="relative aspect-video w-full overflow-hidden bg-base-200">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 badge badge-neutral bg-black/75 text-white border-none text-[10px] uppercase font-mono font-bold tracking-wider">
                    {room.floor}
                  </div>
                </figure>

                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title text-base-content font-serif font-bold text-base line-clamp-1 pr-1">
                      {room.name}
                    </h3>
                    <span className="badge badge-accent badge-sm font-bold text-accent-content tracking-wide">
                      ${room.hourlyRate}/hr
                    </span>
                  </div>

                  <p className="text-base-content/70 text-sm line-clamp-2 h-10 font-sans leading-relaxed">
                    {room.description}
                  </p>

                  <div className="divider my-1"></div>

                  <div className="flex justify-between text-xs text-base-content/60 font-mono font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" /> Seats:{" "}
                      {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookmarkCheck className="w-3.5 h-3.5 text-secondary" />{" "}
                      Booked: {room.bookingCount || 0} times
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="badge badge-neutral badge-xs font-bold text-neutral-content"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="badge badge-ghost badge-xs text-base-content/50 font-bold">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="card-actions justify-end pt-3">
                    <button
                      onClick={() => navigateTo(`/rooms/${room._id}`)}
                      className="btn btn-primary btn-sm btn-block"
                    >
                      View & Book Lounge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Core Pillars bento layout using daisyUI cards */}
      <section className="bg-neutral text-neutral-content rounded-3xl p-8 md:p-12 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="badge badge-accent font-mono font-bold uppercase tracking-widest text-xs">
            Our Core Promises
          </span>
          <h2 className="text-3xl font-serif font-black">
            Designed For Serious Scholars
          </h2>
          <p className="text-neutral-content/70 text-sm font-sans">
            We provide a highly streamlined student-to-student workspace
            distribution ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 text-base-content border border-base-300">
            <div className="card-body gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="card-title font-serif font-bold text-lg text-primary">
                Conflict Detection
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed font-sans">
                Our millisecond scheduling overlap checker completely blocks
                overlapping room requests. Double-booking is logically
                impossible.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 text-base-content border border-base-300">
            <div className="card-body gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="card-title font-serif font-bold text-lg text-secondary">
                Peer-to-Peer Listed
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed font-sans">
                Librarians, tutors, and student unions can list room
                coordinates, set dynamic hourly fees, and manage access
                parameters effortlessly.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 text-base-content border border-base-300">
            <div className="card-body gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="card-title font-serif font-bold text-lg text-accent">
                Ergonomic Filters
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed font-sans">
                Filter cells instantly by Wi-Fi status, dual whiteboards,
                projectors, air-conditioning, capacity size, or hourly rate
                ranges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bento Grid Reviews & Testimonials Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif font-black text-base-content">
            Scholars Community Feedback
          </h2>
          <p className="text-base-content/60 text-sm max-w-xl mx-auto font-sans">
            Hear from researchers, university exam candidates, and librarians
            who trust StudyNook daily.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Testimonial Card */}
          <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content lg:col-span-2 shadow-xl p-8 justify-between">
            <div className="flex gap-1 text-warning">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-lg md:text-xl font-serif italic leading-relaxed my-6">
              "StudyNook completely resolved our exam study chaos. Instead of
              wandering library wings searching for vacant whiteboards, we
              secure the collaborative Curie Nook in seconds. Truly essential
              for students."
            </p>
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-offset-2 ring-primary">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                    alt="Sarah Jenkins"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm">Sarah Jenkins</h4>
                <p className="text-xs opacity-80">Biochemistry Researcher</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="card bg-base-200 border border-base-300 shadow-sm p-6 justify-between text-center lg:text-left">
            <div className="space-y-2">
              <span className="badge badge-accent font-mono text-xs uppercase tracking-wider font-bold">
                University Reach
              </span>
              <h3 className="text-5xl font-serif font-black text-base-content">
                100%
              </h3>
              <p className="text-base-content/70 text-sm font-sans leading-normal">
                Satisfaction score rated by student associations across three
                major departments.
              </p>
            </div>
            <div className="divider my-1"></div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="block font-serif text-2xl font-bold text-primary">
                  15 Min
                </span>
                <span className="text-[10px] text-base-content/50 uppercase tracking-widest font-mono font-bold">
                  Booking Window
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-secondary">
                  Free
                </span>
                <span className="text-[10px] text-base-content/50 uppercase tracking-widest font-mono font-bold">
                  Guest Accounts
                </span>
              </div>
            </div>
          </div>

          {/* Student Reviews Feed */}
          <div className="card bg-base-200 border border-base-300 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h4 className="font-bold text-sm text-base-content">
                Lounge Check-In Diary
              </h4>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-base-100 rounded-xl border border-base-300 shadow-xs">
                <p className="text-xs text-base-content/80 font-sans italic">
                  "Double-sided math whiteboards were exactly as specified.
                  Exceptional space!"
                </p>
                <span className="block text-[10px] text-primary/80 mt-1.5 font-bold font-mono">
                  - Rahat K., Mathematics CSE
                </span>
              </div>
              <div className="p-3 bg-base-100 rounded-xl border border-base-300 shadow-xs">
                <p className="text-xs text-base-content/80 font-sans italic">
                  "I registered our chemistry lab desk during our off-hours.
                  Earned funding for our scientific projects!"
                </p>
                <span className="block text-[10px] text-primary/80 mt-1.5 font-bold font-mono">
                  - Tasnim S., Biotech Lead
                </span>
              </div>
            </div>
          </div>

          {/* Invitation Banner Card */}
          <div className="card bg-base-100 border border-base-300 lg:col-span-2 shadow-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-serif font-bold text-base-content">
                Are you a tutor, club leader or librarian?
              </h3>
              <p className="text-base-content/70 text-sm max-w-md font-sans">
                Create listings for your academic rooms, customize capacity
                thresholds, select special whiteboards, and maintain full
                control.
              </p>
            </div>
            <button
              onClick={() => navigateTo("/add-room")}
              className="btn btn-primary shadow-md shrink-0 px-6 cursor-pointer"
            >
              List Your Study Room Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
