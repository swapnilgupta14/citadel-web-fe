import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "privacy" | "terms";

const privacyPolicyContent = {
  intro:
    "Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.",
  lastUpdated: "Last updated: January 2024",
  sections: [
    {
      title: "Information We Collect",
      content:
        "We collect information that you provide directly to us, including your name, email address, profile information, and any other information you choose to provide. We also automatically collect certain information about your device and how you interact with our service.",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services, process your requests, communicate with you, and personalize your experience. We may also use your information to detect and prevent fraud or abuse.",
    },
    {
      title: "Data Sharing and Disclosure",
      content:
        "We do not sell your personal information. We may share your information with service providers who assist us in operating our service, conducting our business, or serving our users, as long as those parties agree to keep this information confidential.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, update, or delete your personal information at any time. You may also opt out of certain communications from us. If you are located in the European Economic Area, you have additional rights under the GDPR.",
    },
    {
      title: "Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
    },
    {
      title: "Contact Us",
      content:
        "If you have any questions about this Privacy Policy, please contact us through the app or at privacy@citadel.com.",
    },
  ],
};

const termsAndConditionsContent = {
  intro:
    "Please read these Terms and Conditions carefully before using our service. By accessing or using our service, you agree to be bound by these terms.",
  lastUpdated: "Last updated: January 2024",
  sections: [
    {
      title: "Acceptance of Terms",
      content:
        "By creating an account or using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our service.",
    },
    {
      title: "User Accounts",
      content:
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.",
    },
    {
      title: "User Conduct",
      content:
        "You agree not to use the service to violate any laws, infringe upon the rights of others, or transmit any harmful, offensive, or inappropriate content. You may not impersonate others, spam other users, or engage in any activity that disrupts or interferes with the service.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content, features, and functionality of the service are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our service without our express written permission.",
    },
    {
      title: "Termination",
      content:
        "We reserve the right to suspend or terminate your account at any time, with or without cause or notice, for any reason including violation of these Terms. You may also terminate your account at any time by contacting us.",
    },
    {
      title: "Limitation of Liability",
      content:
        "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.",
    },
    {
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these Terms at any time. We will notify users of any material changes. Your continued use of the service after such modifications constitutes acceptance of the updated Terms.",
    },
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
  const [direction, setDirection] = useState<number>(1);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "terms" || tabParam === "privacy") {
      setDirection(tabParam === "terms" ? -1 : 1);
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    // Determine animation direction: -1 for left (privacy -> terms), 1 for right (terms -> privacy)
    setDirection(tab === "terms" ? -1 : 1);
    setActiveTab(tab);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    const swipeThreshold = 50;
    const isHorizontalSwipe =
      Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold;

    if (isHorizontalSwipe) {
      if (deltaX < 0 && activeTab === "privacy") {
        handleTabChange("terms");
      } else if (deltaX > 0 && activeTab === "terms") {
        handleTabChange("privacy");
      }
    }

    swipeStartRef.current = null;
  };

  const getContent = (tab: TabType) => {
    return tab === "privacy" ? privacyPolicyContent : termsAndConditionsContent;
  };

  const ContentPane = ({ tab }: { tab: TabType }) => {
    const content = getContent(tab);
    return (
      <div className="text-sm text-text-primary leading-tight space-y-6">
        <div className="space-y-4">
          <p>{content.intro}</p>
          {content.lastUpdated && (
            <p className="text-text-secondary text-xs">{content.lastUpdated}</p>
          )}
        </div>
        {content.sections && (
          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-base font-semibold text-text-primary">
                  {section.title}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const headerTitle =
    activeTab === "privacy" ? "Privacy policy" : "Terms and conditions";

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
        <h1 className="text-2xl font-semibold text-text-primary font-serif flex-1 truncate">
          {headerTitle}
        </h1>
      </div>

      <div className="flex border-b border-border flex-shrink-0">
        <button
          onClick={() => handleTabChange("privacy")}
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
          onClick={() => handleTabChange("terms")}
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

      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="h-full overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] absolute inset-0"
          >
            <ContentPane tab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
