import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { firstVisit } from "../lib/storage/firstVisit";
import { cn } from "../lib/helpers/utils";

interface SplashSequenceProps {
  onComplete: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  isRight: boolean;
}

const chatMessages: ChatMessage[] = [
  { id: 1, text: "Hey! Liverpool or Arsenal?", isRight: true },
  { id: 2, text: "Arsenal... don't hate me 😅", isRight: false },
  { id: 3, text: "Citadel dinner this week?", isRight: true },
  { id: 4, text: "We'll settle this 😉", isRight: true },
  { id: 5, text: "You're on 🍕", isRight: false },
];

export const SplashSequence = ({ onComplete }: SplashSequenceProps) => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [canContinue, setCanContinue] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/Sequence.mp4";
    video.preload = "auto";
    video.load();

    const currentVideo = videoRef.current;

    const handleCanPlay = () => {
      if (currentVideo) {
        currentVideo.play().catch((error) => {
          console.error("Video autoplay failed:", error);
        });
      }
    };

    if (currentVideo) {
      currentVideo.addEventListener("canplaythrough", handleCanPlay);
      currentVideo.load();
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener("canplaythrough", handleCanPlay);
      }
    };
  }, []);

  useEffect(() => {
    const startChatDelay = 4000;

    chatMessages.forEach((_, index) => {
      setTimeout(
        () => {
          setVisibleMessages((prev) => [...prev, index + 1]);
        },
        startChatDelay + index * 600
      );
    });

    const lastMessageDelay = startChatDelay + (chatMessages.length - 1) * 600;
    setTimeout(() => {
      setCanContinue(true);
    }, lastMessageDelay + 100);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current && visibleMessages.length > 0) {
      const container = chatContainerRef.current;
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
      };
      setTimeout(scrollToBottom, 50);
    }
  }, [visibleMessages]);

  const handleContinue = () => {
    if (canContinue) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      firstVisit.markAsVisited();
      onComplete();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[42%] relative overflow-hidden"
      >
        <video
          ref={videoRef}
          src="/Sequence.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.play().catch((error) => {
                console.error("Video play failed:", error);
              });
            }
          }}
          onError={(e) => {
            console.error("Video error:", e);
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex-1 flex flex-col bg-background relative min-h-0"
        style={{ height: "55%" }}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(27, 234, 123, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(27, 234, 123, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div
          ref={chatContainerRef}
          className={cn(
            "flex-1 flex flex-col justify-start px-0 pt-4 gap-5 relative z-10 min-h-0 overflow-y-auto"
          )}
          style={{ paddingBottom: "6rem" }}
        >
          <AnimatePresence>
            {chatMessages.map((message) => {
              const isVisible = visibleMessages.includes(message.id);
              return (
                isVisible && (
                  <motion.div
                    key={message.id}
                    initial={{
                      opacity: 0,
                      x: message.isRight ? 20 : -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex",
                      message.isRight ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center max-w-[75%] px-4 py-2.5 rounded-2xl text-text-primary border border-[#2C2C2C]",
                        message.isRight ? "rounded-r-none" : "rounded-l-none"
                      )}
                      style={{
                        backgroundColor: message.isRight
                          ? "#1A1A1A"
                          : "#111111",
                        height: "4rem",
                      }}
                    >
                      <p className={cn("text-lg font-medium leading-normal")}>
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                )
              );
            })}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-20 bg-background">
          <motion.button
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              "w-full py-4 rounded-full font-semibold text-base transition-all",
              canContinue
                ? "bg-primary text-background active:scale-95"
                : "bg-background-tertiary text-black cursor-not-allowed"
            )}
            whileTap={canContinue ? { scale: 0.95 } : {}}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
