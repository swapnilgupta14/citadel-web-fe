import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import type { DateOfBirthPageProps } from "../types/pages";

export const DateOfBirthPage = ({
  onBack,
  onContinue,
}: DateOfBirthPageProps) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDayChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 2) value = value.slice(0, 2);
    setDay(value);
    if (value.length === 2 && month.length < 2) {
      inputRefs.current[1]?.focus();
    }
  };

  const handleMonthChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 2) value = value.slice(0, 2);
    setMonth(value);
    if (value.length === 2 && year.length < 4) {
      inputRefs.current[2]?.focus();
    }
  };

  const handleYearChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 4) value = value.slice(0, 4);
    setYear(value);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (index === 0 && !day) return;
      if (index === 1 && !month) {
        inputRefs.current[0]?.focus();
        return;
      }
      if (index === 2 && !year) {
        inputRefs.current[1]?.focus();
        return;
      }
    }
  };

  const dateInputs = [
    {
      id: "dob-day",
      key: "day",
      placeholder: "DD",
      maxLength: 2,
      width: "w-[50px]",
      value: day,
      onChange: handleDayChange,
      index: 0,
    },
    {
      id: "dob-month",
      key: "month",
      placeholder: "MM",
      maxLength: 2,
      width: "w-[50px]",
      value: month,
      onChange: handleMonthChange,
      index: 1,
    },
    {
      id: "dob-year",
      key: "year",
      placeholder: "YYYY",
      maxLength: 4,
      width: "w-[75px]",
      value: year,
      onChange: handleYearChange,
      index: 2,
    },
  ];

  const isValid =
    day.length === 2 &&
    month.length === 2 &&
    year.length === 4 &&
    parseInt(day) >= 1 &&
    parseInt(day) <= 31 &&
    parseInt(month) >= 1 &&
    parseInt(month) <= 12 &&
    parseInt(year) >= 1900 &&
    parseInt(year) <= new Date().getFullYear();

  const handleContinue = () => {
    if (isValid) {
      onContinue({ day, month, year });
    }
  };

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
          Date of birth
        </h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0">
        <div className="flex gap-3">
          {dateInputs.map((input) => (
            <input
              key={input.key}
              id={input.id}
              ref={(el) => {
                inputRefs.current[input.index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={input.maxLength}
              value={input.value}
              onChange={(e) => input.onChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(input.index, e)}
              placeholder={input.placeholder}
              className={`${input.width} h-[50px] px-2 py-2 bg-button-search rounded-2xl border border-border placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center ${
                input.value ? "text-text-primary" : "text-text-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-4 pb-6">
        <Button
          onClick={handleContinue}
          disabled={!isValid}
          variant={isValid ? "primary" : "disabled"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
