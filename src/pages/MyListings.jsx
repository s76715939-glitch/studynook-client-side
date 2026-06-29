import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "sonner";
import { Plus, ArrowUpRight, HelpCircle, Users, CalendarCheck, Sparkles } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
export default function MyListings() {
  const { navigateTo } = useAppRouter();
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "StudyNook – Hosted Rooms";

    if (!user) {
      toast.info("Please login to view your listed study spaces.");
      navigateTo("/login");
    }
  }, [user]);

  useEffect(() => {
    async function fetchMyListings() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/rooms`);
        if (res.ok) {
          const data = await res.json();
          // Filter listings owned by the current logged in user
          const myRooms = data.filter((room) => room.ownerId === user._id);
          setRooms(myRooms);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        toast.error("Failed to load listed rooms.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyListings();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-2">
          <span className="badge badge-accent font-mono text-xs font-bold uppercase tracking-widest p-3">
            Workspace Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-base-content leading-tight">
            My Study Cell Listings
          </h1>
          <p className="text-base-content/70 text-sm font-sans max-w-xl">
            Audit study traction, append amenities checklist, customize hourly pricing parameters, or register additional whiteboard rooms you handle.
          </p>
        </div>

        <button
          onClick={() => navigateTo("/add-room")}
          className="btn btn-primary shadow-lg gap-1.5 shrink-0"
        >
          <Plus className="w-5 h-5" /> List Another Room
        </button>
      </div>

      {loading ? (
        <Loader message="Retrieving your active host prospectus..." />
      ) : rooms.length === 0 ? (
        <div className="hero bg-base-200 border border-base-300 py-16 text-center rounded-3xl">
          <div className="hero-content flex-col gap-4">
            <div className="w-16 h-16 bg-accent/15 text-accent rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="font-serif font-bold text-xl text-base-content">
                No Room Listings Registered
              </h3>
              <p className="text-base-content/75 text-sm font-sans leading-relaxed">
                You haven't listed any study rooms yet. If you are a student rep, librarian, or private admin, list an available room now!
              </p>
            </div>
            <button
              onClick={() => navigateTo("/add-room")}
              className="btn btn-primary btn-sm mt-2"
            >
              List Your First Room Now
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="card bg-base-100 border border-base-300 hover:shadow-md transition-all duration-250 flex flex-col justify-between"
            >
              <div>
                <figure className="relative aspect-video w-full overflow-hidden bg-base-200">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 badge badge-neutral bg-black/70 border-none font-mono text-[9px] font-bold text-white uppercase p-2">
                    {room.floor}
                  </div>
                </figure>

                <div className="card-body p-5 gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif font-bold text-base-content text-base truncate">
                      {room.name}
                    </h3>
                    <div className="badge badge-primary font-bold font-mono shrink-0">
                      ${room.hourlyRate}/hr
                    </div>
                  </div>

                  {/* Statistics block inside list item */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-base-200 border border-base-300 rounded-xl text-[11px] font-mono font-bold text-base-content/70">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" /> Cap: {room.capacity}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-secondary" /> Booked: {room.bookingCount || 0}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {room.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="badge badge-neutral text-[9px] font-bold"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => navigateTo(`/rooms/${room._id}`)}
                  className="btn btn-outline btn-sm btn-block gap-1"
                >
                  Manage & Edit specifications
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
