import { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "../components/ui/SearchBar";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { useUniversities } from "../hooks/useUniversities";
import type { University } from "../types/universities";
import type { UniversitySelectionPageProps } from "../types/pages";

export const UniversitySelectionPage = ({
  onBack,
  onContinue,
}: UniversitySelectionPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isFetching, isError, error } = useUniversities({
    search: debouncedSearchQuery.trim(),
    limit: 50,
    offset: 0,
  });

  const shouldShowResults = useMemo(() => {
    if (!searchQuery.trim()) return false;
    if (selectedUniversity && searchQuery === selectedUniversity.name) {
      return false;
    }
    return true;
  }, [searchQuery, selectedUniversity]);

  const searchResults = useMemo(() => {
    if (!data?.universities) return [];
    return data.universities;
  }, [data]);

  const isSearching = isLoading || isFetching;
  const hasResults = searchResults.length > 0;

  const handleSelectUniversity = (university: University) => {
    setSelectedUniversity(university);
    setSearchQuery(university.name);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (selectedUniversity && value !== selectedUniversity.name) {
      setSelectedUniversity(null);
    }
  };

  const isContinueEnabled = selectedUniversity !== null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col pt-4 px-4 pb-2">
        <button
          onClick={onBack}
          className="self-start mb-4 p-2 -ml-2 active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-4xl leading-tight font-bold text-text-primary font-serif">
          Your university
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 rounded-md text-text-secondary">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search colleges"
          className="mb-4"
        />

        <AnimatePresence>
          {shouldShowResults &&
            (isSearching || hasResults || isError || (data && !hasResults)) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto min-h-0"
              >
                {isSearching ? (
                  <Skeleton count={5} />
                ) : isError ? (
                  <div className="flex items-center justify-center py-8 px-4">
                    <p className="text-text-secondary text-center">
                      {error instanceof Error
                        ? error.message
                        : "Failed to load universities. Please try again."}
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex flex-col gap-0 rounded-lg overflow-hidden"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                  >
                    {hasResults ? (
                      searchResults.map((university) => (
                        <button
                          key={university.id}
                          onClick={() => handleSelectUniversity(university)}
                          className="w-full text-left py-4 px-5 border-b border-border bg-background-secondary hover:bg-background active:bg-background transition-colors text-text-primary"
                        >
                          {university.name}
                        </button>
                      ))
                    ) : (
                      <div className="bg-background flex items-center justify-center py-8 px-4">
                        <p className="text-text-secondary text-center">
                          No universities found
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {!shouldShowResults && (
        <div className="px-6 py-4 pb-6">
          <Button
            onClick={isContinueEnabled ? onContinue : undefined}
            disabled={!isContinueEnabled}
            variant={isContinueEnabled ? "primary" : "disabled"}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};
