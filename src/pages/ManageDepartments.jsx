import { useEffect, useState } from "react";
import { Building2, Mail, Phone, Plus, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import {
  createSuperAdminDepartment,
  getSuperAdminDepartments,
  updateSuperAdminDepartment,
} from "../services/superAdminPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const emptyDepartment = {
  name: "",
  category: "",
  staffName: "",
  email: "",
  phone: "",
  description: "",
};

const fields = [
  { name: "name", label: "Department name", placeholder: "Electrical Maintenance", required: true },
  { name: "category", label: "Category", placeholder: "electricity", required: true },
  { name: "staffName", label: "Staff name", placeholder: "Assigned staff" },
  { name: "email", label: "Staff email", placeholder: "staff@nitp.ac.in", type: "email" },
  { name: "phone", label: "Staff phone", placeholder: "+91 9876543210", type: "tel" },
  { name: "description", label: "Description", placeholder: "Short responsibility note" },
];

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState(emptyDepartment);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState("");

  const fetchDepartments = async () => {
    setLoading(true);

    try {
      const data = await getSuperAdminDepartments();
      setDepartments(data.departments || []);
    } catch (error) {
      toast.error(error.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const updateDepartmentField = (id, field, value) => {
    setDepartments((prev) =>
      prev.map((department) =>
        department._id === id ? { ...department, [field]: value } : department
      )
    );
  };

  const handleNewChange = (event) => {
    setNewDepartment((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createDepartment = async (event) => {
    event.preventDefault();
    setCreating(true);

    try {
      await createSuperAdminDepartment(newDepartment);
      toast.success("Department created");
      setNewDepartment(emptyDepartment);
      await fetchDepartments();
    } catch (error) {
      toast.error(error.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const saveDepartment = async (department) => {
    setSavingId(department._id);

    try {
      await updateSuperAdminDepartment(department._id, department);
      toast.success("Department updated");
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setSavingId("");
    }
  };

  if (loading) return <Loader text="Loading departments..." />;

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-8 md:px-10 md:py-12 text-structural">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-structural-muted mb-3">
              Super admin
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural">
              Manage departments
            </h1>
            <p className="mt-3 text-[15px] text-structural-muted max-w-2xl">
              Create departments, assign staff contacts, and keep routing categories up to date.
            </p>
          </div>

          <div className="rounded-[10px] border border-border bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">Departments</p>
            <p className="mt-1 text-2xl font-extrabold text-structural">{departments.length}</p>
          </div>
        </section>

        <section className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-[10px] bg-accent/10 text-accent flex items-center justify-center">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-structural">Create new department</h2>
              <p className="text-sm text-structural-muted">Add a department and the staff contact students will route to.</p>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" onSubmit={createDepartment}>
            {fields.map((field) => (
              <label key={field.name} className="block text-sm font-semibold text-structural">
                {field.label}
                <input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={newDepartment[field.name]}
                  onChange={handleNewChange}
                  required={field.required}
                  className="mt-2 w-full rounded-[10px] border border-border bg-base px-4 py-3 text-structural placeholder:text-structural-muted focus:border-accent focus:outline-none"
                />
              </label>
            ))}

            <button
              className="md:col-span-2 xl:col-span-3 inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-5 py-3 font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
              disabled={creating}
            >
              <Plus size={18} />
              {creating ? "Creating..." : "Create department"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-structural">{departments.length} departments</h2>
            </div>
          </div>

          {departments.length === 0 ? (
            <div className="bg-white border border-border rounded-[10px] shadow-sm p-6">
              <EmptyState title="No departments yet" message="Create the first department to start assigning complaint categories." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {departments.map((department) => (
                <article key={department._id} className="bg-white border border-border rounded-[10px] shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-structural truncate">
                        {department.name || "Unnamed department"}
                      </h3>
                      <p className="text-sm text-structural-muted mt-1">
                        {department.category || "No category set"}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center shrink-0">
                      <Building2 size={18} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field) => (
                      <label key={field.name} className={field.name === "description" ? "sm:col-span-2 block text-sm font-semibold text-structural" : "block text-sm font-semibold text-structural"}>
                        {field.label}
                        <input
                          type={field.type || "text"}
                          value={department[field.name] || ""}
                          onChange={(event) =>
                            updateDepartmentField(department._id, field.name, event.target.value)
                          }
                          className="mt-2 w-full rounded-[10px] border border-border bg-base px-4 py-3 text-structural focus:border-accent focus:outline-none"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 text-xs text-structural-muted">
                      {department.staffName && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-base border border-border px-3 py-1">
                          <UserRound size={13} />
                          {department.staffName}
                        </span>
                      )}
                      {department.email && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-base border border-border px-3 py-1">
                          <Mail size={13} />
                          {department.email}
                        </span>
                      )}
                      {department.phone && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-base border border-border px-3 py-1">
                          <Phone size={13} />
                          {department.phone}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-structural px-4 py-2.5 text-sm font-semibold text-white hover:bg-structural-muted transition-colors disabled:opacity-60"
                      onClick={() => saveDepartment(department)}
                      disabled={savingId === department._id}
                    >
                      <Save size={16} />
                      {savingId === department._id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ManageDepartments;
