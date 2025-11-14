import { cn } from "@/lib/helpers/utils";

type ImageGrid2Props = {
  className?: string;
};

export const ImageGrid2 = ({ className = "" }: ImageGrid2Props) => {
  return (
    <div className={cn("relative w-full mx-auto", className)}>
      <div
        className="relative w-full flex items-center justify-center"
        style={{ aspectRatio: "1 / 1" }}
      >
        <div className="grid grid-cols-2 gap-3 items-end w-full">
          <div
            className={cn(
              "relative",
              "w-[73%]",
              "justify-self-end",
              "rounded-tl-full rounded-tr-full rounded-bl-full",
              "overflow-hidden"
            )}
            style={{ aspectRatio: "102 / 134" }}
          >
            <img
              src="/Splash/Rectangle1.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-150"
            />
          </div>

          <div
            className={cn(
              "relative",
              "w-[96%]",
              "justify-self-start",
              "rounded-tl-full rounded-tr-full rounded-br-full",
              "overflow-hidden",
              "bg-blue-200"
            )}
            style={{ aspectRatio: "134 / 176" }}
          >
            <img
              src="/Splash/Rectangle2.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-150"
            />
          </div>

          <div
            className={cn(
              "relative",
              "w-[96%]",
              "justify-self-end self-start",
              "rounded-tl-full rounded-bl-full rounded-br-full",
              "overflow-hidden"
            )}
            style={{ aspectRatio: "134 / 176" }}
          >
            <img
              src="/Splash/Rectangle3.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-150"
            />
          </div>

          <div
            className={cn(
              "relative",
              "w-[73%]",
              "self-start",
              "rounded-tr-full rounded-bl-full rounded-br-full",
              "overflow-hidden"
            )}
            style={{ aspectRatio: "102 / 134" }}
          >
            <img
              src="/Splash/Rectangle4.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-150"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
