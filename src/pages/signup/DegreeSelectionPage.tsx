import { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar, Button } from "../../components/ui";
import type { DegreeSelectionPageProps } from "../../types/pages";
import { degreeSchema, yearSchema } from "../../lib/helpers/validations";

const MOCK_DEGREES = [
  "B.Tech",
  "B.Des",
  "B.A.",
  "B.Sc",
  "BBA",
  "M.Tech",
  "M.A.",
  "PhD",
  "B.Pharm",
  "MCA",
  "LLB",
];

export const DegreeSelectionPage = ({
  onBack,
  onContinue,
  initialDegree,
  initialYear,
  isLoading = false,
}: DegreeSelectionPageProps) => {
  const [searchQuery, setSearchQuery] = useState(initialDegree || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<string | null>(initialDegree || null);
  const [selectedYear, setSelectedYear] = useState<string | null>(initialYear || null);

  useEffect(() => {
    if (initialDegree) {
      setSelectedDegree(initialDegree);
      setSearchQuery(initialDegree);
    }
    if (initialYear) {
      setSelectedYear(initialYear);
    }
  }, [initialDegree, initialYear]);
  const [degreeError, setDegreeError] = useState<string | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setDebouncedSearchQuery("");
    }
  }, [searchQuery]);

  const filteredDegrees = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return MOCK_DEGREES;
    return MOCK_DEGREES.filter((degree) =>
      degree.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery]);

  const shouldShowResults = useMemo(() => {
    if (selectedDegree && searchQuery === selectedDegree) {
      return false;
    }
    return true;
  }, [searchQuery, selectedDegree]);

  const hasResults = filteredDegrees.length > 0;


  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (selectedDegree && value !== selectedDegree) {
      setSelectedDegree(null);
      setSelectedYear(null);
    }
  };

  const validateDegree = (value: string | null) => {
    if (value === null) {
      setDegreeError("Please select a degree");
      return false;
    }
    const result = degreeSchema.safeParse(value);
    if (!result.success) {
      setDegreeError(result.error.issues[0].message);
      return false;
    }
    setDegreeError(null);
    return true;
  };

  const validateYear = (value: string | null) => {
    if (value === null) {
      setYearError("Please select a year");
      return false;
    }
    const result = yearSchema.safeParse(value);
    if (!result.success) {
      setYearError(result.error.issues[0].message);
      return false;
    }
    setYearError(null);
    return true;
  };

  const handleSelectDegree = (degree: string) => {
    setSelectedDegree(degree);
    setSearchQuery(degree);
    if (touched) {
      validateDegree(degree);
    }
  };

  const handleSelectYear = (year: string) => {
    setSelectedYear(year);
    if (touched) {
      validateYear(year);
    }
  };

  const handleContinue = () => {
    setTouched(true);
    const isDegreeValid = validateDegree(selectedDegree);
    const isYearValid = validateYear(selectedYear);

    if (isDegreeValid && isYearValid && selectedDegree && selectedYear) {
      onContinue({
        degree: selectedDegree,
        year: selectedYear,
      });
    }
  };

  const isDegreeValid = () => {
    if (!selectedDegree || !selectedYear) return false;
    const degreeResult = degreeSchema.safeParse(selectedDegree);
    const yearResult = yearSchema.safeParse(selectedYear);
    return degreeResult.success && yearResult.success;
  };

  const isContinueEnabled = isDegreeValid();

  const years = ["1st", "2nd", "3rd", "4th", "5th"];

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex flex-col pt-4 px-4 pb-2">
        <button
          onClick={onBack}
          className="self-start mb-4 p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-4xl leading-tight font-bold text-text-primary font-serif">
          Your degree?
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 rounded-md text-text-secondary">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Select your degree"
          className={selectedDegree ? "mb-6" : "mb-0"}
        />

        <AnimatePresence>
          {selectedDegree && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-6 overflow-hidden"
            >
              <label className="block text-text-primary mb-3 text-base">
                Year
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  {years.map((year) => (
                    <motion.button
                      key={year}
                      onClick={() => handleSelectYear(year)}
                      layout
                      transition={{
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                      className={`w-[3.5rem] px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ease-out ${
                        selectedYear === year
                          ? "bg-primary text-background border-transparent"
                          : yearError && touched
                          ? "bg-button-search text-text-primary border-red-500"
                          : "bg-button-search text-text-primary border-border"
                      }`}
                    >
                      {year}
                    </motion.button>
                  ))}
                </div>
                {yearError && touched && (
                  <p className="text-sm text-red-500 px-1">{yearError}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {shouldShowResults && hasResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto min-h-0"
            >
              <div
                className="flex flex-col gap-0 rounded-lg overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
              >
                {filteredDegrees.map((degree, index) => (
                  <button
                    key={`${degree}-${index}`}
                    onClick={() => handleSelectDegree(degree)}
                    className="w-full text-left py-4 px-5 border-b border-border bg-background-secondary hover:bg-background active:bg-background transition-colors text-text-primary"
                  >
                    {degree}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!shouldShowResults && (
        <div className="px-6 py-4 pb-6">
          {degreeError && touched && (
            <p className="text-sm text-red-500 mb-2 px-1">{degreeError}</p>
          )}
          <Button
            onClick={handleContinue}
            disabled={!isContinueEnabled}
            variant={isContinueEnabled ? "primary" : "disabled"}
            isLoading={isLoading}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};
