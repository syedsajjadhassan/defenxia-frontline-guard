import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export const QuickActionButton = ({ icon: Icon, label, onClick, className }: QuickActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card p-6 rounded-lg text-center group",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-lg",
        "hover:shadow-primary/20 hover:border-primary/30",
        "active:scale-95",
        "min-h-[120px] flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Icon 
        size={32} 
        className="text-primary group-hover:text-primary-glow transition-colors duration-300" 
      />
      <span className="text-sm font-medium text-foreground group-hover:text-primary-glow transition-colors duration-300">
        {label}
      </span>
    </button>
  );
};