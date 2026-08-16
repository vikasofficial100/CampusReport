import { useState } from "react"; 
import {
  Camera,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react"; 
import toast from "react-hot-toast"; 
import useAuth from "../hooks/useAuth"; 
import { updateMyProfile } from "../services/authService"; 
import {
  removeProfileImage,
  uploadProfileImage,
} from "../services/uploadService"; 

const ProfileSettings = () => {
  const { user, refreshProfile } = useAuth(); 

  const [formData, setFormData] = useState({
    name: user?.name || "", 
    phone: user?.phone || "", 
    city: user?.city || "", 
    address: user?.address || "", 
  }); 

  const [preview, setPreview] = useState(user?.profileImage || ""); 
  const [saving, setSaving] = useState(false); 
  const [uploading, setUploading] = useState(false); 

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U"; 

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev, 
      [event.target.name]: event.target.value, 
    })); 
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0]; 

    if (!file) return; 

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]; 

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed."); 
      return; 
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB."); 
      return; 
    }

    setPreview(URL.createObjectURL(file)); 
    setUploading(true); 

    try {
      await uploadProfileImage(file); 
      await refreshProfile(); 
      toast.success("Profile picture updated"); 
    } catch (error) {
      toast.error(error.message || "Profile image upload failed"); 
      setPreview(user?.profileImage || ""); 
    } finally {
      setUploading(false); 
    }
  };

  const handleRemoveImage = async () => {
    setUploading(true); 

    try {
      await removeProfileImage(); 
      setPreview(""); 
      await refreshProfile(); 
      toast.success("Profile picture removed"); 
    } catch (error) {
      toast.error(error.message || "Remove failed"); 
    } finally {
      setUploading(false); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setSaving(true); 

    try {
      await updateMyProfile(formData); 
      await refreshProfile(); 
      toast.success("Profile updated successfully"); 
    } catch (error) {
      toast.error(error.message || "Profile update failed"); 
    } finally {
      setSaving(false); 
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      
      {/* Header Section */}
      <section className="max-w-6xl mx-auto mb-10">
        <span className="text-[12px] font-bold text-structural-muted uppercase tracking-wider block mb-2">
          Account Settings 
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
          Profile Settings 
        </h1>
        <p className="text-[15px] text-structural-muted max-w-2xl">
          Edit your profile information and profile picture. 
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Photo Card */}
        <section className="bg-white p-8 rounded-[10px] border border-border shadow-sm flex flex-col items-center text-center h-fit">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border border-border overflow-hidden bg-structural/10 text-structural flex items-center justify-center text-4xl font-extrabold">
              {preview ? (
                <img className="w-full h-full object-cover" src={preview} alt={user?.name} /> 
              ) : (
                <span>{avatarLetter}</span> 
              )}
            </div>

            <label className="absolute bottom-0 right-0 w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center text-structural hover:bg-base transition-colors cursor-pointer shadow-sm">
              <Camera size={18} /> 
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp" 
                onChange={handleProfileImageChange} 
              />
            </label>
          </div>

          <h2 className="text-xl font-bold text-structural mb-1">{user?.name}</h2> 
          <p className="text-[14px] text-structural-muted mb-4">{user?.email}</p> 

          <div className="inline-flex items-center gap-1.5 bg-structural/10 text-structural text-[11px] font-bold px-3 py-1.5 rounded-[6px] uppercase tracking-wider mb-8">
            <ShieldCheck size={16} /> 
            {user?.role?.replaceAll("_", " ")} 
          </div>

          <div className="w-full space-y-3 pt-6 border-t border-border">
            <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-structural/10 text-structural hover:bg-structural/20 font-bold text-[13px] rounded-[8px] transition-colors cursor-pointer">
              <Camera size={16} /> 
              {uploading ? "Uploading..." : "Upload Photo"} 
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp" 
                onChange={handleProfileImageChange} 
              />
            </label>

            <button
              type="button"
              onClick={handleRemoveImage} 
              disabled={uploading || !preview} 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fecaca] font-bold text-[13px] rounded-[8px] transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} /> 
              Remove 
            </button>
          </div>
        </section>

        {/* Right Column: Edit Profile Form */}
        <section className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
          <h2 className="text-[15px] font-bold text-structural uppercase tracking-wider mb-6 border-b border-border pb-3">
            Edit Profile 
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Full Name 
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" /> 
                  <input
                    name="name"
                    placeholder="Enter full name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Email Address (Verified) 
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted/50" /> 
                  <input 
                    value={user?.email || ""} 
                    disabled 
                    className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural-muted opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Phone Number 
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" /> 
                  <input
                    name="phone"
                    placeholder="Enter phone number" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  City 
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" /> 
                  <input
                    name="city"
                    placeholder="Enter city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                Address 
              </label>
              <textarea
                name="address"
                placeholder="Enter full address" 
                value={formData.address} 
                onChange={handleChange} 
                rows="3"
                className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-border">
              <button 
                type="submit" 
                disabled={saving} 
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent text-white font-bold rounded-[8px] hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                <Save size={18} /> 
                {saving ? "Saving..." : "Save Profile"} 
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
};

export default ProfileSettings; 