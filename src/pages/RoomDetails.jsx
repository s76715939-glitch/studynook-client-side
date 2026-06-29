import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "sonner";
import {
  Calendar,
  Users,
  Landmark,
  Clock,
  ShieldCheck,
  Edit,
  Trash2,
  X,
  CheckSquare,
  ChevronLeft,
  Heart,
  Award,
  Sparkles,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const AMENITY_OPTIONS = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function RoomDetails() {
  const { getParam, navigateTo } = useAppRouter();
  const { user } = useAuth();
  const roomId = getParam("id");

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Booking form states
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Edit room form states
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editCapacity, setEditCapacity] = useState(4);
  const [editRate, setEditRate] = useState(5);
  const [editAmenities, setEditAmenities] = useState([]);
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – Study Cell Details";
  }, []);

  // Fetch single room details
  const fetchRoomDetails = async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data);

        // Pre-fill edit states
        setEditName(data.name);
        setEditDesc(data.description);
        setEditImage(data.image);
        setEditFloor(data.floor);
        setEditCapacity(data.capacity);
        setEditRate(data.hourlyRate);
        setEditAmenities(data.amenities || []);
      } else {
        toast.error("Room not found or deleted.");
        navigateTo("/rooms");
      }
    } catch (err) {
      console.error("Error fetching room:", err);
      toast.error("Failed to load room details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return <Loader message="Analyzing study room configurations..." />;
  }

  if (!room) {
    return (
      <div className="hero bg-base-200 rounded-3xl py-16 text-center">
        <div className="hero-content flex-col">
          <h2 className="text-2xl font-serif font-bold text-base-content">
            Study Room Spec File Empty
          </h2>
          <button
            onClick={() => navigateTo("/rooms")}
            className="btn btn-primary btn-sm mt-3"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && room.ownerId === user._id;

  // Compute live total booking price
  const getComputedTotal = () => {
    if (!startTime || !endTime) return 0;
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    if (endHour <= startHour) return 0;
    return (endHour - startHour) * room.hourlyRate;
  };

  const handleBookNowClick = () => {
    if (!user) {
      toast.info("Please login to reserve a study lounge.");
      navigateTo("/login");
      return;
    }
    // Pre-fill default booking date to today
    const todayStr = new Date().toISOString().split("T")[0];
    setBookingDate(todayStr);
    setStartTime("09:00");
    setEndTime("11:00");
    setSpecialNote("");
    setShowBookingModal(true);
  };

  // Submit booking form
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please fill out all booking parameters.");
      return;
    }

    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    if (endHour <= startHour) {
      toast.error("End time must be after start time.");
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id,
          date: bookingDate,
          startTime,
          endTime,
          specialNote,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room booked successfully!");
        setShowBookingModal(false);
        // Refresh to show updated booking count
        fetchRoomDetails();
      } else {
        toast.error(data.error || "Failed to finalize room booking.");
      }
    } catch (err) {
      toast.error("An error occurred during booking. Please try again.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (
      !editName ||
      !editDesc ||
      !editImage ||
      !editFloor ||
      !editCapacity ||
      !editRate
    ) {
      toast.error("All room attributes are required.");
      return;
    }

    setEditSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms/${room._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          image: editImage,
          floor: editFloor,
          capacity: editCapacity,
          hourlyRate: editRate,
          amenities: editAmenities,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room updated successfully.");
        setShowEditModal(false);
        fetchRoomDetails();
      } else {
        toast.error(data.error || "Failed to update room.");
      }
    } catch (err) {
      toast.error("An error occurred while updating the room.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Submit Delete Form
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms/${room._id}`, {
        method: "DELETE",
        credentials: true,
      });
      if (res.ok) {
        toast.success("Room deleted successfully.");
        setShowDeleteModal(false);
        navigateTo("/rooms");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete room.");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the room.");
    }
  };

  const handleEditAmenityChange = (amenity) => {
    setEditAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back button breadcrumbs link */}
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <button
              onClick={() => navigateTo("/")}
              className="link hover:text-primary"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigateTo("/rooms")}
              className="link hover:text-primary"
            >
              Study Cells
            </button>
          </li>
          <li className="text-primary font-bold">{room.name}</li>
        </ul>
      </div>

      {/* Main Details Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Room Presentation */}
        <div className="lg:col-span-8 card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          <figure className="relative aspect-video w-full bg-base-200">
            <img
              src={room.image}
              alt={room.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 badge badge-neutral bg-black/75 text-white border-none font-mono text-xs uppercase tracking-widest p-3 font-bold">
              {room.floor}
            </div>
          </figure>

          <div className="card-body p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-serif font-black text-base-content leading-tight">
                  {room.name}
                </h1>
                <p className="text-accent font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Workspace ID #
                  {room._id.slice(-5)}
                </p>
              </div>

              {/* Price Tag Badge */}
              <div className="bg-primary/5 text-primary border border-primary/20 px-5 py-3 rounded-2xl shrink-0 text-center sm:text-right">
                <span className="block text-[10px] uppercase font-mono font-bold tracking-wider opacity-70">
                  Hourly Fee
                </span>
                <span className="text-2xl font-serif font-extrabold">
                  ${room.hourlyRate}/hr
                </span>
              </div>
            </div>

            {/* Stats row inside daisyUI stats container */}
            <div className="stats stats-vertical sm:stats-horizontal bg-base-200 w-full border border-base-300 rounded-2xl shadow-xs">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div className="stat-title text-[11px] uppercase tracking-wider font-bold">
                  Safe Seat Cap
                </div>
                <div className="stat-value text-base font-bold text-base-content">
                  {room.capacity} Scholars
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="stat-title text-[11px] uppercase tracking-wider font-bold">
                  Floor Level
                </div>
                <div className="stat-value text-base font-bold text-base-content">
                  {room.floor}
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="stat-title text-[11px] uppercase tracking-wider font-bold">
                  Total Reservations
                </div>
                <div className="stat-value text-base font-bold text-base-content">
                  {room.bookingCount || 0} times
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-base-content">
                About this study room
              </h3>
              <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-line font-sans">
                {room.description}
              </p>
            </div>

            {/* Equipped Perks */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-base-content/60 uppercase tracking-widest">
                Equipped Perks & Infrastructure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 bg-base-200 border border-base-300 rounded-xl"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    <span className="text-xs font-bold text-base-content/80">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Control Actions Panel */}
            {isOwner && (
              <div className="alert alert-neutral shadow-sm rounded-2xl flex justify-between items-center p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
                  <span className="text-xs font-mono font-bold">
                    You listed this study space
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="btn btn-xs btn-outline btn-primary gap-1"
                  >
                    <Edit className="w-3 h-3" /> Edit Specs
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-xs btn-outline btn-error gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Direct Reservation Ticket */}
        <div className="lg:col-span-4 card bg-base-200 border border-base-300 p-6 space-y-6 shadow-md lg:sticky lg:top-24">
          <div className="space-y-1.5">
            <span className="badge badge-accent font-mono text-[10px] uppercase font-bold tracking-widest p-2">
              Reservation Center
            </span>
            <h3 className="font-serif font-black text-base-content text-xl">
              Secure This Space
            </h3>
            <p className="text-base-content/70 text-xs font-sans leading-relaxed">
              Verify your hours. The conflict checker protects your slots,
              making overlapping selections impossible.
            </p>
          </div>

          <div className="p-4 bg-base-100 border border-base-300 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-base-content/70">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold">Operational hours</span>
            </div>
            <span className="text-xs font-mono font-bold badge badge-neutral">
              08:00 - 20:00 Daily
            </span>
          </div>

          <button
            onClick={handleBookNowClick}
            className="btn btn-primary btn-block btn-lg shadow-lg gap-2 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            {user ? "Book Selected Slot" : "Login to Request Booking"}
          </button>

          <div className="pt-4 border-t border-base-300">
            <div className="flex gap-2.5">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-[11px] text-base-content/60 leading-relaxed font-sans">
                <strong>Instant Conflict Block</strong>: The system verifies
                interval boundaries. If any student has confirmed any segment of
                your requested time, the form automatically blocks submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL 1: BOOKING FORM MODAL (daisyUI styled)
          ======================================================== */}
      {showBookingModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md bg-base-100 border border-base-300 rounded-3xl p-0 overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-base-300 flex justify-between items-center bg-base-200">
              <div>
                <h3 className="font-serif font-bold text-lg text-base-content">
                  Book {room.name}
                </h3>
                <p className="text-xs text-base-content/60 font-mono">
                  Rate: ${room.hourlyRate}/hr
                </p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {/* Datepicker */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                  Reservation Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="input input-bordered w-full bg-base-200 text-sm cursor-pointer"
                />
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control w-full space-y-1">
                  <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                    Start Hour
                  </label>
                  <select
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="select select-bordered w-full bg-base-200 text-sm"
                  >
                    <option value="">Select</option>
                    {TIME_SLOTS.slice(0, -1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full space-y-1">
                  <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                    End Hour
                  </label>
                  <select
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="select select-bordered w-full bg-base-200 text-sm"
                  >
                    <option value="">Select</option>
                    {TIME_SLOTS.filter((t) => t > startTime).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Note */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                  Desk Request Note (optional)
                </label>
                <textarea
                  placeholder="e.g. Extra dry-erase markers, dual boards..."
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  rows={2}
                  className="textarea textarea-bordered bg-base-200 text-sm resize-none"
                />
              </div>

              {/* Real-time Pricing Summary card */}
              {startTime && endTime && getComputedTotal() > 0 && (
                <div className="alert alert-warning shadow-xs rounded-xl flex justify-between items-center p-4">
                  <div>
                    <span className="block text-[9px] font-mono font-bold uppercase tracking-wide opacity-75">
                      Rent Duration
                    </span>
                    <span className="text-xs font-bold">
                      {parseInt(endTime.split(":")[0]) -
                        parseInt(startTime.split(":")[0])}{" "}
                      hours slot
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-mono font-bold uppercase tracking-wide opacity-75">
                      Estimated Total
                    </span>
                    <span className="text-base font-serif font-black text-warning-content">
                      ${getComputedTotal()} USD
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="btn btn-ghost flex-1 btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="btn btn-primary flex-1 btn-sm shadow-sm"
                >
                  {bookingSubmitting ? "Locking hours..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: EDIT ROOM SPECIFICATIONS (daisyUI styled)
          ======================================================== */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg bg-base-100 border border-base-300 rounded-3xl p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-base-300 flex justify-between items-center bg-base-200 shrink-0">
              <h3 className="font-serif font-bold text-lg text-base-content">
                Update Cell specifications
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form
              onSubmit={handleEditSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Room Name */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                  Study Room Title
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input input-bordered w-full bg-base-200"
                />
              </div>

              {/* Room Description */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                  Room Prospectus / Description
                </label>
                <textarea
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="textarea textarea-bordered w-full bg-base-200 resize-none text-sm"
                />
              </div>

              {/* Image URL */}
              <div className="form-control w-full space-y-1">
                <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                  Unsplash Image Link
                </label>
                <input
                  type="url"
                  required
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="input input-bordered w-full bg-base-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Floor */}
                <div className="form-control w-full space-y-1">
                  <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                    Floor Level
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3rd Floor"
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                    className="input input-bordered w-full bg-base-200 text-sm"
                  />
                </div>

                {/* Capacity */}
                <div className="form-control w-full space-y-1">
                  <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                    Capacity Size
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                    className="input input-bordered w-full bg-base-200 text-sm"
                  />
                </div>

                {/* Hourly Rate */}
                <div className="form-control w-full space-y-1">
                  <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                    Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className="input input-bordered w-full bg-base-200 text-sm"
                  />
                </div>
              </div>

              {/* Amenities checklist */}
              <div className="form-control space-y-2">
                <label className="label text-[11px] font-bold text-base-content/60 uppercase tracking-wider font-mono">
                  Modify Provided Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isChecked = editAmenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 p-2 bg-base-200 border border-base-300 rounded-xl cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleEditAmenityChange(amenity)}
                          className="checkbox checkbox-primary checkbox-xs"
                        />
                        <span className="font-bold text-base-content/80">
                          {amenity}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 pt-4 border-t border-base-300 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-ghost flex-1 btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="btn btn-primary flex-1 btn-sm"
                >
                  {editSubmitting ? "Saving..." : "Apply Specifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: DELETE CONFIRMATION MODAL (daisyUI styled)
          ======================================================== */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm bg-base-100 border border-base-300 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-base-content">
                De-list Study lounge?
              </h3>
              <p className="text-base-content/70 text-xs font-sans leading-relaxed">
                Are you absolutely sure you want to permanently discard{" "}
                <strong>{room.name}</strong> from our student index? This cannot
                be restored.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-sm btn-ghost flex-1"
              >
                No, Keep
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-sm btn-error flex-1"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
