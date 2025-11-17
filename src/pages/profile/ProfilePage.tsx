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
import { useState, useRef, lazy, Suspense, useEffect } from "react";
import { auth } from "../../lib/storage/auth";
import { showToast } from "../../lib/helpers/toast";
import {
  useProfile,
  useUploadProfileImage,
  useDeleteProfileImage,
} from "../../hooks/queries/useProfile";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: profileResponse, isLoading, isFetching } = useProfile();
  const profile = profileResponse?.data;
  const uploadImageMutation = useUploadProfileImage();
  const deleteImageMutation = useDeleteProfileImage();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<
    "logout" | "delete-account" | null
  >(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRefetchingAfterMutation, setIsRefetchingAfterMutation] =
    useState(false);
  const [mutationAction, setMutationAction] = useState<
    "upload" | "delete" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFetching && isRefetchingAfterMutation) {
      setIsRefetchingAfterMutation(false);
      
      if (mutationAction === "upload") {
        showToast.success("Profile photo uploaded successfully");
      } else if (mutationAction === "delete") {
        showToast.success("Profile photo deleted successfully");
      }
      
      setMutationAction(null);
    }
  }, [isFetching, isRefetchingAfterMutation, mutationAction]);

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
    navigate("/profile/event-bookings");
  };

  const handleHelpSupport = () => {
    navigate("/profile/help-support");
  };

  const handlePrivacyPolicy = () => {
    navigate("/profile/legal/privacy-terms?tab=privacy");
  };

  const handleTermsConditions = () => {
    navigate("/profile/legal/privacy-terms?tab=terms");
  };

  const primarySlot = profile?.slots?.find((slot) => slot.slot === 0);
  const profileImageFromApi = primarySlot?.image?.cloudfrontUrl || null;
  const profileImage = previewImage || profileImageFromApi || null;

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

  const handleDeletePhoto = async () => {
    setIsBottomSheetOpen(false);
    const primarySlot = profile?.slots?.find((slot) => slot.slot === 0);
    if (!primarySlot?.image) {
      showToast.error("No photo to delete");
      return;
    }

    setPreviewImage(null);
    setIsRefetchingAfterMutation(true);
    setMutationAction("delete");

    try {
      await deleteImageMutation.mutateAsync({ slot: 0 });
    } catch (error) {
      setIsRefetchingAfterMutation(false);
      setMutationAction(null);
      showToast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete photo. Please try again."
      );
    }
  };

  const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Image size must be less than 5MB";
    }
    return null;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showToast.error(validationError);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
    };
    reader.readAsDataURL(file);

    try {
      const response = await uploadImageMutation.mutateAsync({ file, slot: 0 });
      if (response.data?.cloudfrontUrl) {
        setPreviewImage(null);
        setIsRefetchingAfterMutation(true);
        setMutationAction("upload");
      }
    } catch (error) {
      setPreviewImage(null);
      setIsRefetchingAfterMutation(false);
      setMutationAction(null);
      showToast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload photo. Please try again."
      );
    } finally {
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

  const generateUserCode = (name: string, id: string): string => {
    const initials =
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "US";
    const code = id?.slice(-4) || "0000";
    return `#${initials}${code}`;
  };

  const userData = auth.getUserData();
  const displayName = profile?.name || "User";
  const userId = profile?.id || userData?.id || "0";
  const userCode = profile
    ? generateUserCode(profile.name, profile.id)
    : `#${userId.slice(-4)}`;

  return (
    <div className="flex h-full flex-col bg-background min-h-0">
      <div className="min-h-[18.65rem] flex-1 flex flex-col items-center justify-center py-6">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <button
              onClick={handlePhotoClick}
              disabled={
                uploadImageMutation.isPending ||
                deleteImageMutation.isPending ||
                isRefetchingAfterMutation
              }
              className={`relative w-[130px] h-[130px] rounded-[5px] bg-background-secondary flex items-center justify-center mb-6 active:scale-95 transition-transform overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                !profileImage ? "border-2 border-dashed border-white" : ""
              }`}
              aria-label={
                profileImage ? "Change profile photo" : "Upload profile photo"
              }
            >
              {uploadImageMutation.isPending ||
              deleteImageMutation.isPending ||
              isRefetchingAfterMutation ? (
                <div className="w-full h-full bg-background-secondary relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary animate-shimmer bg-[length:200%_100%]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
              ) : profileImage ? (
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

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col">
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
