import toast from "react-hot-toast";

export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            duration: 3000,
            position: "top-center",
            style: {
                background: "#1BEA7B",
                color: "#000000",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                maxWidth: "90%",
            },
        });
    },

    error: (message: string) => {
        toast.dismiss("error-toast");
        toast.error(message, {
            id: "error-toast",
            duration: 3000,
            position: "top-center",
            style: {
                background: "#EF4444",
                color: "#FFFFFF",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                maxWidth: "90%",
            },
        });
    },

    info: (message: string) => {
        toast(message, {
            duration: 3000,
            position: "top-center",
            style: {
                background: "#2C2C2C",
                color: "#FFFFFF",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                maxWidth: "90%",
            },
        });
    },

    loading: (message: string) => {
        return toast.loading(message, {
            position: "top-center",
            style: {
                background: "#2C2C2C",
                color: "#FFFFFF",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                maxWidth: "90%",
            },
        });
    },

    dismiss: (toastId: string) => {
        toast.dismiss(toastId);
    },
};

export const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "An unexpected error occurred. Please try again.";
};

export const handleApiSuccess = (message?: string): string => {
    return message || "Operation completed successfully";
};

