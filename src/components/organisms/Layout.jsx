import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h2>
          <p className="text-gray-600">You need to be authenticated to access this application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Logout */}
        <div className="flex items-center justify-between p-4 lg:p-6 bg-white shadow-sm">
          <Header />
          <Button
            variant="outline"
            size="sm"
            icon="LogOut"
            onClick={logout}
            className="text-error border-error hover:bg-error hover:text-white"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:text-primary transition-colors"
        >
          <ApperIcon name="Menu" className="h-5 w-5" />
        </button>

        {/* Page Content */}
        <main className="px-4 lg:px-6 py-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
);
};

export default Layout;