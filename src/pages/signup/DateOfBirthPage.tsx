import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";
import type { DateOfBirthPageProps } from "../../types/pages";
import { dateOfBirthSchema } from "../../lib/helpers/validations";
import { useKeyboardHeight } from "../../hooks/logic";

export const DateOfBirthPage = ({
  onBack,
  onContinue,
  initialDateOfBirth,
}: DateOfBirthPageProps) => {
  const parseDateOfBirth = (dob?: string) => {
    if (!dob) return { day: "", month: "", year: "" };
    const parts = dob.split("-");
    if (parts.length === 3) {
      return { year: parts[0], month: parts[1], day: parts[2] };
    }
    return { day: "", month: "", year: "" };
  };

  const initialValues = parseDateOfBirth(initialDateOfBirth);
  const [day, setDay] = useState(initialValues.day);
  const [month, setMonth] = useState(initialValues.month);
  const [year, setYear] = useState(initialValues.year);

  useEffect(() => {
    const parsed = parseDateOfBirth(initialDateOfBirth);
    setDay(parsed.day);
    setMonth(parsed.month);
    setYear(parsed.year);
  }, [initialDateOfBirth]);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const keyboardHeight = useKeyboardHeight();
  const buttonRef = useRef<HTMLDivElement>(null);

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

  const validateDateOfBirth = () => {
    const result = dateOfBirthSchema.safeParse({ day, month, year });
    if (!result.success) {
      const firstError = result.error.issues[0];
      setError(firstError.message);
      return false;
    }
    setError(null);
    return true;
  };

  const handleContinue = () => {
    setTouched(true);
    if (validateDateOfBirth()) {
      onContinue({ day, month, year });
    }
  };

  const isComplete = day.length === 2 && month.length === 2 && year.length === 4;
  
  const isDateValid = () => {
    if (!isComplete) return false;
    const result = dateOfBirthSchema.safeParse({ day, month, year });
    return result.success;
  };
  
  const isValid = isDateValid();

  useEffect(() => {
    if (keyboardHeight > 0 && buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [keyboardHeight]);

  const handleInputFocus = () => {
    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300);
    }
  };
  
  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="flex flex-col pt-4 px-4 pb-2 flex-shrink-0">
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

      <div className="flex-1 flex flex-col px-4 py-4 min-h-0 gap-2 flex-shrink-0">
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
              onChange={(e) => {
                input.onChange(e.target.value);
                if (touched && isComplete) {
                  validateDateOfBirth();
                }
              }}
              onFocus={handleInputFocus}
              onKeyDown={(e) => handleKeyDown(input.index, e)}
              onBlur={() => {
                if (isComplete) {
                  setTouched(true);
                  validateDateOfBirth();
                }
              }}
              placeholder={input.placeholder}
              className={`${input.width} h-[50px] px-2 py-2 bg-button-search rounded-2xl border placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center ${
                input.value ? "text-text-primary" : "text-text-secondary"
              } ${
                error && touched
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border"
              }`}
            />
          ))}
        </div>
        {error && touched && (
          <p className="text-sm text-red-500 px-1">{error}</p>
        )}
      </div>

      <div 
        ref={buttonRef}
        className="px-6 py-4 pb-6 flex-shrink-0"
        style={{ 
          paddingBottom: keyboardHeight > 0 ? `${Math.max(24, keyboardHeight + 16)}px` : '24px'
        }}
      >
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
