import {
  Calendar,
  Headphones,
  Shield,
  FileText,
  LogOut,
  Trash2,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { auth } from "../lib/storage/auth";
import { showToast } from "../lib/helpers/toast";

interface ProfileMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isDanger?: boolean;
}

export const ProfilePage = () => {
  const handleLogout = () => {
    auth.clearAll();
    showToast.success("Logged out successfully");
    window.location.href = "/";
  };

  const handleEventBookings = () => {
    showToast.info("Event Bookings - Coming soon");
  };

  const handleHelpSupport = () => {
    showToast.info("Help & Support - Coming soon");
  };

  const handlePrivacyPolicy = () => {
    showToast.info("Privacy Policy - Coming soon");
  };

  const handleTermsConditions = () => {
    showToast.info("Terms & Conditions - Coming soon");
  };

  const handleDeleteAccount = () => {
    showToast.info("Delete Account - Coming soon");
  };

  const handleUploadPhoto = () => {
    showToast.info("Upload Photo - Coming soon");
  };

  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: "event-bookings",
      label: "Event Bookings",
      icon: Calendar,
      onClick: handleEventBookings,
    },
    {
      id: "help-support",
      label: "Help & Support",
      icon: Headphones,
      onClick: handleHelpSupport,
    },
    {
      id: "privacy-policy",
      label: "Privacy policy",
      icon: Shield,
      onClick: handlePrivacyPolicy,
    },
    {
      id: "terms-conditions",
      label: "Terms & Conditions",
      icon: FileText,
      onClick: handleTermsConditions,
    },
    {
      id: "logout",
      label: "Log Out",
      icon: LogOut,
      onClick: handleLogout,
    },
    {
      id: "delete-account",
      label: "Delete account",
      icon: Trash2,
      onClick: handleDeleteAccount,
      isDanger: true,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="flex-1 py-6">
        <div className="flex flex-col items-center py-6">
          <button
            onClick={handleUploadPhoto}
            className="relative w-[130px] h-[130px] rounded-[5px] border-2 border-dashed border-white bg-background-secondary flex items-center justify-center mb-6 active:scale-95 transition-transform"
            aria-label="Upload profile photo"
          >
            <Plus className="w-12 h-12 text-primary" strokeWidth={2} />
          </button>

          <h1 className="text-3xl font-bold text-text-primary font-serif mb-2">
            Nisarg Patel
          </h1>
          <p className="text-lg text-primary font-semibold">#NP7F2</p>
        </div>

        <div>
          {profileMenuItems.map((item, index) => {
            const Icon = item.icon;
            const textColor = item.isDanger
              ? "text-red-500"
              : "text-text-primary";
            const iconColor = item.isDanger ? "text-red-500" : "text-white";
            const isLast = index === profileMenuItems.length - 1;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-4 bg-background-secondary active:scale-[0.98] transition-transform ${
                  !isLast ? "border-b border-white/10" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
                </div>
                <span className={`text-xl font-medium ${textColor}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
