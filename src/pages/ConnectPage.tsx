import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";
import { ImageGrid2 } from "../components/ui/image/ImageGrid2";
import { signupPersistence } from "../lib/storage/signupPersistence";

const BASE_SCREEN_HEIGHT = 852;
const BASE_IMAGE_GRID_HEIGHT = 350;

interface ConnectPageProps {
  onContinue: () => void;
}

export const ConnectPage = ({ onContinue }: ConnectPageProps) => {
  const navigate = useNavigate();
  const [imageGridHeight, setImageGridHeight] = useState(350);

  useEffect(() => {
    signupPersistence.clearSignupData();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/Splash/waves.svg";
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const viewportHeight = window.innerHeight;
      const scale = viewportHeight / BASE_SCREEN_HEIGHT;
      const scaledHeight = BASE_IMAGE_GRID_HEIGHT * scale;
      setImageGridHeight(scaledHeight);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="relative flex h-full flex-col bg-background overflow-hidden">
      <div className="flex flex-col flex-1 relative z-10 min-h-0 pb-4 justify-center gap-6">
        <div
          className="flex items-center justify-center relative"
          style={{ height: `${imageGridHeight}px`, minHeight: "200px" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <ImageGrid2 className="w-3/5" />
          </div>
        </div>

        <div className="flex flex-col px-6 py-4 pb-6 items-center gap-6 min-h-0 justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl leading-tight font-bold text-text-primary text-center font-serif">
              Connect with students across universities
            </h1>
          </div>

          <div className="w-4/5">
            <Button onClick={onContinue} variant="primary">
              Let's go
            </Button>
          </div>

          <button
            onClick={() => {
              navigate("/login");
            }}
            className="text-center text-sm text-text-secondary active:opacity-70 transition-opacity"
          >
            Already a user?{" "}
            <span className="text-text-primary underline font-medium">
              Login
            </span>
          </button>
        </div>
      </div>

      <div className="h-[7%] min-h-[75px] max-h-[100px] overflow-visible pointer-events-none relative">
        <img
          src="/Splash/waves.svg"
          alt=""
          className="absolute inset-0 h-full object-none w-full overflow-visible"
        />
      </div>
    </div>
  );
};
