import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Hotspot = ({ 
  x, 
  y, 
  icon = 'Sparkles', 
  discovered = false,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: discovered ? 0.8 : 1, 
        opacity: discovered ? 0.5 : 1 
      }}
      whileHover={{ scale: discovered ? 0.9 : 1.2 }}
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${className}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
        ${discovered 
          ? 'bg-success/20 border-success text-success' 
          : 'bg-primary/20 border-primary text-primary glow-animation animate-pulse-slow'
        }
      `}>
        <ApperIcon 
          name={discovered ? 'CheckCircle' : icon} 
          size={20}
        />
      </div>
      {!discovered && (
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
      )}
    </motion.button>
  );
};

export default Hotspot;