import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Lock, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { resetPasswordWithOTP } from "../services/otpService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultEmail = useMemo(
    () => searchParams.get("email") || "",
    [searchParams]
  );

  const [formData, setFormData] = useState({
    email: defaultEmail,
    otp: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPasswordWithOTP(formData);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      const message = err.message || "Password reset failed.";
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
            <MailCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-structural mb-1">
            Reset Password
          </h1>
          <p className="text-[14px] text-structural-muted">
            Enter OTP and create your new password.
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
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
              OTP Code
            </label>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              maxLength="6"
              required
              className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural text-center tracking-widest font-mono focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
              <input
                type="password"
                name="newPassword"
                placeholder="Create new password"
                value={formData.newPassword}
                onChange={handleChange}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-[14px] text-structural-muted">
            Need new OTP?{" "}
            <Link to="/forgot-password" className="font-bold text-structural hover:text-accent transition-colors">
              Send again
            </Link>
          </p>
        </div>

      </section>
    </main>
  );
};

export default ResetPassword;