import { z } from "zod";

export const emailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    // .refine(
    //     (email) => {
    //         const emailLower = email.toLowerCase().trim();
    //         const domain = emailLower.split("@")[1];

    //         if (!domain) {
    //             return false;
    //         }

    //         const universityDomains = [
    //             ".edu",
    //             ".ac.in",
    //             ".edu.in",
    //             ".ac.uk",
    //             ".edu.au",
    //         ];

    //         return universityDomains.some((univDomain) =>
    //             domain.endsWith(univDomain)
    //         );
    //     },
    //     {
    //         message: "Please use your university email address (e.g., @university.edu)",
    //     }
    // );

export const otpSchema = z
    .string()
    .length(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers");

export const nameSchema = z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

export const genderSchema = z.enum(["male", "female", "other"], {
    message: "Please select a gender",
});

export const dateOfBirthSchema = z.object({
    day: z
        .string()
        .min(1, "Day is required")
        .regex(/^\d{2}$/, "Day must be 2 digits")
        .refine((val) => {
            const day = parseInt(val);
            return day >= 1 && day <= 31;
        }, "Day must be between 1 and 31"),
    month: z
        .string()
        .min(1, "Month is required")
        .regex(/^\d{2}$/, "Month must be 2 digits")
        .refine((val) => {
            const month = parseInt(val);
            return month >= 1 && month <= 12;
        }, "Month must be between 1 and 12"),
    year: z
        .string()
        .min(1, "Year is required")
        .regex(/^\d{4}$/, "Year must be 4 digits")
        .refine((val) => {
            const year = parseInt(val);
            const currentYear = new Date().getFullYear();
            return year >= 1900 && year <= currentYear;
        }, `Year must be between 1900 and ${new Date().getFullYear()}`),
}).refine(
    (data) => {
        const day = parseInt(data.day);
        const month = parseInt(data.month);
        const year = parseInt(data.year);
        const date = new Date(year, month - 1, day);
        return (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
        );
    },
    {
        message: "Please enter a valid date",
        path: ["day"],
    }
);

export const degreeSchema = z
    .string()
    .min(1, "Degree is required")
    .min(2, "Degree must be at least 2 characters");

export const yearSchema = z
    .string()
    .min(1, "Year is required")
    .refine(
        (val) => ["1st", "2nd", "3rd", "4th", "5th"].includes(val),
        "Please select a valid year"
    );

export const universityIdSchema = z
    .string()
    .min(1, "University selection is required");

