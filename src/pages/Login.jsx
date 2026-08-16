import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@nitp.ac.in")) {
      setError("Please use your official @nitp.ac.in email address.");
      return;
    }

    try {
      await login({ email, password }, "/auth/login");
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] px-6 py-12 bg-base">
      <div className="w-full max-w-md bg-white p-8 rounded-[10px] border border-border shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-structural" />
          </div>
          <h2 className="text-2xl font-bold text-structural">Student & Staff Login</h2>
          <p className="text-sm text-structural-muted mt-2">
            Sign in with your NIT Patna official email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-structural">Institute Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-structural-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@nitp.ac.in" className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-[10px] text-base text-structural" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-structural">Password</label>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-structural-muted" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-[10px] text-base text-structural" required />
            </div>
            {error && <p className="text-[13px] text-error mt-1">{error}</p>}
          </div>

          <button type="submit" className="w-full mt-2 bg-accent text-white font-semibold py-2.5 rounded-[10px] shadow-sm hover:bg-accent-hover transition-colors">
            Sign In
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
          <p className="text-sm text-structural-muted">
            New user? <Link to="/register" className="font-semibold text-structural hover:underline">Create Account</Link>
          </p>
          <p className="text-[13px] text-structural-muted">
            Admin? <Link to="/admin-login" className="text-structural hover:underline">Admin Login</Link> · Super Admin? <Link to="/super-admin-login" className="text-structural hover:underline">Super Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;