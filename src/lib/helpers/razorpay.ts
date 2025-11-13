const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayLoaded = false;
let loadingPromise: Promise<void> | null = null;

export const loadRazorpayScript = (): Promise<void> => {
    if (razorpayLoaded && window.Razorpay) {
        return Promise.resolve();
    }

    if (loadingPromise) {
        return loadingPromise;
    }

    loadingPromise = new Promise((resolve, reject) => {
        if (window.Razorpay) {
            razorpayLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
            razorpayLoaded = true;
            loadingPromise = null;
            resolve();
        };
        script.onerror = () => {
            loadingPromise = null;
            reject(new Error("Failed to load Razorpay script"));
        };
        document.body.appendChild(script);
    });

    return loadingPromise;
};

