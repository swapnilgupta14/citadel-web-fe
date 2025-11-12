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
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/storage/auth";
import { showToast } from "../../lib/helpers/toast";
import { useProfile } from "../../hooks/queries/useProfile";
import { ImageWithPlaceholder } from "../../components/ui";
import { ProfileSkeleton } from "../../components/skeleton";

interface ProfileMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isDanger?: boolean;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: profileResponse, isLoading } = useProfile();
  const profile = profileResponse?.data;

  const handleLogout = () => {
    auth.logout();
    navigate("/connect", { replace: true });
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

  const generateUserCode = (name: string, id: number): string => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const code = id.toString().slice(-4);
    return `#${initials}${code}`;
  };

  const userData = auth.getUserData();
  const displayName = profile?.name || "User";
  const userId = profile?.id || parseInt(userData?.id || "0");
  const userCode = profile
    ? generateUserCode(profile.name, profile.id)
    : `#${userId.toString().slice(-4)}`;
  const primarySlot = profile?.slots?.find((slot) => slot.slot === 0);
  const profileImage =
    primarySlot?.image?.cloudfrontUrl || profile?.images?.[0]?.cloudfrontUrl;

  return (
    <div className="flex h-full flex-col bg-background min-h-0 justify-around">
      <div className="h-[18.625rem] flex-shrink-0 flex flex-col items-center justify-center py-6">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <button
              onClick={handleUploadPhoto}
              className="relative w-[130px] h-[130px] rounded-[5px] border-2 border-dashed border-white bg-background-secondary flex items-center justify-center mb-6 active:scale-95 transition-transform overflow-hidden"
              aria-label="Upload profile photo"
            >
              {profileImage ? (
                <ImageWithPlaceholder
                  src={profileImage}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Plus className="w-12 h-12 text-primary" strokeWidth={2} />
              )}
            </button>

            <h1 className="text-3xl font-bold text-text-primary font-serif mb-2">
              {displayName}
            </h1>
            <p className="text-lg text-primary font-semibold">{userCode}</p>
            {profile?.university && (
              <p className="text-sm text-text-secondary mt-1">
                {profile.university.name}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex flex-col mt-auto overflow-y-auto scrollbar-hide">
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
                className={`w-full flex items-center gap-4 p-4 bg-background-secondary active:scale-[0.98] transition-transform flex-shrink-0 ${
                  !isLast ? "border-b border-border" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
                </div>
                <span className={`text-lg font-medium ${textColor}`}>
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
