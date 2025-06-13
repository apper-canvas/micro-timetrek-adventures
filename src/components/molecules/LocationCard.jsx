import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import ApperIcon from '@/components/ApperIcon';

const LocationCard = ({ location, index }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(`/location/${location.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 p-6 bg-white transition-all duration-300
        ${location.unlocked 
          ? 'border-primary/20 shadow-lg hover:shadow-xl' 
          : 'border-surface-300 opacity-75'
        }
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-4 right-4 text-6xl opacity-20">
        {location.backgroundImage}
      </div>
      
      {/* Lock indicator for locked locations */}
      {!location.unlocked && (
        <div className="absolute top-4 left-4">
          <ApperIcon name="Lock" size={24} className="text-surface-400" />
        </div>
      )}

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
          {location.name}
        </h3>
        
        <p className="text-sm text-surface-600 font-sans mb-2">
          {location.era}
        </p>
        
        <p className="text-surface-700 font-sans mb-4 text-sm">
          {location.description}
        </p>

        {location.unlocked && (
          <div className="mb-4">
            <ProgressBar
              value={location.progress}
              max={100}
              variant="accent"
              size="sm"
              label="Exploration Progress"
              showLabel={true}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-surface-600 font-sans">
              <span>{location.discoveredFacts?.length || 0} / {location.totalFacts} facts discovered</span>
            </div>
          </div>
        )}

        <Button
          variant={location.unlocked ? 'primary' : 'outline'}
          size="md"
          icon={location.unlocked ? 'MapPin' : 'Lock'}
          onClick={handleExplore}
          disabled={!location.unlocked}
          className="w-full"
        >
          {location.unlocked ? 'Explore' : 'Locked'}
        </Button>
      </div>
    </motion.div>
  );
};

export default LocationCard;