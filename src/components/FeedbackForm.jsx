import { useState } from "react";
import { Star, Send } from "lucide-react";
import toast from "react-hot-toast";

const FeedbackForm = ({ complaint, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!complaint || !["Resolved", "Closed"].includes(complaint.status)) {
    return null;
  }

  if (complaint.feedbackGiven) {
    return (
      <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm text-center">
        <h3 className="text-lg font-bold text-structural">Feedback Already Submitted</h3>
        <p className="text-sm text-structural-muted mt-1">Thank you for helping improve campus services.</p>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      toast.success("Feedback submitted successfully");
      setComment("");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Feedback submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[10px] border border-border shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-structural">Give Feedback</h3>
        <p className="text-sm text-structural-muted mt-1">Rate the resolution quality for this complaint.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setRating(value)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  size={24}
                  className={value <= rating ? "fill-status-amber text-status-amber" : "text-border"}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-structural">{rating}/5</span>
        </div>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="w-full p-3 bg-white border border-border rounded-[10px] text-sm text-structural placeholder:text-structural-muted focus:border-accent focus:outline-none transition-colors min-h-[100px]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-[10px] shadow-sm hover:bg-accent-hover transition-colors text-sm disabled:opacity-50"
        >
          <Send size={16} />
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;