// components/ui/customProgressBar.tsx

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={`relative w-full h-4 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="absolute top-0 left-0 h-full bg-primary transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
