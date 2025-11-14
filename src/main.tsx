import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

// Aggressively preload splash sequence video on app mount
const preloadSplashVideo = () => {
  const video = document.createElement("video");
  video.src = "/Sequence.mp4";
  video.preload = "auto";
  video.load();
  
  // Force browser to cache the video
  video.addEventListener("canplaythrough", () => {
    // Video is ready and cached
  });
  
  // Store reference to prevent garbage collection
  (window as any).__splashVideoPreload = video;
};

// Preload video immediately
preloadSplashVideo();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
          containerStyle={{
            top: 20,
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
