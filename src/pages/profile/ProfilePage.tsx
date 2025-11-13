import {
  Calendar,
  Headphones,
  Shield,
  FileText,
  LogOut,
  Trash2,
  Plus,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, lazy, Suspense } from "react";
import { auth } from "../../lib/storage/auth";
import { showToast } from "../../lib/helpers/toast";
import { useProfile } from "../../hooks/queries/useProfile";
import { ImageWithPlaceholder, BottomSheet } from "../../components/ui";
import { ProfileSkeleton } from "../../components/skeleton";

const ConfirmationModal = lazy(() =>
  import("../../components/ui/ConfirmationModal").then((module) => ({
    default: module.ConfirmationModal,
  }))
);

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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<
    "logout" | "delete-account" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoutClick = () => {
    setConfirmationModal("logout");
  };

  const handleLogoutConfirm = () => {
    auth.logout();
    navigate("/connect", { replace: true });
  };

  const handleDeleteAccountClick = () => {
    setConfirmationModal("delete-account");
  };

  const handleDeleteAccountConfirm = () => {
    showToast.info("Delete Account - Coming soon");
  };

  const handleEventBookings = () => {
    navigate("/event-bookings");
  };

  const handleHelpSupport = () => {
    navigate("/help-support");
  };

  const handlePrivacyPolicy = () => {
    navigate("/legal/privacy-terms?tab=privacy");
  };

  const handleTermsConditions = () => {
    navigate("/legal/privacy-terms?tab=terms");
  };

  const primarySlot = profile?.slots?.find((slot) => slot.slot === 0);
  const profileImage =
    primarySlot?.image?.cloudfrontUrl || profile?.images?.[0]?.cloudfrontUrl;

  const handlePhotoClick = () => {
    if (profileImage) {
      setIsBottomSheetOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleReplacePhoto = () => {
    setIsBottomSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = () => {
    setIsBottomSheetOpen(false);
    showToast.info("Delete Photo - Coming soon");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload here
      showToast.info("Upload Photo - Coming soon");
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
      onClick: handleLogoutClick,
    },
    {
      id: "delete-account",
      label: "Delete account",
      icon: Trash2,
      onClick: handleDeleteAccountClick,
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

  return (
    <div className="flex h-full flex-col bg-background min-h-0 justify-around">
      <div className="h-[18.625rem] flex-shrink-0 flex flex-col items-center justify-center py-6">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <button
              onClick={handlePhotoClick}
              className="relative w-[130px] h-[130px] rounded-[5px] border-2 border-dashed border-white bg-background-secondary flex items-center justify-center mb-6 active:scale-95 transition-transform overflow-hidden"
              aria-label={
                profileImage ? "Change profile photo" : "Upload profile photo"
              }
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <div className="flex flex-col pb-6">
          <button
            onClick={handleReplacePhoto}
            className="w-full flex items-center gap-4 p-4 bg-background-secondary active:scale-[0.98] transition-transform border-b border-border"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-lg font-medium text-text-primary">
              Replace
            </span>
          </button>
          <button
            onClick={handleDeletePhoto}
            className="w-full flex items-center gap-4 p-4 bg-background-secondary active:scale-[0.98] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-red-500" strokeWidth={2} />
            </div>
            <span className="text-lg font-medium text-red-500">
              Delete Photo
            </span>
          </button>
        </div>
      </BottomSheet>

      <Suspense fallback={null}>
        {confirmationModal === "logout" && (
          <ConfirmationModal
            isOpen={true}
            onClose={() => setConfirmationModal(null)}
            onConfirm={handleLogoutConfirm}
            icon={LogOut}
            title="Are you sure you want to log out?"
          />
        )}
        {confirmationModal === "delete-account" && (
          <ConfirmationModal
            isOpen={true}
            onClose={() => setConfirmationModal(null)}
            onConfirm={handleDeleteAccountConfirm}
            icon={Trash2}
            title="Are you sure you want to delete account?"
            iconColor="text-red-500"
          />
        )}
      </Suspense>

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
