import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FactCard = ({ fact, onPlayAudio }) => {
  const handlePlayAudio = () => {
    if (onPlayAudio) {
      onPlayAudio(fact);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-md border border-surface-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge 
          variant="accent" 
          size="sm"
          className="flex-shrink-0"
        >
          {fact.category}
        </Badge>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayAudio}
          className="flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <ApperIcon name="Volume2" size={16} />
        </motion.button>
      </div>

      <p className="text-surface-700 font-sans text-sm leading-relaxed">
        {fact.content}
      </p>

      {fact.discovered && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
          <ApperIcon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs text-success font-medium font-sans">
            Discovered!
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default FactCard;