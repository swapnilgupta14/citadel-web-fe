import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

type TabType = "privacy" | "terms";

const privacyPolicyContent = {
  intro:
    "Unlike Privacy Policies, which are required by laws such as the GDPR, CalOPPA and many others, there's no law or regulation on Terms and Conditions.",
  paragraph:
    "However, having a Terms and Conditions gives you the right to terminate the access of abusive users or to terminate the access to users who do not follow your rules and guidelines, as well as other desirable business benefits.",
  importance:
    "It's extremely important to have this agreement if you operate a SaaS app.",
  examplesTitle: "Here are a few examples of how this agreement can help you:",
  bullets: [
    'If users abuse your website or mobile app in any way, you can terminate their account. Your "Termination" clause can inform users that their account would be terminated if they abuse your service.',
    "If users can post content on your website or mobile app (create content and share it on your platform), you can remove any content they created if it infringes copyright. Your Terms and Conditions will inform users that they can only create and/or share content they own rights to. Similarly, if users can register for an account and choose a username, you can inform users that they are not allowed to choose usernames that may infringe trademarks, i.e. usernames like Google, Facebook, and so on.",
    "If you sell products or services, you could cancel specific orders if a product price is incorrect. Your Terms and Conditions can include a clause to inform users that certain orders, at your sole discretion, can be cancelled if the products ordered have incorrect prices due to various errors.",
  ],
};

const termsAndConditionsContent = {
  intro:
    "Unlike Privacy Policies, which are required by laws such as the GDPR, CalOPPA and many others, there's no law or regulation on Terms and Conditions.",
  paragraph:
    "However, having a Terms and Conditions gives you the right to terminate the access of abusive users or to terminate the access to users who do not follow your rules and guidelines, as well as other desirable business benefits.",
  importance:
    "It's extremely important to have this agreement if you operate a SaaS app.",
  examplesTitle: "Here are a few examples of how this agreement can help you:",
  bullets: [
    'If users abuse your website or mobile app in any way, you can terminate their account. Your "Termination" clause can inform users that their account would be terminated if they abuse your service.',
    "If users can post content on your website or mobile app (create content and share it on your platform), you can remove any content they created if it infringes copyright. Your Terms and Conditions will inform users that they can only create and/or share content they own rights to. Similarly, if users can register for an account and choose a username, you can inform users that they are not allowed to choose usernames that may infringe trademarks, i.e. usernames like Google, Facebook, and so on.",
    "If you sell products or services, you could cancel specific orders if a product price is incorrect. Your Terms and Conditions can include a clause to inform users that certain orders, at your sole discretion, can be cancelled if the products ordered have incorrect prices due to various errors.",
  ],
};

export const PrivacyPolicyTermsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getInitialTab = (): TabType => {
    const tabParam = searchParams.get("tab");
    return tabParam === "terms" ? "terms" : "privacy";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "terms" || tabParam === "privacy") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const content =
    activeTab === "privacy" ? privacyPolicyContent : termsAndConditionsContent;

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
          Privacy policy and T&C
        </h1>
      </div>

      <div className="flex border-b border-border flex-shrink-0">
        <button
          onClick={() => setActiveTab("privacy")}
          className={`flex-1 py-4 px-2 text-base font-medium transition-colors relative ${
            activeTab === "privacy"
              ? "text-text-primary"
              : "text-text-secondary"
          }`}
        >
          Privacy policy
          {activeTab === "privacy" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`flex-1 py-4 px-2 text-base font-medium transition-colors relative ${
            activeTab === "terms" ? "text-text-primary" : "text-text-secondary"
          }`}
        >
          Terms and conditions
          {activeTab === "terms" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="text-sm text-text-primary leading-tight space-y-4">
          <p>{content.intro}</p>
          <p>{content.paragraph}</p>
          <p>{content.importance}</p>
          <p>{content.examplesTitle}</p>
          <ul className="space-y-3 list-disc list-inside pl-2">
            {content.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
