import { useState } from "react";
import { Mail, MapPinned, SearchCheck, ShieldCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  sendComplaintTrackingOTP,
  verifyComplaintTrackingOTP,
} from "../services/otpService"; //[cite: 25]
import StatusBadge from "../components/StatusBadge"; //[cite: 25]
import UrgencyBadge from "../components/UrgencyBadge"; //[cite: 25]
import ComplaintTimeline from "../components/ComplaintTimeline"; //[cite: 25]

const TrackComplaint = () => {
  const [step, setStep] = useState("send"); //[cite: 25]
  const [formData, setFormData] = useState({
    complaintId: "",
    email: "",
    otp: "",
  }); //[cite: 25]

  const [trackingData, setTrackingData] = useState(null); //[cite: 25]
  const [loading, setLoading] = useState(false); //[cite: 25]
  const [error, setError] = useState(""); //[cite: 25]

  const handleChange = (event) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }; //[cite: 25]

  const handleSendOTP = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendComplaintTrackingOTP({
        complaintId: formData.complaintId.trim(),
        email: formData.email.trim(),
      }); //[cite: 25]

      toast.success("Tracking OTP sent to your Gmail"); //[cite: 25]
      setStep("verify"); //[cite: 25]
    } catch (err) {
      const message = err.message || "Failed to send tracking OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }; //[cite: 25]

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyComplaintTrackingOTP(formData); //[cite: 25]
      setTrackingData(data); //[cite: 25]
      toast.success("Complaint verified"); //[cite: 25]
      setStep("result"); //[cite: 25]
    } catch (err) {
      const message = err.message || "Invalid OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }; //[cite: 25]

  const complaint = trackingData?.complaint; //[cite: 25]
  const timeline = trackingData?.timeline || []; //[cite: 25]

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12 flex flex-col items-center">
      
      {/* Header Section */}
      <section className="text-center max-w-2xl w-full mb-10">
        <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-2">
          Secure Complaint Tracking
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
          Track Your Complaint
        </h1>
        <p className="text-[15px] text-structural-muted">
          Use your Complaint ID and registered email to securely view progress.
        </p>
      </section>

      {/* OTP Authentication Cards */}
      {step !== "result" && (
        <section className="bg-white p-8 md:p-10 rounded-[10px] border border-border shadow-sm max-w-md w-full">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-bold text-structural">
              {step === "send" ? "Send Tracking OTP" : "Verify OTP"}
            </h2>
            <p className="text-[14px] text-structural-muted mt-1">
              {step === "send"
                ? "Enter your Complaint ID and registered email."
                : "Enter the 6-digit OTP sent to your email."}
            </p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-[13px] font-medium p-3 rounded-[8px] mb-6 text-center">
              {error}
            </div>
          )}

          {step === "send" ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Complaint ID
                </label>
                <div className="relative">
                  <SearchCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
                  <input
                    name="complaintId"
                    placeholder="e.g. CFX-2026-00045"
                    value={formData.complaintId}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter registered Gmail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-accent text-white font-bold rounded-[8px] hover:bg-accent/90 transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  OTP Code
                </label>
                <input
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength="6"
                  required
                  className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural text-center tracking-widest font-mono focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-accent text-white font-bold rounded-[8px] hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Track"}
              </button>

              <button
                type="button"
                onClick={() => setStep("send")}
                className="w-full py-3 bg-transparent text-structural-muted font-semibold text-sm hover:text-structural transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={16} /> Change Details
              </button>
            </form>
          )}
        </section>
      )}

      {/* Tracking Result View */}
      {step === "result" && complaint && (
        <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Complaint Details */}
          <div className="bg-white p-8 rounded-[10px] border border-border shadow-sm flex flex-col h-full">
            <span className="inline-block bg-structural/10 text-structural text-xs font-bold px-2.5 py-1 rounded-[6px] mb-4 w-max font-mono">
              {complaint.complaintId}
            </span>
            <h2 className="text-2xl font-bold text-structural mb-4 leading-tight">
              {complaint.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <StatusBadge status={complaint.status} />
              <UrgencyBadge urgency={complaint.urgency} />
            </div>

            <p className="text-[15px] text-structural-muted leading-relaxed mb-8 flex-grow">
              {complaint.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div>
                <span className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1">Category</span>
                <strong className="text-[14px] text-structural">{complaint.category}</strong>
              </div>
              <div>
                <span className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1">Department</span>
                <strong className="text-[14px] text-structural">{complaint.department}</strong>
              </div>
              <div>
                <span className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1">AI Score</span>
                <strong className="text-[14px] text-structural">{complaint.aiScore}/100</strong>
              </div>
              <div>
                <span className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-1">Location</span>
                <strong className="text-[14px] text-structural truncate block" title={complaint.location?.address}>
                  {complaint.location?.address || "N/A"}
                </strong>
              </div>
            </div>
          </div>

          {/* Right Column: Status Timeline */}
          <div className="bg-white p-8 rounded-[10px] border border-border shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-structural mb-6 pb-4 border-b border-border">
              <MapPinned size={20} className="text-accent" />
              Status Timeline
            </h2>
            <div className="pl-2">
              <ComplaintTimeline timeline={timeline} />
            </div>
          </div>
          
        </section>
      )}
    </main>
  );
};

export default TrackComplaint;