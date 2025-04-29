
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Bike,
  Store,
  ShoppingBag,
  Users,
  Star,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-64 border-r bg-card text-card-foreground shadow-sm">
      <div className="flex h-16 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      </div>
      <div className="py-4 px-4 space-y-1">
        <SidebarLink
          to="/admin"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <SidebarLink
          to="/admin/bikes"
          icon={<Bike size={18} />}
          label="Bikes"
        />
        <SidebarLink
          to="/admin/shops"
          icon={<Store size={18} />}
          label="Shops"
        />
        <SidebarLink
          to="/admin/bookings"
          icon={<ShoppingBag size={18} />}
          label="Bookings"
        />
        <SidebarLink
          to="/admin/users"
          icon={<Users size={18} />}
          label="Users"
        />
        <SidebarLink
          to="/admin/reviews"
          icon={<Star size={18} />}
          label="Reviews"
        />
        <SidebarLink
          to="/admin/analytics"
          icon={<BarChart2 size={18} />}
          label="Analytics"
        />
        <SidebarLink
          to="/admin/settings"
          icon={<Settings size={18} />}
          label="Settings"
        />
      </div>
      <div className="absolute bottom-4 px-4 w-full">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
