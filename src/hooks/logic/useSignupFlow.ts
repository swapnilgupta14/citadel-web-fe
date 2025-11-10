import { useState, useEffect } from "react";
import { profileApi } from "../../services/api";
import { signupPersistence } from "../../lib/signupPersistence";
import { auth } from "../../lib/auth";
import { showToast, handleApiError } from "../../lib/toast";

export type SignupData = {
  universityId?: string;
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

  const createProfile = async (data: { degree: string; year: string }) => {
    if (
      !signupData.universityId ||
      !signupData.name ||
      !signupData.gender ||
      !signupData.dateOfBirth
    ) {
      const errorMessage =
        "Missing required information. Please go back and complete all fields.";
      showToast.error(errorMessage);
      return false;
    }

    const updatedData = { ...signupData, degree: data.degree, year: data.year };
    setSignupData(updatedData);
    signupPersistence.saveSignupData(updatedData);

    setIsLoading(true);

    try {
      await profileApi.createProfile({
        name: signupData.name,
        dateOfBirth: signupData.dateOfBirth,
        gender: signupData.gender,
        universityId: signupData.universityId,
        degree: data.degree,
        year: data.year,
      });
      showToast.success("Profile created successfully!");
      signupPersistence.clearSignupData();
      
      const userData = auth.getUserData();
      if (userData) {
        auth.setUserData({ ...userData, isProfileComplete: true });
      }
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      showToast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
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

