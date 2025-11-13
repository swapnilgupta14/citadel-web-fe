import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export const WriteToUsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      console.log("Submitting query:", query);
    }
  };

  const isSubmitDisabled = !query.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col bg-background"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <div className="w-10" />
        <h1 className="text-base font-semibold text-text-primary">
          Help & Support
        </h1>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 active:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6 pb-6 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Write to us with your query
        </h2>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write here..."
          className="w-full min-h-[200px] p-4 bg-background-secondary rounded-xl text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-base leading-relaxed"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`mt-6 w-full py-4 px-6 rounded-xl font-medium text-base transition-all ${
            isSubmitDisabled
              ? "bg-background-secondary text-text-secondary cursor-not-allowed"
              : "bg-primary text-background active:scale-[0.98] transition-transform"
          }`}
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
};
