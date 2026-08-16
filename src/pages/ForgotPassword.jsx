import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { sendForgotPasswordOTP } from "../services/otpService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendForgotPasswordOTP({ email });
      toast.success("OTP sent to your Gmail");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err.message || "Failed to send OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12 flex items-center justify-center">
      <section className="bg-white p-8 md:p-10 rounded-[10px] border border-border shadow-sm max-w-md w-full">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-structural/10 rounded-[10px] flex items-center justify-center text-structural mb-4">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-bold text-structural mb-1">
            Forgot Password
          </h1>
          <p className="text-[14px] text-structural-muted">
            Enter your registered email to receive a secure OTP.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-error/10 border border-error/20 text-error text-[13px] font-medium p-3 rounded-[8px] mb-6 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
              <input
                type="email"
                placeholder="Enter your registered Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-[8px] shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50 mt-2"
          >
            <KeyRound size={18} />
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

      </section>
    </main>
  );
};

export default ForgotPassword;