import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children,
  variant = 'primary',
  size = 'md',
  icon,
  earned = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-2 rounded-full font-medium font-sans transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    earned: 'bg-gradient-to-r from-secondary to-primary text-white border-2 border-white glow-animation'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const displayVariant = earned ? 'earned' : variant;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: earned ? 1.1 : 1.05 }}
      className={`${baseClasses} ${variants[displayVariant]} ${sizes[size]} ${className}`}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={size === 'sm' ? 12 : size === 'md' ? 16 : 20}
          className={earned ? 'text-white sparkle-animation' : ''}
        />
      )}
      {children}
    </motion.div>
  );
};

export default Badge;