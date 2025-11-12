import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { type LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: LucideIcon;
  title: string;
  iconColor?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  icon: Icon,
  title,
  iconColor = "text-white",
}: ConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/60 z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-background-secondary rounded-2xl p-6 w-full max-w-[20rem] pointer-events-auto"
            >
              <div className="flex justify-center mb-4">
                <div className="w-[34px] h-[34px] rounded-xl bg-background-tertiary flex items-center justify-center">
                  <Icon
                    className={`w-[16px] h-[16px] ${iconColor}`}
                    strokeWidth={2}
                  />
                </div>
              </div>

              <h2 className="text-base font-medium text-text-primary text-center mb-6 leading-tight">
                {title}
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-4 rounded-xl text-primary font-medium text-[15px] active:scale-95 transition-transform"
                  style={{
                    border: "1px solid #2C2C2C",
                    backgroundColor: "#111111",
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl text-red-500 font-medium text-[15px] active:scale-95 transition-transform"
                  style={{
                    border: "1px solid #2C2C2C",
                    backgroundColor: "#111111",
                  }}
                >
                  No
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
