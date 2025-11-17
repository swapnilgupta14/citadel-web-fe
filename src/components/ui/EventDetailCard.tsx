import { MapPin, ChevronRight, Star } from "lucide-react";
import { ImageWithPlaceholder } from "./image/ImageWithPlaceholder";
import { getLandmarkImage } from "../../lib/helpers/eventUtils";

interface EventDetailCardProps {
  title?: string;
  subtitle?: string;
  maxAttendees?: number;
  formattedDate: string;
  formattedTime: string;
  area: string;
  city: string;
  showRating?: boolean;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  bookingFee?: number;
  showBookedButton?: boolean;
  onGuidelinesClick: () => void;
}

export const EventDetailCard = ({
  title,
  subtitle,
  maxAttendees,
  formattedDate,
  formattedTime,
  area,
  city,
  bookingFee,
  showRating = false,
  rating = 0,
  onRatingChange,
  showBookedButton = false,
  onGuidelinesClick,
}: EventDetailCardProps) => {
  return (
    <div className="bg-background-secondary rounded-2xl p-4 mb-4 relative z-10 overflow-hidden">
      <div className="relative flex flex-col gap-4">
        <div className="pr-24">
          <p className="text-text-primary text-base font-semibold">
            {title || "To be revealed"}
          </p>
          <p className="text-text-secondary text-sm">
            {subtitle || (maxAttendees ? `${maxAttendees} guests` : "")}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-sm">Date & Time</p>
          <p className="text-text-primary text-base font-semibold">
            {formattedDate} | {formattedTime}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-sm">Location</p>
          <div className="flex items-center justify-between">
            <p className="text-text-primary text-base font-semibold">
              {area}, {city}
            </p>
            <MapPin className="w-5 h-5 text-text-primary" strokeWidth={2} />
          </div>
        </div>

        {showRating && (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-sm">Tell us</p>
              <p className="text-text-primary text-sm font-semibold">
                Your experience
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRatingChange?.(star)}
                  className="active:scale-95 transition-transform"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating
                        ? "fill-white text-white"
                        : "text-text-secondary"
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="my-1">
          <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#2C2C2C"
              strokeWidth="1"
              strokeDasharray="8 6"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between">
          {showBookedButton ? (
            <button
              disabled
              className="px-4 py-1.5 bg-primary text-background rounded-xl text-base font-semibold cursor-not-allowed opacity-70"
            >
              Booked
            </button>
          ) : (
            bookingFee !== undefined && (
              <div className="px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-lg font-bold">
                Rs {bookingFee}
              </div>
            )
          )}
          <button
            onClick={onGuidelinesClick}
            className="text-text-primary text-base font-medium active:opacity-70 transition-opacity flex items-center gap-1"
          >
            Guidelines <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="absolute top-6 right-6 w-[2.8rem] h-[2.8rem] rounded-2xl overflow-hidden">
        <ImageWithPlaceholder
          src={getLandmarkImage(city?.toLowerCase().replace(/\s+/g, "-") || "")}
          alt={city || "City"}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
