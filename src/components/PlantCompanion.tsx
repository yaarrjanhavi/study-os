import { useState } from "react";
import { motion } from "framer-motion";
import { Flower } from "lucide-react";

export default function PlantCompanion() {
  const [swayCount, setSwayCount] = useState(0);
  const [blossomed, setBlossomed] = useState(false);

  const handlePlantClick = () => {
    setSwayCount(prev => prev + 1);
    setBlossomed(true);
    setTimeout(() => {
      setBlossomed(false);
    }, 2500); // Flower blossoms for 2.5s
  };

  return (
    <div 
      onClick={handlePlantClick}
      className="flex flex-col items-center justify-center p-2.5 cursor-pointer relative group transition-transform active:scale-95 select-none"
      title="Click to nurture your desk plant"
    >
      {/* Blossoming Flower overlay */}
      <div className="absolute -top-3 h-5 flex items-center justify-center">
        {blossomed && (
          <motion.div
            initial={{ scale: 0, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-red-400"
          >
            <Flower className="w-4 h-4 fill-current" />
          </motion.div>
        )}
      </div>

      {/* Animated SVG Plant */}
      <svg 
        viewBox="0 0 100 100" 
        className={`w-16 h-16 text-viridian transition-transform duration-500
          ${swayCount % 2 === 0 ? "animate-sway" : "rotate-6"}
        `}
      >
        {/* Pot */}
        <path d="M35,65 L65,65 L60,85 L40,85 Z" fill="var(--color-stone)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="32" y="60" width="36" height="6" rx="2" fill="var(--color-stone-dark)" stroke="currentColor" strokeWidth="2" />
        
        {/* Soil */}
        <ellipse cx="50" cy="60" rx="14" ry="2" fill="#5A4A42" />

        {/* Stem 1 */}
        <path d="M50,60 Q45,35 32,38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaf 1 */}
        <path d="M32,38 C28,34 30,26 38,30 C38,32 36,38 32,38" fill="var(--color-honeydew)" stroke="currentColor" strokeWidth="1.5" />

        {/* Stem 2 (Right stem) */}
        <path d="M50,60 Q55,42 68,45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaf 2 */}
        <path d="M68,45 C72,41 70,33 62,37 C62,39 64,45 68,45" fill="var(--color-sky)" stroke="currentColor" strokeWidth="1.5" />

        {/* Sprout (Center) */}
        <path d="M50,60 L50,28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50,28 Q44,22 50,16 Q56,22 50,28" fill="var(--color-honeydew)" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <span className="font-mono text-[7px] text-viridian/45 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        {blossomed ? "🌸 Blossomed!" : "Click to Nurture"}
      </span>
    </div>
  );
}
