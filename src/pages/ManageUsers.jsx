import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Save,
  Search,
  ShieldAlert,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getSuperAdminUsers,
  updateSuperAdminUser,
} from "../services/superAdminPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { normalizeRole, roleLabels, USER_ROLES } from "../utils/rolePermissions";

const roleOptions = [
  USER_ROLES.STUDENT,
  USER_ROLES.STAFF,
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER_ADMIN,
];

const approvalOptions = ["Pending", "Approved", "Rejected"];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [savingId, setSavingId] = useState("");
  const [actionId, setActionId] = useState("");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const data = await getSuperAdminUsers({ search, role });
      setUsers(data.users || []);
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserField = (id, field, value) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === id ? { ...user, [field]: value } : user))
    );
  };

  const saveUser = async (user) => {
    const normalizedRole = normalizeRole(user.role);
    setSavingId(user._id);

    try {
      await updateSuperAdminUser(user._id, {
        role: normalizedRole,
        isActive: user.isActive,
        trustScore:
          normalizedRole === USER_ROLES.STUDENT
            ? Number(user.trustScore || 50)
            : undefined,
        approvalStatus: user.approvalStatus,
      });

      toast.success("User updated");
      await fetchUsers();
    } catch (error) {
      toast.error(error.message || "User update failed");
    } finally {
      setSavingId("");
    }
  };

  const approveAdmin = async (user) => {
    setActionId(user._id);

    try {
      await updateSuperAdminUser(user._id, {
        approvalStatus: "Approved",
        isActive: true,
      });

      toast.success("Admin approved successfully");
      await fetchUsers();
    } catch (error) {
      toast.error(error.message || "Approval failed");
    } finally {
      setActionId("");
    }
  };

  const rejectAdmin = async (user) => {
    setActionId(user._id);

    try {
      await updateSuperAdminUser(user._id, {
        approvalStatus: "Rejected",
        isActive: false,
      });

      toast.success("Admin request rejected");
      await fetchUsers();
    } catch (error) {
      toast.error(error.message || "Reject failed");
    } finally {
      setActionId("");
    }
  };

  const handleFilter = (event) => {
    event.preventDefault();
    fetchUsers();
  };

  if (loading) return <Loader text="Loading users..." />;

  const pendingAdmins = users.filter(
    (user) =>
      normalizeRole(user.role) === USER_ROLES.ADMIN &&
      (user.approvalStatus || "Pending") === "Pending"
  );

  return (
    <main className="min-h-[calc(100vh-76px)] bg-base px-6 py-8 md:px-10 md:py-12 text-structural">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-structural-muted mb-3">
              Super admin
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-structural">
              Manage users
            </h1>
            <p className="mt-3 text-[15px] text-structural-muted max-w-2xl">
              Approve admin requests, update roles, control account status, and tune student trust scores.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-[10px] border border-border bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">Users</p>
              <p className="mt-1 text-2xl font-extrabold text-structural">{users.length}</p>
            </div>
            <div className="rounded-[10px] border border-border bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-structural-muted">Pending</p>
              <p className="mt-1 text-2xl font-extrabold text-structural">{pendingAdmins.length}</p>
            </div>
          </div>
        </section>

        {pendingAdmins.length > 0 && (
          <section className="bg-white border border-border rounded-[10px] shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-[10px] bg-accent/10 text-accent flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-structural">
                  {pendingAdmins.length} pending admin requests
                </h2>
                <p className="text-sm text-structural-muted">Review account requests before giving admin access.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingAdmins.map((user) => (
                <article key={user._id} className="rounded-[10px] border border-border bg-base p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-bold text-structural truncate">{user.name}</h3>
                      <p className="text-sm text-structural-muted truncate">{user.email}</p>
                      <p className="text-xs text-structural-muted mt-1">{user.city || "No city added"}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-60"
                        onClick={() => approveAdmin(user)}
                        disabled={actionId === user._id}
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-white px-3 py-2 text-sm font-semibold text-error hover:bg-error/5 transition-colors disabled:opacity-60"
                        onClick={() => rejectAdmin(user)}
                        disabled={actionId === user._id}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <form className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(180px,0.6fr)_auto] gap-4" onSubmit={handleFilter}>
          <div className="flex items-center gap-3 rounded-[10px] border border-border bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-structural-muted shrink-0" />
            <input
              placeholder="Search name, email, phone, city..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-structural placeholder:text-structural-muted focus:outline-none"
            />
          </div>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-[10px] border border-border bg-white px-4 py-3 text-structural shadow-sm focus:border-accent focus:outline-none"
          >
            <option value="">All roles</option>
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {roleLabels[option]}
              </option>
            ))}
          </select>

          <button className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-5 py-3 font-semibold text-white shadow-sm hover:bg-accent-hover transition-colors">
            <Users size={18} />
            Load users
          </button>
        </form>

        {users.length === 0 ? (
          <div className="bg-white border border-border rounded-[10px] shadow-sm p-6">
            <EmptyState title="No users found" message="Try a different search term or role filter." />
          </div>
        ) : (
          <section className="bg-white border border-border rounded-[10px] shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-base">
              <div className="w-10 h-10 rounded-[10px] bg-structural/10 text-structural flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-structural">{users.length} users</h2>
                <p className="text-sm text-structural-muted">Update access and account status inline.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left">
                <thead className="bg-base text-structural-muted text-xs uppercase tracking-[0.18em]">
                  <tr>
                    <th className="px-6 py-4 font-bold">User</th>
                    <th className="px-6 py-4 font-bold">Phone</th>
                    <th className="px-6 py-4 font-bold">Role</th>
                    <th className="px-6 py-4 font-bold">Approval</th>
                    <th className="px-6 py-4 font-bold">Student trust</th>
                    <th className="px-6 py-4 font-bold">Active</th>
                    <th className="px-6 py-4 font-bold text-center">Save</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {users.map((user) => {
                    const normalizedUserRole = normalizeRole(user.role);

                    return (
                      <tr key={user._id} className="hover:bg-base/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-structural/10 text-structural flex items-center justify-center font-bold shrink-0">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-structural truncate">{user.name || "Unnamed user"}</p>
                              <p className="text-sm text-structural-muted truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-structural-muted">{user.phone || "N/A"}</td>

                        <td className="px-6 py-4">
                          <select
                            value={normalizedUserRole}
                            onChange={(event) =>
                              updateUserField(user._id, "role", event.target.value)
                            }
                            className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-structural focus:border-accent focus:outline-none"
                          >
                            {roleOptions.map((option) => (
                              <option key={option} value={option}>
                                {roleLabels[option]}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-6 py-4">
                          {normalizedUserRole === USER_ROLES.ADMIN ? (
                            <select
                              value={user.approvalStatus || "Pending"}
                              onChange={(event) =>
                                updateUserField(user._id, "approvalStatus", event.target.value)
                              }
                              className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-structural focus:border-accent focus:outline-none"
                            >
                              {approvalOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                              <UserCheck size={13} />
                              Approved
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {normalizedUserRole === USER_ROLES.STUDENT ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={user.trustScore || 50}
                              onChange={(event) =>
                                updateUserField(user._id, "trustScore", event.target.value)
                              }
                              className="w-24 rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-structural focus:border-accent focus:outline-none"
                            />
                          ) : (
                            <span className="text-sm text-structural-muted">Not applicable</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={String(Boolean(user.isActive))}
                            onChange={(event) =>
                              updateUserField(user._id, "isActive", event.target.value === "true")
                            }
                            className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-structural focus:border-accent focus:outline-none"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-structural px-4 py-2.5 text-sm font-semibold text-white hover:bg-structural-muted transition-colors disabled:opacity-60"
                            onClick={() => saveUser(user)}
                            disabled={savingId === user._id}
                          >
                            <Save size={16} />
                            {savingId === user._id ? "Saving..." : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ManageUsers;
