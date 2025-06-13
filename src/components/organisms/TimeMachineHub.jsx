import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LocationCard from '@/components/molecules/LocationCard';
import Button from '@/components/atoms/Button';
import { locationService, userProgressService } from '@/services';

const TimeMachineHub = () => {
  const [locations, setLocations] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [locationsData, progressData] = await Promise.all([
          locationService.getAll(),
          userProgressService.get()
        ]);
        setLocations(locationsData);
        setUserProgress(progressData);
      } catch (err) {
        setError(err.message || 'Failed to load time machine data');
        toast.error('Failed to load time machine data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUnlockLocation = async (locationId) => {
    try {
      await locationService.unlock(locationId);
      const updatedLocations = await locationService.getAll();
      setLocations(updatedLocations);
      toast.success('New location unlocked!');
    } catch (err) {
      toast.error('Failed to unlock location');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-12 bg-surface-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-surface-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-surface-200 rounded w-3/4" />
                  <div className="h-4 bg-surface-200 rounded w-1/2" />
                  <div className="h-4 bg-surface-200 rounded w-full" />
                  <div className="h-10 bg-surface-200 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
            Time Machine Malfunction!
          </h3>
          <p className="text-surface-600 font-sans mb-6">
            {error}
          </p>
          <Button
            variant="primary"
            icon="RotateCcw"
            onClick={() => window.location.reload()}
          >
            Fix Time Machine
          </Button>
        </motion.div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md"
        >
          <div className="text-6xl mb-4">🕰️</div>
          <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
            Time Machine Empty
          </h3>
          <p className="text-surface-600 font-sans mb-6">
            No time periods are available for exploration yet. Check back soon!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 max-w-6xl mx-auto px-4 py-12 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-6xl mb-4"
          >
            ⏰
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            TimeTrek Adventures
          </h1>
          <p className="text-xl font-sans opacity-90 max-w-2xl mx-auto">
            Step into the Time Machine and explore amazing periods in history! 
            Discover fascinating facts and complete exciting challenges.
          </p>
          
          {userProgress && (
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/20 rounded-full px-4 py-2">
                <span className="font-medium">Facts Discovered: </span>
                {userProgress.totalFactsDiscovered}
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2">
                <span className="font-medium">Badges Earned: </span>
                {userProgress.totalBadgesEarned || 0}
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2">
                <span className="font-medium">Locations Visited: </span>
                {userProgress.locationsVisited?.length || 0}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Time Periods Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-surface-800 font-heading mb-2">
            Choose Your Destination
          </h2>
          <p className="text-surface-600 font-sans">
            Select a time period to begin your adventure. Complete challenges to unlock new destinations!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              index={index}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
        >
          <h3 className="text-lg font-bold text-surface-800 font-heading mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="accent"
              icon="BookOpen"
              onClick={() => {/* Navigate to journal */}}
            >
              View Knowledge Journal
            </Button>
            <Button
              variant="secondary"
              icon="Award"
              onClick={() => {/* Show achievements */}}
            >
              View Badges
            </Button>
            <Button
              variant="outline"
              icon="Settings"
              onClick={() => {/* Navigate to settings */}}
            >
              Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeMachineHub;