import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-[#ffa41c]">
        {[1, 2, 3, 4, 5].map((index) => {
          if (value >= index) {
            return <Star key={index} fill="currentColor" strokeWidth={1.5} size={15} />;
          } else if (value >= index - 0.5) {
            return <StarHalf key={index} fill="currentColor" strokeWidth={1.5} size={15} />;
          } else {
            return <Star key={index} strokeWidth={1.5} size={15} className="text-gray-200" />;
          }
        })}
      </div>
      {text && <span className="text-xs font-bold text-blue-600 hover:text-brand-accent transition-colors truncate">{text}</span>}
    </div>
  );
};
export default Rating;
