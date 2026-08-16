import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { USER_ROLES, normalizeRole } from "../utils/rolePermissions";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const loggedInUser = await login(formData, "/auth/login"); // Endpoint remains the same

      if (normalizeRole(loggedInUser?.role) !== USER_ROLES.SUPER_ADMIN) {
        await logout({ silent: true }); // Prevent wrong role access[cite: 19]
        const message = "This login page is only for Super Admin accounts.";
        setError(message);
        toast.error(message);
        return;
      }

      navigate("/super-admin-dashboard");
    } catch (err) {
      const message = err.message || "Super Admin login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] px-6 py-12 bg-base">
      <div className="w-full max-w-md bg-white p-8 rounded-[10px] border border-border shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-accent/10 rounded-[10px] flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-structural">Super Admin</h2>
          <p className="text-sm text-structural-muted mt-2">
            System control and master configuration.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-structural">Super Admin Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-structural-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="master@nitp.ac.in"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  error ? "border-error focus:outline-error/20" : "border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15"
                } rounded-[10px] text-base text-structural transition-colors`}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-structural">Password</label>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-structural-muted" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  error ? "border-error focus:outline-error/20" : "border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15"
                } rounded-[10px] text-base text-structural transition-colors`}
                required
              />
            </div>
            {error && <p className="text-[13px] text-error mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-accent text-white font-semibold py-2.5 rounded-[10px] shadow-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Enter System"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
          <p className="text-sm text-structural-muted">
            Are you a student? <Link to="/login" className="font-semibold text-structural hover:underline">Student Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
