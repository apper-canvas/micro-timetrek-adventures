import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ChallengeCard = ({ challenge, onStart }) => {
  const getTypeIcon = (type) => {
    const icons = {
      'find-item': 'Search',
      'matching': 'Puzzle',
      'drag-drop': 'Move',
      'counting': 'Hash',
      'sequence': 'ArrowRight',
      'sorting': 'ArrowUpDown'
    };
    return icons[type] || 'Play';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'find-item': 'Find & Discover',
      'matching': 'Match Pairs',
      'drag-drop': 'Drag & Drop',
      'counting': 'Count Items',
      'sequence': 'Order Steps',
      'sorting': 'Sort Items'
    };
    return labels[type] || 'Challenge';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300
        ${challenge.completed 
          ? 'bg-success/5 border-success/30 shadow-md' 
          : 'bg-white border-primary/20 shadow-lg hover:shadow-xl'
        }
      `}
    >
      {/* Completion indicator */}
      {challenge.completed && (
        <div className="absolute top-4 right-4">
          <Badge variant="success" icon="CheckCircle" earned>
            Completed
          </Badge>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`
            p-2 rounded-xl 
            ${challenge.completed 
              ? 'bg-success/20 text-success' 
              : 'bg-primary/20 text-primary'
            }
          `}>
            <ApperIcon name={getTypeIcon(challenge.type)} size={20} />
          </div>
          
          <div>
            <Badge 
              variant={challenge.completed ? 'success' : 'primary'} 
              size="sm"
            >
              {getTypeLabel(challenge.type)}
            </Badge>
          </div>
        </div>

        <p className="text-surface-700 font-sans leading-relaxed">
          {challenge.instructions}
        </p>
      </div>

      {challenge.reward && (
        <div className="mb-4 p-3 bg-secondary/10 rounded-xl border border-secondary/20">
          <div className="flex items-center gap-2">
            <ApperIcon name="Award" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary font-sans">
              Reward: {challenge.reward}
            </span>
          </div>
        </div>
      )}

      <Button
        variant={challenge.completed ? 'outline' : 'primary'}
        size="md"
        icon={challenge.completed ? 'RotateCcw' : 'Play'}
        onClick={() => onStart(challenge)}
        className="w-full"
      >
        {challenge.completed ? 'Play Again' : 'Start Challenge'}
      </Button>
    </motion.div>
  );
};

export default ChallengeCard;