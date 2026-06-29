import React, { useEffect, useState } from "react";
import { useAppRouter } from "../context/RouteContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  HelpCircle,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
export default function MyBookings() {
  const { navigateTo } = useAppRouter();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – My Desk Ledger";

    if (!user) {
      toast.info("Please login to see your room reservation ledger.");
      navigateTo("/login");
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/my`);
      if (res.ok) {
        const data = await res.json();
        // Sort bookings with confirmed first and descending order of date
        const sorted = data.sort((a, b) => {
          if (a.status === b.status) {
            return b.date.localeCompare(a.date);
          }
          return a.status === "confirmed" ? -1 : 1;
        });
        setBookings(sorted);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load your study bookings ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `${API_URL}/api/bookings/${selectedBooking._id}/cancel`,
        {
          method: "PATCH",
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Booking cancelled successfully.");
        setShowCancelModal(false);
        fetchBookings(); // Refresh list
      } else {
        toast.error(data.error || "Failed to cancel booking.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setCancelling(false);
      setSelectedBooking(null);
    }
  };

  if (!user) {
    return null;
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <span className="badge badge-accent font-mono text-xs font-bold uppercase tracking-widest p-3">
          Personal Register
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-base-content leading-tight">
          My Desk Reservations
        </h1>
        <p className="text-base-content/70 text-sm font-sans max-w-xl">
          Review, trace, and manage your booked academic slots. Cancellations
          are instant and immediately release desk resources for peer scholars.
        </p>
      </div>

      {loading ? (
        <Loader message="Scanning active study registers..." />
      ) : bookings.length === 0 ? (
        <div className="hero bg-base-200 border border-base-300 py-16 text-center rounded-3xl">
          <div className="hero-content flex-col gap-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="font-serif font-bold text-xl text-base-content">
                No Active Reservations Found
              </h3>
              <p className="text-base-content/75 text-sm font-sans leading-relaxed">
                You haven't reserved any study cell sessions yet. Scan our live
                academic catalog to secure your premium desk hours.
              </p>
            </div>
            <button
              onClick={() => navigateTo("/rooms")}
              className="btn btn-primary btn-sm mt-2"
            >
              Explore Available Study Rooms
            </button>
          </div>
        </div>
      ) : (
        /* Render bookings table or grid card layout */
        <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-base-200 text-xs font-bold uppercase font-mono text-base-content/65 border-b border-base-300">
                  <th className="py-4 px-6">Room / Study Lounge</th>
                  <th className="py-4 px-6">Reserved Slot</th>
                  <th className="py-4 px-6">Total Cost</th>
                  <th className="py-4 px-6">Status Badge</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300 text-sm text-base-content/85">
                {bookings.map((booking) => {
                  const isConfirmed = booking.status === "confirmed";
                  const isFuture = booking.date >= todayStr;
                  const canCancel = isConfirmed && isFuture;

                  return (
                    <tr key={booking._id} className="hover">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              booking.room?.image ||
                              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120"
                            }
                            alt={booking.room?.name || "Deleted Room"}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-base-300"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-base-content">
                              {booking.room?.name || "Unlisted Room (Deleted)"}
                            </h4>
                            <span className="text-xs font-mono font-bold text-base-content/40 flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3 text-accent" /> ID #
                              {booking._id.slice(-5)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-base-content">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-base-content/60">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          <span>
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold font-mono text-base-content">
                        ${booking.totalCost} USD
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`badge font-bold p-3 gap-1 ${
                            isConfirmed ? "badge-success" : "badge-error"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-current ${isConfirmed ? "animate-pulse" : ""}`}
                          />
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {canCancel ? (
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="btn btn-xs btn-outline btn-error"
                          >
                            Cancel Slot
                          </button>
                        ) : (
                          <span className="text-xs text-base-content/50 italic font-mono">
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-base-300">
            {bookings.map((booking) => {
              const isConfirmed = booking.status === "confirmed";
              const isFuture = booking.date >= todayStr;
              const canCancel = isConfirmed && isFuture;

              return (
                <div key={booking._id} className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        booking.room?.image ||
                        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120"
                      }
                      alt={booking.room?.name || "Deleted Room"}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-base-content">
                        {booking.room?.name || "Unlisted Room (Deleted)"}
                      </h4>
                      <span className="text-[10px] text-base-content/40 font-mono block font-bold">
                        Reservation #{booking._id.slice(-5)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-base-200 p-2.5 rounded-xl border border-base-300">
                      <span className="text-[10px] text-base-content/50 font-mono font-bold uppercase tracking-wider block">
                        Date
                      </span>
                      <div className="flex items-center gap-1 font-bold text-base-content">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{booking.date}</span>
                      </div>
                    </div>

                    <div className="space-y-1 bg-base-200 p-2.5 rounded-xl border border-base-300">
                      <span className="text-[10px] text-base-content/50 font-mono font-bold uppercase tracking-wider block">
                        Timing
                      </span>
                      <div className="flex items-center gap-1 font-bold text-base-content">
                        <Clock className="w-3.5 h-3.5 text-secondary" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-base-content/50 font-mono font-bold uppercase tracking-wider block">
                        Total Cost
                      </span>
                      <span className="font-mono font-extrabold text-base-content">
                        ${booking.totalCost} USD
                      </span>
                    </div>

                    <div>
                      <span
                        className={`badge font-bold p-2.5 ${
                          isConfirmed ? "badge-success" : "badge-error"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {canCancel && (
                    <button
                      onClick={() => handleCancelClick(booking)}
                      className="btn btn-outline btn-error btn-sm btn-block mt-1"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CANCELLATION CONFIRMATION
          ======================================================== */}
      {showCancelModal && selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm bg-base-100 border border-base-300 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-warning/15 text-warning flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-base-content">
                Release Study Slot?
              </h3>
              <p className="text-base-content/75 text-xs font-sans leading-relaxed">
                Are you sure you want to cancel your reservation for{" "}
                <strong>{selectedBooking.room?.name}</strong> on{" "}
                <strong>{selectedBooking.date}</strong>?
              </p>
              <div className="badge badge-warning text-[10px] font-mono uppercase tracking-wider p-2.5">
                This releases hours to peers instantly
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-base-300">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-sm btn-ghost flex-1"
              >
                No, Keep
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancelling}
                className="btn btn-sm btn-error flex-1"
              >
                {cancelling ? "Releasing..." : "Yes, Release"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
