import { ImageGrid2 } from "../components/ui/image/ImageGrid2";

export const TestPage = () => {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center">
        <ImageGrid2 />
      </div>
    </div>
  );
};
