import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { getAllFeedbacks } from "../services/feedbackService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedbacks();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <Loader text="Loading feedbacks..." />;
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      
      {/* Header Section */}
      <section className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
          Citizen Feedback
        </h1>
        <p className="text-[15px] text-structural-muted max-w-2xl">
          Review citizen satisfaction and resolution quality.
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {feedbacks.length === 0 ? (
          <EmptyState 
            title="No feedback yet" 
            message="Resolved complaints will collect feedback here." 
          />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((item) => (
              <article 
                className="bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm flex flex-col h-full" 
                key={item._id}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <span className="inline-block bg-structural/10 text-structural text-xs font-bold px-2.5 py-1 rounded-[6px] font-mono">
                    {item.complaintId}
                  </span>
                  <MessageSquare size={20} className="text-structural-muted" />
                </div>

                {/* Complaint Title */}
                <h3 className="text-[16px] font-bold text-structural mb-3 leading-snug">
                  {item.complaint?.title || "Complaint Feedback"}
                </h3>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star 
                      key={index} 
                      size={18} 
                      className="text-accent fill-accent" 
                    />
                  ))}
                  <strong className="text-[14px] text-structural ml-2">
                    {item.rating}/5
                  </strong>
                </div>

                {/* Comment Text */}
                <p className="text-[14px] text-structural-muted leading-relaxed flex-grow italic">
                  "{item.comment || "No comment added."}"
                </p>

                {/* Card Footer (Metadata) */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <small className="text-[12px] font-bold text-structural-muted">
                    By {item.citizen?.name || "Student"}
                  </small>
                  <small className="text-[11px] font-bold text-structural-muted bg-base px-2 py-1 rounded-[4px] border border-border uppercase tracking-wider">
                    Trust: {item.citizen?.trustScore || 50}
                  </small>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
      
    </main>
  );
};

export default Feedback;