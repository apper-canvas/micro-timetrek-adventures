import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FactCard from '@/components/molecules/FactCard';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { factService, locationService, userProgressService } from '@/services';

const Journal = () => {
  const [facts, setFacts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [currentFact, setCurrentFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJournalData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [allFacts, allLocations, progress] = await Promise.all([
          factService.getDiscovered(),
          locationService.getAll(),
          userProgressService.get()
        ]);
        
        setFacts(allFacts);
        setLocations(allLocations);
        setUserProgress(progress);
      } catch (err) {
        setError(err.message || 'Failed to load journal');
        toast.error('Failed to load journal');
      } finally {
        setLoading(false);
      }
    };

    loadJournalData();
  }, []);

  const handlePlayAudio = (fact) => {
    setCurrentFact(fact);
    // Simulate audio playback
    toast.info(`Playing: ${fact.content.substring(0, 50)}...`);
  };

  // Get unique categories from discovered facts
  const categories = ['all', ...new Set(facts.map(fact => fact.category))];
  
  // Filter facts based on selected category and location
  const filteredFacts = facts.filter(fact => {
    const categoryMatch = selectedCategory === 'all' || fact.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || fact.locationId === selectedLocation;
    return categoryMatch && locationMatch;
  });

  // Group facts by location for display
  const factsByLocation = filteredFacts.reduce((acc, fact) => {
    if (!acc[fact.locationId]) {
      acc[fact.locationId] = [];
    }
    acc[fact.locationId].push(fact);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-6">
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
                className="bg-white rounded-xl p-4 shadow-md"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-surface-200 rounded w-1/3" />
                  <div className="h-4 bg-surface-200 rounded w-full" />
                  <div className="h-4 bg-surface-200 rounded w-3/4" />
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
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-surface-800 font-heading mb-2">
            Journal Error
          </h3>
          <p className="text-surface-600 font-sans mb-6">
            {error}
          </p>
          <Button
            variant="primary"
            icon="RefreshCw"
            onClick={() => window.location.reload()}
          >
            Reload Journal
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-4"
            >
              📚
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Knowledge Journal
            </h1>
            <p className="text-xl font-sans opacity-90 max-w-2xl mx-auto">
              Your collection of amazing facts and discoveries from across time and space!
            </p>
            
            {userProgress && (
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/20 rounded-full px-4 py-2">
                  <span className="font-medium">Total Facts: </span>
                  {facts.length}
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2">
                  <span className="font-medium">Categories: </span>
                  {categories.length - 1}
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2">
                  <span className="font-medium">Locations Explored: </span>
                  {userProgress.locationsVisited?.length || 0}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {facts.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-surface-800 font-heading mb-4">
              Your Journal is Empty
            </h3>
            <p className="text-surface-600 font-sans mb-8 max-w-md mx-auto">
              Start exploring time periods to discover fascinating facts and fill your knowledge journal!
            </p>
            <Button
              variant="primary"
              size="lg"
              icon="Clock"
              onClick={() => {/* Navigate to time machine */}}
            >
              Start Time Traveling
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
            >
              <h3 className="text-lg font-bold text-surface-800 font-heading mb-4">
                Filter Your Discoveries
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 font-sans mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                          px-3 py-2 rounded-full text-sm font-medium font-sans transition-all duration-200 border
                          ${selectedCategory === category
                            ? 'bg-accent text-white border-accent'
                            : 'bg-white text-surface-600 border-surface-300 hover:border-accent/50'
                          }
                        `}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Location filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 font-sans mb-2">
                    Time Period
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border border-surface-300 rounded-lg font-sans bg-white"
                  >
                    <option value="all">All Time Periods</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.era})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-100">
                <div className="flex items-center justify-between text-sm text-surface-600 font-sans">
                  <span>
                    Showing {filteredFacts.length} of {facts.length} discovered facts
                  </span>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Filter" size={16} />
                    <span>Filters active</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Facts display */}
            <AnimatePresence mode="wait">
              {filteredFacts.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 bg-white rounded-2xl shadow-lg"
                >
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-surface-800 font-heading mb-2">
                    No Facts Match Your Filters
                  </h3>
                  <p className="text-surface-600 font-sans mb-4">
                    Try adjusting your filters or explore more time periods!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLocation('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="facts-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Group by location display */}
                  {Object.entries(factsByLocation).map(([locationId, locationFacts]) => {
                    const location = locations.find(l => l.id === locationId);
                    return (
                      <div key={locationId} className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="text-3xl">
                            {location?.backgroundImage || '🌍'}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-surface-800 font-heading">
                              {location?.name || 'Unknown Location'}
                            </h2>
                            <p className="text-sm text-surface-600 font-sans">
                              {locationFacts.length} fact{locationFacts.length !== 1 ? 's' : ''} discovered
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {locationFacts.map((fact, index) => (
                            <motion.div
                              key={fact.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <FactCard
                                fact={fact}
                                onPlayAudio={handlePlayAudio}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
            >
              <h3 className="text-lg font-bold text-surface-800 font-heading mb-6">
                Discovery Statistics
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent font-heading mb-2">
                    {facts.length}
                  </div>
                  <p className="text-sm text-surface-600 font-sans">
                    Total Facts
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary font-heading mb-2">
                    {categories.length - 1}
                  </div>
                  <p className="text-sm text-surface-600 font-sans">
                    Categories
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary font-heading mb-2">
                    {Object.keys(factsByLocation).length}
                  </div>
                  <p className="text-sm text-surface-600 font-sans">
                    Time Periods
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-success font-heading mb-2">
                    {userProgress?.totalBadgesEarned || 0}
                  </div>
                  <p className="text-sm text-surface-600 font-sans">
                    Badges Earned
                  </p>
                </div>
              </div>
              
              {/* Most discovered category */}
              {facts.length > 0 && (
                <div className="mt-6 pt-6 border-t border-surface-100">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="TrendingUp" size={20} className="text-accent" />
                    <div>
                      <p className="font-medium text-surface-800 font-sans">
                        Favorite Discovery Category
                      </p>
                      <p className="text-sm text-surface-600 font-sans">
                        {categories
                          .filter(c => c !== 'all')
                          .reduce((a, b) => 
                            facts.filter(f => f.category === a).length > 
                            facts.filter(f => f.category === b).length ? a : b
                          )} 
                        ({facts.filter(f => f.category === categories
                          .filter(c => c !== 'all')
                          .reduce((a, b) => 
                            facts.filter(f => f.category === a).length > 
                            facts.filter(f => f.category === b).length ? a : b
                          )).length} facts)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Journal;