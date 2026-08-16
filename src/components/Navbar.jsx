import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  SearchCheck,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { getDashboardPathByRole, roleLabels } from "../utils/rolePermissions";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const dashboardPath = user ? getDashboardPathByRole(user.role) : "/dashboard";
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 h-[76px] flex items-center justify-between px-6 lg:px-12 bg-base border-b border-border">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-structural no-underline" onClick={() => setOpen(false)}>
        <ShieldCheck className="w-6 h-6 text-accent" />
        <span>CampusResolve</span>
      </Link>

      <button className="md:hidden text-structural" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`flex items-center gap-6 ${open ? "absolute top-[76px] left-0 right-0 flex-col p-6 bg-base border-b border-border shadow-md md:static md:flex-row md:p-0 md:bg-transparent md:border-none md:shadow-none" : "hidden md:flex"}`}>
        <NavLink to="/" className="text-sm font-medium text-structural hover:text-structural-muted transition-colors" onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/track-complaint" className="flex items-center gap-1.5 text-sm font-medium text-structural hover:text-structural-muted transition-colors" onClick={() => setOpen(false)}><SearchCheck size={16} /> Track</NavLink>
        <NavLink to="/about" className="flex items-center gap-1.5 text-sm font-medium text-structural hover:text-structural-muted transition-colors" onClick={() => setOpen(false)}><Building2 size={16} /> About</NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to={dashboardPath} className="flex items-center gap-1.5 text-sm font-medium text-structural hover:text-structural-muted transition-colors" onClick={() => setOpen(false)}><LayoutDashboard size={16} /> Dashboard</NavLink>
            <NavLink to="/profile-settings" className="flex items-center gap-1.5 text-sm font-medium text-structural hover:text-structural-muted transition-colors" onClick={() => setOpen(false)}><Settings size={16} /> Settings</NavLink>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-structural/10 text-structural font-semibold text-sm">
                  {avatarLetter}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-structural leading-none">{user?.name}</span>
                  <span className="text-xs text-structural-muted mt-1">{roleLabels[user?.role] || user?.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-structural hover:text-error transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3 pl-4 border-l border-border">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-structural hover:text-structural-muted transition-colors">Student Login</Link>
            <Link to="/admin-login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-structural border border-border rounded-[10px] hover:bg-base-alt transition-colors"><Building2 size={16} /> Admin</Link>
            <Link to="/super-admin-login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-structural border border-border rounded-[10px] hover:bg-base-alt transition-colors"><Crown size={16} /> Super Admin</Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-accent rounded-[10px] shadow-sm hover:bg-accent-hover transition-colors">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;