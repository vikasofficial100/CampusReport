import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Camera, ShieldCheck, Trash2, UserPlus, Mail, Lock, Phone } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { getDashboardPathByRole, normalizeRole, USER_ROLES } from "../utils/rolePermissions";
import { uploadProfileImage } from "../services/uploadService";

const Register = () => {
  const { register, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State strictly matches the User.js schema[cite: 18]
  const [formData, setFormData] = useState({
    role: USER_ROLES.STUDENT,
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const avatarLetter = formData.name?.charAt(0)?.toUpperCase() || "U";

  const handleChange = (event) => {
    setErrors((prev) => ({ ...prev, [event.target.name]: "" }));
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be less than 5MB.");
      return;
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setProfileImage(null);
    setProfilePreview("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.endsWith("@nitp.ac.in")) {
      newErrors.email = "You must use an official @nitp.ac.in email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...submitData } = formData;
      const registeredUser = await register(submitData, { silent: true });

      if (profileImage) {
        await uploadProfileImage(profileImage);
        await refreshProfile();
      }

      // Admin registration pending approval logic[cite: 11]
      if (normalizeRole(registeredUser.role) === USER_ROLES.ADMIN) {
        await logout({ silent: true });
        toast.success("Admin request submitted. Please wait for Super Admin approval.");
        navigate("/admin-login", { replace: true });
        return;
      }

      toast.success("Account created successfully");
      const redirectPath = location.state?.from?.pathname;
      navigate(redirectPath || getDashboardPathByRole(registeredUser.role), {
        replace: true,
      });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] px-6 py-12 bg-base">
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-[10px] border border-border shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-structural/10 rounded-[10px] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-structural" />
          </div>
          <h2 className="text-2xl font-bold text-structural">Create Account</h2>
          <p className="text-sm text-structural-muted mt-2">
            Register as a student, department staff, or admin.
          </p>
        </div>

        {/* Profile Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-base rounded-[10px] border border-border">
          <div className="relative">
            {profilePreview ? (
              <img src={profilePreview} alt="Profile preview" className="w-20 h-20 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-structural/10 flex items-center justify-center text-2xl font-bold text-structural">
                {avatarLetter}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-structural">Profile Picture</h3>
            <p className="text-[13px] text-structural-muted mb-3">Upload a clear profile image (JPG, PNG). Max 5MB.</p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <label className="cursor-pointer px-4 py-2 bg-white border border-border rounded-[6px] text-[13px] font-medium text-structural hover:bg-base-alt transition-colors inline-flex items-center gap-1.5">
                <Camera size={14} />
                Choose Photo
                <input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageChange} />
              </label>
              {profilePreview && (
                <button type="button" onClick={removeSelectedImage} className="px-4 py-2 bg-white border border-border rounded-[6px] text-[13px] font-medium text-error hover:bg-error/5 transition-colors inline-flex items-center gap-1.5">
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-structural">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15 rounded-[10px] text-base text-structural transition-colors appearance-none"
            >
              <option value={USER_ROLES.STUDENT}>Student</option>
              <option value={USER_ROLES.STAFF}>Department Staff</option>
              <option value={USER_ROLES.ADMIN}>Admin Request</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Fields mapped to User Schema */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-structural">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-error focus:outline-error/20' : 'border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15'} rounded-[10px] text-base text-structural`} />
              {errors.name && <p className="text-[13px] text-error mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-structural">Institute Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-structural-muted" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@nitp.ac.in" className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-error focus:outline-error/20' : 'border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15'} rounded-[10px] text-base text-structural`} />
              </div>
              {errors.email && <p className="text-[13px] text-error mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-medium text-structural">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3 text-structural-muted" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className="w-full pl-10 pr-4 py-2.5 bg-white border border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15 rounded-[10px] text-base text-structural" />
              </div>
            </div>

            {/* Passwords */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-structural">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-structural-muted" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.password ? 'border-error focus:outline-error/20' : 'border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15'} rounded-[10px] text-base text-structural`} />
              </div>
              {errors.password && <p className="text-[13px] text-error mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-structural">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-structural-muted" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.confirmPassword ? 'border-error focus:outline-error/20' : 'border-border focus:border-accent focus:outline-[2px] focus:outline-accent/15'} rounded-[10px] text-base text-structural`} />
              </div>
              {errors.confirmPassword && <p className="text-[13px] text-error mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {formData.role === USER_ROLES.ADMIN && (
            <div className="p-4 bg-status-amber/10 border border-status-amber/30 rounded-[10px] text-sm text-structural font-medium">
              Note: Admin accounts require approval[cite: 18]. You will only be able to log in after a Super Admin verifies your account.
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3 rounded-[14px] shadow-sm hover:bg-accent-hover transition-colors">
            <UserPlus size={20} />
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
          <p className="text-sm text-structural-muted">
            Already have an account? <Link to="/login" className="font-semibold text-structural hover:underline">Student Login</Link>
          </p>
          <p className="text-[13px] text-structural-muted">
            Admin? <Link to="/admin-login" className="text-structural hover:underline">Admin Login</Link> · Super Admin? <Link to="/super-admin-login" className="text-structural hover:underline">Super Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
