export type UniversitySelectionPageProps = {
  onBack: () => void;
  onContinue: (university: { id: string; name: string; country: string; domain?: string }) => void;
  initialUniversityId?: string;
};

export type EmailEntryPageProps = {
  onBack: () => void;
  onContinue: (email: string) => void;
  initialEmail?: string;
  isLoading?: boolean;
};

export type OTPEntryPageProps = {
  email: string;
  onBack: () => void;
  onContinue: (otp: string) => void;
  onResendOTP: () => void;
  isLoading?: boolean;
  isResending?: boolean;
};

export type WhoAreYouPageProps = {
  onBack: () => void;
  onContinue: (data: { name: string; gender: "male" | "female" | "other" }) => void;
  initialName?: string;
  initialGender?: "male" | "female" | "other";
};

export type DateOfBirthPageProps = {
  onBack: () => void;
  onContinue: (data: { day: string; month: string; year: string }) => void;
  initialDateOfBirth?: string;
};

export type DegreeSelectionPageProps = {
  onBack: () => void;
  onContinue: (data: { degree: string; year: string }) => void;
  initialDegree?: string;
  initialYear?: string;
  isLoading?: boolean;
};

export type SuccessPageProps = {
  onComplete: () => void;
};

export type LoginEmailPageProps = {
  onBack: () => void;
  onContinue: (email: string) => void;
  initialEmail?: string;
  isLoading?: boolean;
};

export type LoginOTPPageProps = {
  email: string;
  onBack: () => void;
  onContinue: (otp: string) => void;
  onResendOTP: () => void;
};

