import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Save,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAssignedDepartmentComplaintDetails,
  updateDepartmentComplaintStatus,
  uploadDepartmentProof,
} from "../services/departmentPanelService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";
import ComplaintTimeline from "../components/ComplaintTimeline";

const DepartmentComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [statusData, setStatusData] = useState({
    status: "In Progress",
    workRemark: "",
  });
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState("");
  const [afterPreview, setAfterPreview] = useState("");

  const fetchDetails = async () => {
    try {
      const data = await getAssignedDepartmentComplaintDetails(id);
      setComplaint(data.complaint);
      setTimeline(data.timeline || []);
      setProof(data.proof || null);
      setStatusData({
        status: data.complaint?.status || "In Progress",
        workRemark: data.complaint?.departmentRemark || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = (event) => {
    setStatusData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event, type) => {
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

    if (type === "before") {
      setBeforeImage(file);
      setBeforePreview(URL.createObjectURL(file));
    } else {
      setAfterImage(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateStatus = async (event) => {
    event.preventDefault();
    setSavingStatus(true);

    try {
      await updateDepartmentComplaintStatus(id, statusData);
      toast.success("Status updated successfully");
      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Status update failed");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleUploadProof = async (type) => {
    const imageFile = type === "before" ? beforeImage : afterImage;

    if (!imageFile) {
      toast.error(`Please choose ${type} image first.`);
      return;
    }

    setUploadingProof(true);

    try {
      await uploadDepartmentProof(id, imageFile, {
        proofType: type,
        workRemark: statusData.workRemark,
      });

      toast.success(`${type} proof uploaded successfully`);

      if (type === "before") {
        setBeforeImage(null);
        setBeforePreview("");
      } else {
        setAfterImage(null);
        setAfterPreview("");
      }

      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Proof upload failed");
    } finally {
      setUploadingProof(false);
    }
  };

  const handleMarkResolved = async () => {
    setSavingStatus(true);

    try {
      await updateDepartmentComplaintStatus(id, {
        status: "Resolved",
        workRemark:
          statusData.workRemark ||
          "Work completed and complaint marked as resolved.",
      });

      toast.success("Complaint marked as resolved");
      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Failed to mark resolved");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) return <Loader text="Loading department work panel..." />;

  if (!complaint) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-12 flex items-center justify-center">
        <section className="w-full max-w-lg bg-white border border-border rounded-[10px] shadow-sm p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center mb-4">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-structural mb-3">Complaint not found</h1>
          <p className="text-sm text-structural-muted mb-6">
            The complaint you are looking for may no longer be assigned to your department.
          </p>
          <Link
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
            to="/department/complaints"
          >
            <ArrowLeft size={18} />
            Back to Complaints
          </Link>
        </section>
      </main>
    );
  }

  const details = [
    { label: "Category", value: complaint.category },
    { label: "Department", value: complaint.department },
    { label: "Location", value: complaint.location?.address || "N/A" },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-8 md:px-10 md:py-12 text-structural">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          to="/department/complaints"
          className="inline-flex items-center gap-2 text-sm font-semibold text-structural-muted hover:text-structural transition-colors"
        >
          <ArrowLeft size={16} />
          Back to assigned complaints
        </Link>

        <section className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-structural/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-structural">
                  ID: {complaint.complaintId}
                </span>
                <StatusBadge status={complaint.status} />
                <UrgencyBadge urgency={complaint.urgency} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-structural-muted mb-2">
                  Department work panel
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-structural leading-tight">
                  {complaint.title}
                </h1>
                <p className="mt-3 text-[15px] text-structural-muted leading-relaxed max-w-3xl">
                  Review the complaint, update the status, and upload before/after proof once the work is complete.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:min-w-[220px]">
              <div className="rounded-[10px] border border-border bg-base p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">AI Priority</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-accent/10 text-accent flex items-center justify-center">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <strong className="block text-2xl font-extrabold text-structural">{complaint.aiScore}/100</strong>
                    <span className="text-xs text-structural-muted">Priority score</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[10px] border border-border bg-base p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">Proof status</p>
                <strong className="mt-2 block text-lg font-bold text-structural">
                  {proof?.proofStatus || "Pending"}
                </strong>
                <span className="text-xs text-structural-muted">Before and after evidence</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-8">
          <section className="space-y-8">
            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-structural mb-4">Complaint details</h2>
              <p className="text-[15px] md:text-base text-structural-muted leading-relaxed mb-6">
                {complaint.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {details.map((item) => (
                  <div key={item.label} className="rounded-[10px] border border-border bg-base p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">{item.label}</p>
                    <p className="mt-2 text-[15px] font-semibold text-structural">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-structural mb-6">Before and after proof</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    key: "before",
                    title: "Before work",
                    imageUrl: proof?.beforeImageUrl,
                    preview: beforePreview,
                    image: beforeImage,
                    onChoose: (event) => handleFileChange(event, "before"),
                    onUpload: () => handleUploadProof("before"),
                  },
                  {
                    key: "after",
                    title: "After work",
                    imageUrl: proof?.afterImageUrl,
                    preview: afterPreview,
                    image: afterImage,
                    onChoose: (event) => handleFileChange(event, "after"),
                    onUpload: () => handleUploadProof("after"),
                  },
                ].map((panel) => (
                  <div key={panel.key} className="rounded-[10px] border border-border bg-base p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-structural mb-4">
                      {panel.title}
                    </h3>

                    {panel.imageUrl || panel.preview ? (
                      <img
                        src={panel.preview || panel.imageUrl}
                        alt={panel.title}
                        className="w-full h-56 object-cover rounded-[10px] border border-border bg-white"
                      />
                    ) : (
                      <div className="w-full h-56 rounded-[10px] border border-dashed border-border bg-white flex flex-col items-center justify-center text-center px-4">
                        <Camera size={28} className="text-structural-muted mb-3" />
                        <p className="font-semibold text-structural">No proof uploaded yet</p>
                        <p className="text-sm text-structural-muted mt-1">Choose an image to upload a record.</p>
                      </div>
                    )}

                    <label className="mt-4 inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-[10px] border border-border bg-white text-sm font-semibold text-structural hover:bg-base transition-colors cursor-pointer">
                      <UploadCloud size={18} />
                      Choose file
                      <input
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={panel.onChoose}
                      />
                    </label>

                    <button
                      type="button"
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-[10px] bg-accent text-white font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
                      onClick={panel.onUpload}
                      disabled={uploadingProof}
                    >
                      Upload {panel.key}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-structural mb-6">Timeline</h2>
              <ComplaintTimeline timeline={timeline} />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8 sticky top-6">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-structural">Work update</h2>
                  <p className="text-sm text-structural-muted mt-1">
                    Update status and record progress notes.
                  </p>
                </div>
                <div className="w-11 h-11 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center">
                  <Save size={18} />
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleUpdateStatus}>
                <label className="block text-sm font-semibold text-structural">
                  Work status
                  <select
                    name="status"
                    className="mt-2 w-full rounded-[10px] border border-border bg-white px-4 py-3 text-structural focus:border-accent focus:outline-none"
                    value={statusData.status}
                    onChange={handleStatusChange}
                  >
                    <option value="Assigned to Department">Assigned to Department</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-structural">
                  Work remark
                  <textarea
                    name="workRemark"
                    className="mt-2 w-full min-h-[140px] rounded-[10px] border border-border bg-white px-4 py-3 text-structural placeholder:text-structural-muted focus:border-accent focus:outline-none resize-y"
                    placeholder="Write work progress remarks..."
                    value={statusData.workRemark}
                    onChange={handleStatusChange}
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-[10px] bg-structural text-white font-semibold hover:bg-structural-muted transition-colors disabled:opacity-50"
                  disabled={savingStatus}
                >
                  <Save size={18} />
                  {savingStatus ? "Saving..." : "Save status"}
                </button>

                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-[10px] bg-accent text-white font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
                  disabled={savingStatus}
                  onClick={handleMarkResolved}
                >
                  <CheckCircle2 size={18} />
                  Mark as resolved
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default DepartmentComplaintDetails;
