import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import InteractiveScene from '@/components/organisms/InteractiveScene';
import ChallengeOverlay from '@/components/organisms/ChallengeOverlay';
import ChallengeCard from '@/components/molecules/ChallengeCard';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { locationService, challengeService, userProgressService } from '@/services';

const Location = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [location, setLocation] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [view, setView] = useState('scene'); // scene, challenges
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocationData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const [locationData, challengesData] = await Promise.all([
          locationService.getById(id),
          challengeService.getByLocationId(id)
        ]);
        
        setLocation(locationData);
        setChallenges(challengesData);
        
        // Mark location as visited
        await userProgressService.visitLocation(id);
        
      } catch (err) {
        setError(err.message || 'Failed to load location');
        toast.error('Failed to load location');
      } finally {
        setLoading(false);
      }
    };

    loadLocationData();
  }, [id]);

  const handleStartChallenge = (challenge) => {
    setActiveChallenge(challenge);
  };

  const handleCompleteChallenge = async (challenge) => {
    try {
      // Update local state
      setChallenges(prev => 
        prev.map(c => c.id === challenge.id ? { ...c, completed: true } : c)
      );
      
      // Close challenge overlay
      setActiveChallenge(null);
      
      // Switch back to scene view
      setView('scene');
      
    } catch (err) {
      toast.error('Failed to complete challenge');
    }
  };

  const handleBackToHub = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            ⏰
          </motion.div>
          <p className="text-lg font-sans text-surface-700">
            Loading time period...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md"
        >
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
            Time Machine Error!
          </h3>
          <p className="text-surface-600 font-sans mb-6">
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              icon="Home"
              onClick={handleBackToHub}
            >
              Back to Time Machine
            </Button>
            <Button
              variant="outline"
              icon="RotateCcw"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
            Location Not Found
          </h3>
          <p className="text-surface-600 font-sans mb-6">
            This time period doesn't exist or hasn't been unlocked yet.
          </p>
          <Button
            variant="primary"
            icon="Home"
            onClick={handleBackToHub}
          >
            Back to Time Machine
          </Button>
        </motion.div>
      </div>
    );
  }

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b-2 border-primary/20 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={handleBackToHub}
            >
              Time Machine
            </Button>
            
            <div className="border-l border-surface-300 pl-4">
              <h1 className="font-bold text-surface-800 font-heading">
                {location.name}
              </h1>
              <p className="text-sm text-surface-600 font-sans">
                {location.era}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress indicators */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <ApperIcon name="Lightbulb" size={16} className="text-accent" />
                <span className="font-sans">
                  {location.discoveredFacts?.length || 0}/{location.totalFacts} facts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Award" size={16} className="text-secondary" />
                <span className="font-sans">
                  {completedChallenges}/{totalChallenges} challenges
                </span>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex bg-surface-100 rounded-xl p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('scene')}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium font-sans transition-all duration-200
                  ${view === 'scene' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-surface-600 hover:text-surface-800'
                  }
                `}
              >
                <ApperIcon name="Map" size={16} className="inline mr-2" />
                Explore
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('challenges')}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium font-sans transition-all duration-200 relative
                  ${view === 'challenges' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-surface-600 hover:text-surface-800'
                  }
                `}
              >
                <ApperIcon name="Zap" size={16} className="inline mr-2" />
                Challenges
                {totalChallenges > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                    {totalChallenges}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <ProgressBar
                value={((location.discoveredFacts?.length || 0) / location.totalFacts) * 100}
                variant="accent"
                size="sm"
                label="Facts Discovered"
                showLabel={false}
              />
            </div>
            <div className="flex-1">
              <ProgressBar
                value={(completedChallenges / Math.max(totalChallenges, 1)) * 100}
                variant="secondary"
                size="sm"
                label="Challenges Completed"
                showLabel={false}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-surface-600 font-sans">
            <span>{location.discoveredFacts?.length || 0}/{location.totalFacts} facts</span>
            <span>{completedChallenges}/{totalChallenges} challenges</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'scene' && (
            <motion.div
              key="scene"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <InteractiveScene location={location} />
            </motion.div>
          )}

          {view === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto p-6 bg-gradient-to-br from-background to-primary/5"
            >
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-surface-800 font-heading mb-2">
                    Time Period Challenges
                  </h2>
                  <p className="text-surface-600 font-sans">
                    Complete these fun activities to earn badges and learn more about {location.name}!
                  </p>
                </div>

                {challenges.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 bg-white rounded-2xl shadow-lg"
                  >
                    <div className="text-6xl mb-4">🔄</div>
                    <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
                      Challenges Coming Soon!
                    </h3>
                    <p className="text-surface-600 font-sans mb-6">
                      We're preparing exciting challenges for this time period. 
                      Check back soon!
                    </p>
                    <Button
                      variant="primary"
                      icon="Map"
                      onClick={() => setView('scene')}
                    >
                      Continue Exploring
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {challenges.map((challenge, index) => (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ChallengeCard
                          challenge={challenge}
                          onStart={handleStartChallenge}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Summary stats */}
                {challenges.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
                  >
                    <h3 className="text-lg font-bold text-surface-800 font-heading mb-4">
                      Your Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary font-heading">
                          {completedChallenges}
                        </div>
                        <p className="text-sm text-surface-600 font-sans">
                          Challenges Completed
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary font-heading">
                          {completedChallenges}
                        </div>
                        <p className="text-sm text-surface-600 font-sans">
                          Badges Earned
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent font-heading">
                          {Math.round((completedChallenges / Math.max(totalChallenges, 1)) * 100)}%
                        </div>
                        <p className="text-sm text-surface-600 font-sans">
                          Completion Rate
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Challenge Overlay */}
      <AnimatePresence>
        {activeChallenge && (
          <ChallengeOverlay
            challenge={activeChallenge}
            onComplete={handleCompleteChallenge}
            onClose={() => setActiveChallenge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Location;