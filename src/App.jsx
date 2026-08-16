import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { USER_ROLES } from "./utils/rolePermissions";

// --- ACTIVATED PAGES ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- PENDING PAGES (Uncomment the import and the Route below as you create each file) ---
// import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import TrackComplaint from "./pages/TrackComplaint";
// import NotFound from "./pages/NotFound";
// import ReportIssue from "./pages/ReportIssue";
// import ComplaintDetails from "./pages/ComplaintDetails";
// import ProfileSettings from "./pages/ProfileSettings";

// // Role-specific Dashboards
// import UserDashboard from "./pages/UserDashboard";
// import MyComplaints from "./pages/MyComplaints";
// import DepartmentDashboard from "./pages/DepartmentDashboard";
// import DepartmentComplaints from "./pages/DepartmentComplaints";
// import DepartmentComplaintDetails from "./pages/DepartmentComplaintDetails";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminComplaints from "./pages/AdminComplaints";
// import AdminComplaintDetails from "./pages/AdminComplaintDetails";
// import Analytics from "./pages/Analytics";
// import EscalationCenter from "./pages/EscalationCenter";
// import Feedback from "./pages/Feedback";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard";
// import ManageUsers from "./pages/ManageUsers";
// import ManageDepartments from "./pages/ManageDepartments";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-base font-sans text-structural">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            padding: "12px 16px",
            fontWeight: "500",
            color: "#3E4C5E",
            border: "1px solid #E3DED7",
            boxShadow: "0 2px 8px rgba(62, 76, 94, 0.08)",
          },
          success: {
            iconTheme: { primary: "#4C8C5B", secondary: "#FFFFFF" },
          },
          error: {
            iconTheme: { primary: "#B3413E", secondary: "#FFFFFF" },
          },
        }}
      />

      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* --- ACTIVE ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* --- PENDING ROUTES --- */}
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          {/* <Route path="/track-complaint" element={<TrackComplaint />} /> */}
          
          {/* Shared Protected Routes */}
          {/* <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} /> */}
          {/* <Route path="/report-issue" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} /> */}
          {/* <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} /> */}

          {/* Student Routes */}
          {/* <Route path="/dashboard" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.STUDENT]}><UserDashboard /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/my-complaints" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.STUDENT]}><MyComplaints /></RoleBasedRoute></ProtectedRoute>} /> */}

          {/* Department (Staff) Routes */}
          {/* <Route path="/department-dashboard" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.STAFF]}><DepartmentDashboard /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/department/complaints" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.STAFF, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}><DepartmentComplaints /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/department/complaints/:id" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.STAFF, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}><DepartmentComplaintDetails /></RoleBasedRoute></ProtectedRoute>} /> */}

          {/* Admin Routes */}
          {/* <Route path="/admin-dashboard" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminDashboard /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/admin/complaints" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}><AdminComplaints /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/admin/complaints/:id" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}><AdminComplaintDetails /></RoleBasedRoute></ProtectedRoute>} /> */}
          
          {/* Shared Admin/Staff Management Routes */}
          {/* <Route path="/analytics" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.STAFF]}><Analytics /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/escalations" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}><EscalationCenter /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/feedback" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}><Feedback /></RoleBasedRoute></ProtectedRoute>} /> */}

          {/* Super Admin Routes */}
          {/* <Route path="/super-admin-dashboard" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}><SuperAdminDashboard /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/super-admin/users" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}><ManageUsers /></RoleBasedRoute></ProtectedRoute>} /> */}
          {/* <Route path="/super-admin/departments" element={<ProtectedRoute><RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}><ManageDepartments /></RoleBasedRoute></ProtectedRoute>} /> */}

          {/* Fallback */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;