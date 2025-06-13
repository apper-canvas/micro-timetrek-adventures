import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { userProgressService, locationService, challengeService, factService } from '@/services';

const Settings = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    voiceNarration: true,
    autoPlayFacts: false,
    difficulty: 'easy',
    language: 'english',
    parentalControls: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const progress = await userProgressService.get();
        setUserProgress(progress);
      } catch (err) {
        toast.error('Failed to load user progress');
      }
    };

    loadUserProgress();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Setting updated!');
  };

  const handleResetProgress = async () => {
    if (!window.confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      return;
    }

    setLoading(true);
    try {
      await userProgressService.reset();
      setUserProgress(await userProgressService.get());
      toast.success('Progress reset successfully!');
    } catch (err) {
      toast.error('Failed to reset progress');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAllLocations = async () => {
    setLoading(true);
    try {
      const locations = await locationService.getAll();
      await Promise.all(
        locations.map(location => locationService.unlock(location.id))
      );
      toast.success('All locations unlocked!');
    } catch (err) {
      toast.error('Failed to unlock locations');
    } finally {
      setLoading(false);
    }
  };

  const achievements = userProgress?.achievements || {};
  const earnedAchievements = Object.values(achievements).filter(Boolean).length;
  const totalAchievements = Object.keys(achievements).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-4"
            >
              ⚙️
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Time Machine Settings
            </h1>
            <p className="text-xl font-sans opacity-90">
              Customize your time travel experience and view your achievements
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Overview */}
        {userProgress && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
          >
            <h2 className="text-xl font-bold text-surface-800 font-heading mb-6">
              Your Time Travel Journey
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-accent/10 rounded-xl">
                <div className="text-2xl font-bold text-accent font-heading">
                  {userProgress.totalFactsDiscovered}
                </div>
                <p className="text-sm text-surface-600 font-sans">Facts Discovered</p>
              </div>
              
              <div className="text-center p-4 bg-secondary/10 rounded-xl">
                <div className="text-2xl font-bold text-secondary font-heading">
                  {userProgress.totalBadgesEarned || 0}
                </div>
                <p className="text-sm text-surface-600 font-sans">Badges Earned</p>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-xl">
                <div className="text-2xl font-bold text-primary font-heading">
                  {userProgress.locationsVisited?.length || 0}
                </div>
                <p className="text-sm text-surface-600 font-sans">Locations Visited</p>
              </div>
              
              <div className="text-center p-4 bg-success/10 rounded-xl">
                <div className="text-2xl font-bold text-success font-heading">
                  {earnedAchievements}
                </div>
                <p className="text-sm text-surface-600 font-sans">Achievements</p>
              </div>
            </div>

            {userProgress.favoriteEra && (
              <div className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Heart" size={20} className="text-error" />
                  <div>
                    <p className="font-medium text-surface-800 font-sans">Favorite Time Period</p>
                    <p className="text-sm text-surface-600 font-sans">{userProgress.favoriteEra}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Audio & Sound Settings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
        >
          <h2 className="text-xl font-bold text-surface-800 font-heading mb-6">
            Audio & Narration
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-surface-800 font-sans">Sound Effects</h3>
                <p className="text-sm text-surface-600 font-sans">Play sounds for interactions and discoveries</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-200
                  ${settings.soundEnabled ? 'bg-primary' : 'bg-surface-300'}
                `}
              >
                <motion.div
                  animate={{ x: settings.soundEnabled ? 24 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-surface-800 font-sans">Background Music</h3>
                <p className="text-sm text-surface-600 font-sans">Play ambient music during exploration</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSettingChange('musicEnabled', !settings.musicEnabled)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-200
                  ${settings.musicEnabled ? 'bg-primary' : 'bg-surface-300'}
                `}
              >
                <motion.div
                  animate={{ x: settings.musicEnabled ? 24 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-surface-800 font-sans">Voice Narration</h3>
                <p className="text-sm text-surface-600 font-sans">Read facts aloud automatically</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSettingChange('voiceNarration', !settings.voiceNarration)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-200
                  ${settings.voiceNarration ? 'bg-primary' : 'bg-surface-300'}
                `}
              >
                <motion.div
                  animate={{ x: settings.voiceNarration ? 24 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-surface-800 font-sans">Auto-Play Facts</h3>
                <p className="text-sm text-surface-600 font-sans">Start narration immediately when discovering facts</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSettingChange('autoPlayFacts', !settings.autoPlayFacts)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-200
                  ${settings.autoPlayFacts ? 'bg-primary' : 'bg-surface-300'}
                `}
              >
                <motion.div
                  animate={{ x: settings.autoPlayFacts ? 24 : 0 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Gameplay Settings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
        >
          <h2 className="text-xl font-bold text-surface-800 font-heading mb-6">
            Gameplay Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-surface-800 font-sans mb-2">Challenge Difficulty</h3>
              <p className="text-sm text-surface-600 font-sans mb-3">Adjust the difficulty of mini-challenges</p>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((difficulty) => (
                  <motion.button
                    key={difficulty}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSettingChange('difficulty', difficulty)}
                    className={`
                      px-4 py-2 rounded-lg font-sans capitalize transition-all duration-200
                      ${settings.difficulty === difficulty
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }
                    `}
                  >
                    {difficulty}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-surface-800 font-sans mb-2">Language</h3>
              <p className="text-sm text-surface-600 font-sans mb-3">Choose your preferred language</p>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-surface-300 rounded-lg font-sans bg-white"
              >
                <option value="english">English</option>
                <option value="spanish">Español</option>
                <option value="french">Français</option>
                <option value="german">Deutsch</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-surface-200"
        >
          <h2 className="text-xl font-bold text-surface-800 font-heading mb-6">
            Achievements ({earnedAchievements}/{totalAchievements})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(achievements).map(([key, earned]) => {
              const achievementInfo = {
                firstDiscovery: { title: 'First Discovery', description: 'Discover your first fact', icon: 'Lightbulb' },
                firstChallenge: { title: 'Challenge Accepted', description: 'Complete your first challenge', icon: 'Trophy' },
                allEgyptFacts: { title: 'Pharaoh\'s Scholar', description: 'Discover all facts in Ancient Egypt', icon: 'Pyramid' },
                allRomeFacts: { title: 'Roman Expert', description: 'Discover all facts in Roman Empire', icon: 'Crown' },
                allDinoFacts: { title: 'Paleontologist', description: 'Discover all facts in Age of Dinosaurs', icon: 'Bone' },
                speedExplorer: { title: 'Speed Explorer', description: 'Discover 5 facts in under 2 minutes', icon: 'Zap' },
                thoroughExplorer: { title: 'Thorough Explorer', description: 'Spend 30+ minutes in a single location', icon: 'Clock' }
              };

              const info = achievementInfo[key] || { title: key, description: 'Special achievement', icon: 'Award' };

              return (
                <motion.div
                  key={key}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: Object.keys(achievements).indexOf(key) * 0.05 }}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300
                    ${earned 
                      ? 'bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/30' 
                      : 'bg-surface-50 border-surface-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg
                      ${earned ? 'bg-primary/20 text-primary' : 'bg-surface-200 text-surface-400'}
                    `}>
                      <ApperIcon name={info.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium font-sans ${earned ? 'text-surface-800' : 'text-surface-500'}`}>
                        {info.title}
                      </h3>
                      <p className={`text-sm font-sans ${earned ? 'text-surface-600' : 'text-surface-400'}`}>
                        {info.description}
                      </p>
                    </div>
                    {earned && (
                      <Badge variant="earned" size="sm" icon="CheckCircle" earned>
                        Earned
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Developer Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-warning/30"
        >
          <h2 className="text-xl font-bold text-surface-800 font-heading mb-6">
            Developer Options
          </h2>
          <p className="text-sm text-surface-600 font-sans mb-6">
            These options are for testing and development purposes.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              icon="Unlock"
              onClick={handleUnlockAllLocations}
              disabled={loading}
            >
              Unlock All Locations
            </Button>
            
            <Button
              variant="warning"
              icon="RotateCcw"
              onClick={handleResetProgress}
              disabled={loading}
            >
              Reset All Progress
            </Button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-surface-800 font-heading mb-2">
            TimeTrek Adventures
          </h2>
          <p className="text-surface-600 font-sans mb-4">
            Version 1.0.0 - Making learning history fun through interactive exploration
          </p>
          <div className="flex justify-center gap-4 text-sm text-surface-500 font-sans">
            <span>Made with ❤️ for young explorers</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;