import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 border-2 min-h-[48px] font-sans';
  
  const variants = {
    primary: 'bg-primary text-white border-primary hover:bg-primary/90 hover:border-primary/90',
    secondary: 'bg-secondary text-white border-secondary hover:bg-secondary/90 hover:border-secondary/90',
    accent: 'bg-accent text-white border-accent hover:bg-accent/90 hover:border-accent/90',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-surface-700 border-transparent hover:bg-surface-100',
    success: 'bg-success text-white border-success hover:bg-success/90',
    warning: 'bg-warning text-white border-warning hover:bg-warning/90',
    error: 'bg-error text-white border-error hover:bg-error/90'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer hover:scale-105 active:scale-95';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      )}
    </motion.button>
  );
};

export default Button;