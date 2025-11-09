export type UniversitySelectionPageProps = {
  onBack: () => void;
  onContinue: () => void;
};

export type EmailEntryPageProps = {
  onBack: () => void;
  onContinue: (email: string) => void;
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
};

export type DateOfBirthPageProps = {
  onBack: () => void;
  onContinue: (data: { day: string; month: string; year: string }) => void;
};

export type DegreeSelectionPageProps = {
  onBack: () => void;
  onContinue: (data: { degree: string; year: string }) => void;
};

export type SuccessPageProps = {
  onComplete: () => void;
};

