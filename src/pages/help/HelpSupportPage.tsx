import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Search, PhoneIncoming } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    id: "faq_001",
    question: "How do I book an event?",
    answer:
      "To book an event, navigate to the Events page, select your preferred event slot, and complete the payment process. You'll receive a confirmation once your booking is successful.",
    category: "Events",
  },
  {
    id: "faq_002",
    question: "How can I update my profile?",
    answer:
      "Go to your Profile page and tap on any field you want to update. You can change your name, photos, and other details. Tap on your profile picture to replace or delete it.",
    category: "Profile",
  },
  {
    id: "faq_003",
    question: "What payment methods are accepted?",
    answer:
      "We currently accept payments through Razorpay. You can use credit cards, debit cards, UPI, and net banking to complete your event bookings.",
    category: "Payment",
  },
  {
    id: "faq_004",
    question: "Can I cancel my event booking?",
    answer:
      "Yes, you can cancel your booking up to 24 hours before the event. Go to your Event Bookings section in the Profile page and select the booking you want to cancel.",
    category: "Events",
  },
  {
    id: "faq_005",
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the Help & Support section in your Profile. We typically respond within 24 hours. For urgent matters, you can also use the contact options available on this page.",
    category: "Support",
  },
];

export const HelpSupportPage = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleWriteToUs = () => {
    console.log("Write to us clicked");
  };

  const handleCallUs = () => {
    console.log("Call us clicked");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-4 px-2 py-4 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-2xl font-semibold text-text-primary font-serif flex-1">
          Help & Support
        </h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="flex gap-4 mb-8 pb-8 border-b border-dashed border-background-tertiary">
          <button
            onClick={handleWriteToUs}
            className="flex-1 flex flex-col items-start gap-4 p-4 bg-background-secondary rounded-xl active:scale-[0.98] transition-transform"
          >
            <Search className="w-5 h-5 text-primary" strokeWidth={2} />
            <span className="text-sm text-text-primary leading-tight text-start">
              Write to us with your query
            </span>
          </button>
          <button
            onClick={handleCallUs}
            className="flex-1 flex flex-col items-start gap-4 p-4 bg-background-secondary rounded-xl active:scale-[0.98] transition-transform"
          >
            <PhoneIncoming className="w-5 h-5 text-primary" strokeWidth={2} />
            <span className="text-sm text-text-primary leading-tight text-start">
              Call us with your query
            </span>
          </button>
        </div>

        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqItems.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-background-secondary border border-background-tertiary rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left active:opacity-70 transition-opacity"
                >
                  <span className="text-[15px] font-medium text-text-primary pr-4 flex-1">
                    {item.question}
                  </span>
                  {isExpanded ? (
                    <Minus
                      className="w-5 h-5 text-primary flex-shrink-0"
                      strokeWidth={2}
                    />
                  ) : (
                    <Plus
                      className="w-5 h-5 text-primary flex-shrink-0"
                      strokeWidth={2}
                    />
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
