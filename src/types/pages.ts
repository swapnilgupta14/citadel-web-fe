export type UniversitySelectionPageProps = {
  onBack: () => void;
  onContinue: (universityId: string) => void;
  initialUniversityId?: string;
};

export type EmailEntryPageProps = {
  onBack: () => void;
  onContinue: (email: string) => void;
  initialEmail?: string;
};

export type OTPEntryPageProps = {
  email: string;
  onBack: () => void;
  onContinue: (otp: string) => void;
  onResendOTP: () => void;
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
};

export type SuccessPageProps = {
  onComplete: () => void;
};

export type LoginEmailPageProps = {
  onBack: () => void;
  onContinue: (email: string) => void;
  initialEmail?: string;
};

export type LoginOTPPageProps = {
  email: string;
  onBack: () => void;
  onContinue: (otp: string) => void;
  onResendOTP: () => void;
};

