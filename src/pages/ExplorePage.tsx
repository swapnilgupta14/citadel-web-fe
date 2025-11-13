import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export const ExplorePage = () => {
  const [selected, setSelected] = useState<
    "interested" | "not-interested" | null
  >(null);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold text-text-primary text-center font-serif mb-4">
          Find university students worldwide with one click!
        </h1>
        <div className="flex gap-3 w-full max-w-[23rem] mt-1">
          <button
            onClick={() =>
              setSelected(selected === "interested" ? null : "interested")
            }
            className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-lg font-semibold text-text-primary bg-background-tertiary active:scale-95 transition-all`}
          >
            <ThumbsUp
              className={`w-5 h-5 text-primary`}
              strokeWidth={selected === "interested" ? 2.5 : 2}
              fill={selected === "interested" ? "currentColor" : "none"}
            />
            <span>Interested</span>
          </button>
          <button
            onClick={() =>
              setSelected(
                selected === "not-interested" ? null : "not-interested"
              )
            }
            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-lg font-semibold text-text-primary bg-background-tertiary border-2 border-transparent active:scale-95 transition-all"
          >
            <ThumbsDown
              className={`w-5 h-5 text-red-500`}
              strokeWidth={selected === "not-interested" ? 2.5 : 2}
              fill={selected === "not-interested" ? "currentColor" : "none"}
            />
            <span>Not Interested</span>
          </button>
        </div>
      </div>
    </div>
  );
};
