import { useState, useEffect } from "react";
import { profileApi } from "../../services/api";
import { signupPersistence } from "../../lib/storage/signupPersistence";
import { auth } from "../../lib/storage/auth";
import { showToast, handleApiError } from "../../lib/helpers/toast";

export type SignupData = {
  university?: {
    id: string;
    name: string;
    country: string;
    domain?: string;
  };
  name?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  degree?: string;
  year?: string;
};

export const useSignupFlow = () => {
  const [signupData, setSignupData] = useState<SignupData>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedData = signupPersistence.getSignupData();
    if (savedData && Object.keys(savedData).length > 0) {
      setSignupData(savedData);
    }
  }, []);

  const updateSignupData = (data: Partial<SignupData>) => {
    const updatedData = { ...signupData, ...data };
    setSignupData(updatedData);
    signupPersistence.saveSignupData(updatedData);
  };

  const createProfile = async (data: SignupData) => {
    console.log("=== CREATE PROFILE - Start ===");
    console.log("Current signupData state:", signupData);
    console.log("Data passed to createProfile:", data);

    const mergedData = { ...signupData, ...data };
    console.log("Merged data:", mergedData);

    if (
      !mergedData.university ||
      !mergedData.name ||
      !mergedData.gender ||
      !mergedData.dateOfBirth ||
      !mergedData.degree ||
      !mergedData.year
    ) {
      console.error("Validation failed - missing fields:", {
        university: mergedData.university,
        name: mergedData.name,
        gender: mergedData.gender,
        dateOfBirth: mergedData.dateOfBirth,
        degree: mergedData.degree,
        year: mergedData.year,
      });
      const errorMessage =
        "Missing required information. Please go back and complete all fields.";
      showToast.error(errorMessage);
      return false;
    }

    console.log("Validation passed, updating state and persistence");
    setSignupData(mergedData);
    signupPersistence.saveSignupData(mergedData);

    setIsLoading(true);

    try {
      console.log("Calling profileApi.createProfile with:", {
        name: mergedData.name,
        dateOfBirth: mergedData.dateOfBirth,
        gender: mergedData.gender,
        university: mergedData.university,
        degree: mergedData.degree,
        year: mergedData.year,
      });

      await profileApi.createProfile({
        name: mergedData.name!,
        dateOfBirth: mergedData.dateOfBirth!,
        gender: mergedData.gender!,
        university: mergedData.university!,
        degree: mergedData.degree!,
        year: mergedData.year!,
      });

      console.log("Profile created successfully!");
      showToast.success("Profile created successfully!");
      signupPersistence.clearSignupData();

      const userData = auth.getUserData();
      console.log("Current user data:", userData);
      if (userData) {
        auth.setUserData({ ...userData, isProfileComplete: true });
        console.log("Updated user data with isProfileComplete: true");
      }
      return true;
    } catch (err) {
      console.error("Profile creation failed:", err);
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      console.log("=== CREATE PROFILE - End ===");
    }
  };

  const clearSignupData = () => {
    setSignupData({});
    signupPersistence.clearSignupData();
  };

  return {
    signupData,
    isLoading,
    updateSignupData,
    createProfile,
    clearSignupData,
  };
};

