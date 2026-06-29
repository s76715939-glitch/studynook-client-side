import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import Loader from "../components/Loader.jsx";
import {
  Search,
  SlidersHorizontal,
  Users,
  Landmark,
  FilterX,
  Building,
} from "lucide-react";
import { motion } from "motion/react";
const API_URL = import.meta.env.VITE_API_URL;

const AMENITY_OPTIONS = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function Rooms() {
  const { navigateTo } = useAppRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  // Checked amenities state
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  // Additional filters state
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25);

  useEffect(() => {
    document.title = "StudyNook – Available Study Cells";
  }, []);

  // Fetch rooms based on search and selected amenities
  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/rooms?search=${encodeURIComponent(searchQuery)}`;

        selectedAmenities.forEach((amenity) => {
          url += `&amenities=${encodeURIComponent(amenity)}`;
        });

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    // Debounce the fetch just a tiny bit for search typing
    const delayDebounce = setTimeout(() => {
      fetchRooms();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedAmenities]);

  // Client-side additional filtering for extra responsive feel (Floor & Max Price)
  const filteredRooms = rooms.filter((room) => {
    if (
      selectedFloor !== "All" &&
      !room.floor.toLowerCase().includes(selectedFloor.toLowerCase())
    ) {
      return false;
    }
    if (room.hourlyRate > maxPrice) {
      return false;
    }
    return true;
  });

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedAmenities([]);
    setSelectedFloor("All");
    setMaxPrice(25);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header section */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-base-content">
          Available Study Rooms
        </h1>
        <p className="text-base-content/70 text-sm max-w-2xl font-sans">
          Whether you need a full whiteboard grid, a dynamic dual projector,
          high-speed Gigabit Wi-Fi, or absolute quiet zone compliance, find your
          optimal cell below.
        </p>
      </div>

      {/* Main Grid for filters and listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar using daisyUI components */}
        <aside className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-4 border-b border-base-300">
            <h3 className="card-title text-base-content flex items-center gap-2 text-md font-serif font-bold">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Configure Filter
            </h3>
            {(searchQuery ||
              selectedAmenities.length > 0 ||
              selectedFloor !== "All" ||
              maxPrice !== 25) && (
              <button
                onClick={clearAllFilters}
                className="btn btn-xs btn-ghost text-primary gap-1"
              >
                <FilterX className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="form-control w-full space-y-1">
            <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
              Search Space
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="e.g. Curie, Al-Ghazali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10 text-sm bg-base-200"
              />
            </div>
          </div>

          {/* Amenities Multi-Checkboxes */}
          <div className="form-control space-y-2">
            <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
              Required Perks
            </label>
            <div className="space-y-1.5">
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="label justify-start gap-3 cursor-pointer p-0"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAmenityChange(amenity)}
                      className="checkbox checkbox-primary checkbox-xs"
                    />
                    <span className="label-text text-base-content/80 text-sm select-none">
                      {amenity}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Floor selection */}
          <div className="form-control w-full space-y-1">
            <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
              Library Floor
            </label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="select select-bordered select-sm w-full bg-base-200"
            >
              <option value="All">All Floors</option>
              <option value="1st">1st Floor</option>
              <option value="2nd">2nd Floor</option>
              <option value="3rd">3rd Floor</option>
              <option value="4th">4th Floor</option>
            </select>
          </div>

          {/* Hourly Rate Slider */}
          <div className="form-control w-full space-y-2">
            <div className="flex justify-between text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
              <span>Max Hourly Rate</span>
              <span className="text-primary">${maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min="3"
              max="25"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range range-primary range-xs"
            />
            <div className="flex justify-between text-[10px] text-base-content/40 font-mono">
              <span>$3</span>
              <span>$25/hr</span>
            </div>
          </div>
        </aside>

        {/* Rooms Listing Grid */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <Loader message="Scanning study cells repository..." />
          ) : filteredRooms.length === 0 ? (
            <div className="hero bg-base-200 rounded-3xl py-16 text-center shadow-inner">
              <div className="hero-content flex-col gap-4 max-w-sm">
                <FilterX className="w-12 h-12 text-primary/60 stroke-1" />
                <h3 className="text-xl font-serif font-black text-base-content">
                  No Matching Nooks Found
                </h3>
                <p className="text-sm text-base-content/70 font-sans">
                  We couldn't find any rooms fitting your exact amenities or
                  rates. Try relaxing your filters or start fresh.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn btn-primary btn-sm mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room._id}
                  className="card card-compact bg-base-100 shadow-md hover:-translate-y-1.5 transition-all duration-200 border border-base-300"
                >
                  <figure className="relative aspect-video w-full overflow-hidden bg-base-200">
                    <img
                      src={room.image}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 badge badge-primary font-mono text-[10px] uppercase tracking-wider font-bold">
                      {room.floor}
                    </div>
                  </figure>

                  <div className="card-body">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="card-title text-base-content font-serif font-bold text-base truncate">
                        {room.name}
                      </h3>
                      <span className="badge badge-accent badge-sm font-bold text-accent-content font-mono shrink-0">
                        ${room.hourlyRate}/hr
                      </span>
                    </div>

                    <p className="text-base-content/70 text-sm line-clamp-2 h-10 font-sans leading-relaxed">
                      {room.description}
                    </p>

                    <div className="divider my-1"></div>

                    <div className="flex justify-between text-xs text-base-content/60 font-mono font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-primary" /> Max
                        Seats: {room.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-secondary" />{" "}
                        Booked: {room.bookingCount || 0}
                      </span>
                    </div>

                    {/* Amenities chips */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {room.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="badge badge-neutral badge-xs font-bold text-neutral-content"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="card-actions pt-3">
                      <button
                        onClick={() => navigateTo(`/rooms/${room._id}`)}
                        className="btn btn-primary btn-sm btn-block cursor-pointer"
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
