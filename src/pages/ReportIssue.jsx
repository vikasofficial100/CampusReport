import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Brain,
  FilePlus2,
  ImagePlus,
  LocateFixed,
  MapPin,
  UploadCloud,
  X,
  Building
} from "lucide-react";
import toast from "react-hot-toast";
import { analyzeComplaint } from "../services/aiService";
import { createComplaint } from "../services/complaintService";
import { uploadComplaintImage } from "../services/uploadService";
import PriorityScoreCard from "../components/PriorityScoreCard";
import DuplicateAlertBox from "../components/DuplicateAlertBox";

const categoryOptions = [
  { value: "", label: "Auto Detect by AI" },
  { value: "hostel", label: "Hostel" },
  { value: "mess", label: "Mess & Dining" },
  { value: "electrical", label: "Electricity" },
  { value: "water_plumbing", label: "Water & Plumbing" },
  { value: "civil_infrastructure", label: "Civil & Infrastructure" },
  { value: "sanitation_waste", label: "Sanitation & Waste" },
  { value: "security_safety", label: "Security & Safety" },
  { value: "medical_health", label: "Medical & Health" },
  { value: "it_internet", label: "IT & Internet" },
  { value: "library", label: "Library" },
  { value: "cse", label: "CSE Department" },
  { value: "ece", label: "ECE Department" },
  { value: "ee", label: "EE Department" },
  { value: "mechanical", label: "Mechanical Department" },
  { value: "civil", label: "Civil Department" },
  { value: "architecture", label: "Architecture Department" },
  { value: "student_welfare", label: "Student Welfare" },
  { value: "other", label: "Other" },
];

const ReportIssue = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    campus: "", 
    address: "",
    city: "Patna",
    state: "Bihar",
    lat: "",
    lng: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (event) => {
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
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage("");
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const validateBasic = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return false;
    }
    if (!formData.campus) {
      toast.error("Please select a campus");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Specific location is required");
      return false;
    }
    return true;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        toast.success("Location captured successfully");
        setLocationLoading(false);
      },
      () => {
        toast.error("Unable to get location. Please enter manually.");
        setLocationLoading(false);
      }
    );
  };

  const handleAnalyze = async () => {
    if (!validateBasic()) return;

    setAnalyzing(true);
    setAnalysis(null);

    try {
      const data = await analyzeComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      });

      setAnalysis(data.analysis);
      toast.success("AI analysis completed");
    } catch (error) {
      toast.error(error.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateBasic()) return;

    setSubmitting(true);
    setDuplicate(null);

    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedImage) {
        toast.loading("Uploading image...", { id: "image-upload" });
        const uploadData = await uploadComplaintImage(selectedImage);
        finalImageUrl = uploadData.imageUrl;
        toast.success("Image uploaded", { id: "image-upload" });
      }

      // Combine campus and specific address into the single address string for the backend
      const combinedAddress = `${formData.campus} - ${formData.address.trim()}`;

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: finalImageUrl,
        location: {
          address: combinedAddress,
          city: formData.city,
          state: formData.state,
          lat: formData.lat ? Number(formData.lat) : null,
          lng: formData.lng ? Number(formData.lng) : null,
        },
      };

      const data = await createComplaint(payload);

      setAnalysis({
        category: data.complaint.category,
        urgency: data.complaint.urgency,
        aiScore: data.complaint.aiScore,
        department: data.complaint.department,
        aiReason: data.complaint.aiReason,
      });

      setDuplicate(data.duplicate);

      toast.success("Complaint submitted successfully");

      setTimeout(() => {
        navigate(`/complaints/${data.complaint._id}`);
      }, 900);
    } catch (error) {
      toast.error(error.message || "Complaint submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base p-6 md:p-12">
      
      {/* Header Section */}
      <section className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-structural mb-3">
          Report a Campus Issue
        </h1>
        <p className="text-[15px] text-structural-muted max-w-2xl">
          Submit issue details with location. Our AI will analyze category, priority, urgency, and handle department routing.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Column (Takes up 2/3 of space on desktop) */}
        <section className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[10px] border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                Issue Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Example: Broken streetlight near Hostel 4"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the issue clearly..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors appearance-none"
              >
                {categoryOptions.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-base border border-border/70 rounded-[8px]">
              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Upload Issue Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full py-4 border-2 border-dashed border-border rounded-[8px] flex flex-col items-center justify-center text-structural-muted bg-white hover:bg-border/30 transition-colors">
                    <UploadCloud size={20} className="mb-2" />
                    <span className="text-sm font-medium text-center px-4 truncate w-full">
                      {selectedImage ? selectedImage.name : "Choose image from device"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                  Or Paste Image URL
                </label>
                <div className="relative h-full flex items-center">
                  <ImagePlus size={18} className="absolute left-3 text-structural-muted" />
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="Paste image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    disabled={Boolean(selectedImage)}
                    className="w-full h-[72px] pl-10 p-3 bg-white border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {(previewImage || formData.imageUrl) && (
              <div className="relative inline-block border border-border rounded-[8px] overflow-hidden">
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-[6px] transition-colors"
                >
                  <X size={16} />
                </button>
                <img
                  src={previewImage || formData.imageUrl}
                  alt="Complaint preview"
                  className="max-h-48 object-cover"
                />
              </div>
            )}

            {/* Location Section */}
            <div className="pt-4 border-t border-border space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campus Selection */}
                <div>
                  <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                    Campus <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted pointer-events-none" />
                    <select
                      name="campus"
                      value={formData.campus}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors appearance-none"
                    >
                      <option value="" disabled>Select Campus</option>
                      <option value="Patna Campus">Patna Campus</option>
                      <option value="Bihta Campus">Bihta Campus</option>
                    </select>
                  </div>
                </div>

                {/* Specific Location */}
                <div>
                  <label className="block text-[13px] font-bold text-structural uppercase tracking-wider mb-2">
                    Specific Location <span className="text-error">*</span>
                  </label>
                  <div className="relative flex gap-3">
                    <div className="relative flex-grow">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-structural-muted" />
                      <input
                        type="text"
                        name="address"
                        placeholder="e.g. Near Academic Block A"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 p-3 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Geo-location actions & coordinates */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-2">Lat (Optional)</label>
                    <input type="number" step="any" name="lat" placeholder="Auto" value={formData.lat} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-structural-muted uppercase tracking-wider mb-2">Lng (Optional)</label>
                    <input type="number" step="any" name="lng" placeholder="Auto" value={formData.lng} onChange={handleChange} className="w-full p-2.5 bg-base border border-border rounded-[8px] text-sm text-structural focus:border-accent focus:outline-none" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="px-4 py-2.5 h-[42px] bg-structural/10 text-structural font-semibold text-sm rounded-[8px] hover:bg-structural/20 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                >
                  <LocateFixed size={16} />
                  <span>{locationLoading ? "Locating..." : "Use My Location"}</span>
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              {/* Secondary neutral action */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center justify-center gap-2 flex-1 py-3 bg-structural/10 text-structural font-bold rounded-[8px] hover:bg-structural/20 transition-colors disabled:opacity-50"
              >
                <Brain size={18} />
                {analyzing ? "Analyzing..." : "Preview AI Score"}
              </button>

              {/* The ONLY dominant accent action */}
              <button 
                type="submit" 
                disabled={submitting}
                className="flex items-center justify-center gap-2 flex-1 py-3 bg-accent text-white font-bold rounded-[8px] shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                <FilePlus2 size={18} />
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
            
          </form>
        </section>

        {/* Right Sidebar: AI Analysis & Alerts */}
        <aside className="space-y-6">
          
          {analysis ? (
            <PriorityScoreCard analysis={analysis} />
          ) : (
            <div className="bg-white p-8 border border-border rounded-[10px] shadow-sm flex flex-col items-center text-center text-structural-muted">
              <Brain size={36} className="mb-4 opacity-50" />
              <h3 className="text-[15px] font-bold text-structural mb-2">AI Analysis Preview</h3>
              <p className="text-[13px] leading-relaxed">
                Fill complaint details and click “Preview AI Score” to see category, urgency, department, and AI reason.
              </p>
            </div>
          )}

          <DuplicateAlertBox duplicate={duplicate} />

          <div className="bg-structural/5 p-5 border border-border/50 rounded-[10px] flex items-start gap-3">
            <AlertTriangle size={18} className="text-structural-muted flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-structural-muted leading-relaxed">
              You can upload an issue photo from your device or paste an image URL. Uploaded images are securely stored.
            </p>
          </div>
          
        </aside>

      </div>
    </main>
  );
};

export default ReportIssue;