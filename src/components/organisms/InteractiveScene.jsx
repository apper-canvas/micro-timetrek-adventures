import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Hotspot from '@/components/atoms/Hotspot';
import VoiceControlBar from '@/components/molecules/VoiceControlBar';
import { factService, userProgressService } from '@/services';

const InteractiveScene = ({ location }) => {
  const [facts, setFacts] = useState([]);
  const [discoveredFacts, setDiscoveredFacts] = useState(new Set());
  const [currentFact, setCurrentFact] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scene objects with positions (percentage-based for responsiveness)
  const sceneObjects = {
    'ancient-egypt': [
      { id: 'pyramid', x: 75, y: 30, icon: 'Triangle' },
      { id: 'pharaoh', x: 40, y: 45, icon: 'Crown' },
      { id: 'cat', x: 20, y: 70, icon: 'Cat' },
      { id: 'scroll', x: 60, y: 65, icon: 'Scroll' },
      { id: 'treasure', x: 80, y: 75, icon: 'Gem' },
      { id: 'sarcophagus', x: 85, y: 50, icon: 'Box' },
      { id: 'sphinx', x: 50, y: 25, icon: 'Mountain' },
      { id: 'scribe', x: 30, y: 60, icon: 'PenTool' }
    ],
    'roman-empire': [
      { id: 'colosseum', x: 70, y: 35, icon: 'Circle' },
      { id: 'gladiator', x: 45, y: 50, icon: 'Sword' },
      { id: 'soldier', x: 25, y: 40, icon: 'Shield' },
      { id: 'shield', x: 35, y: 70, icon: 'Shield' },
      { id: 'coin', x: 60, y: 75, icon: 'Coins' },
      { id: 'statue', x: 80, y: 60, icon: 'User' },
      { id: 'chariot', x: 15, y: 25, icon: 'Car' },
      { id: 'senator', x: 55, y: 30, icon: 'User' }
    ],
    'dinosaur-age': [
      { id: 'trex', x: 70, y: 40, icon: 'Zap' },
      { id: 'triceratops', x: 30, y: 55, icon: 'Mountain' },
      { id: 'pterodactyl', x: 20, y: 20, icon: 'Bird' },
      { id: 'fossil', x: 50, y: 75, icon: 'Bone' },
      { id: 'volcano', x: 85, y: 25, icon: 'Flame' },
      { id: 'fern', x: 15, y: 65, icon: 'Leaf' },
      { id: 'egg', x: 60, y: 60, icon: 'Circle' },
      { id: 'footprint', x: 40, y: 80, icon: 'FootPrints' }
    ]
  };

  useEffect(() => {
    const loadFacts = async () => {
      if (!location?.id) return;
      
      setLoading(true);
      try {
        const locationFacts = await factService.getByLocationId(location.id);
        setFacts(locationFacts);
        
        // Set discovered facts
        const discovered = new Set(
          locationFacts.filter(fact => fact.discovered).map(fact => fact.objectId)
        );
        setDiscoveredFacts(discovered);
      } catch (err) {
        toast.error('Failed to load scene facts');
      } finally {
        setLoading(false);
      }
    };

    loadFacts();
  }, [location?.id]);

  const handleObjectClick = async (objectId) => {
    try {
      const fact = await factService.getByObjectId(objectId);
      if (!fact) {
        toast.info('Nothing interesting here... yet!');
        return;
      }

      // Mark as discovered if not already
      if (!fact.discovered) {
        await factService.markDiscovered(fact.id);
        await userProgressService.addDiscoveredFact(fact.id);
        
        setDiscoveredFacts(prev => new Set([...prev, objectId]));
        toast.success('New fact discovered!');
      }

      setCurrentFact(fact);
      setIsPlaying(true);
      setShowText(true);
      
      // Simulate audio playback
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
      
    } catch (err) {
      toast.error('Failed to load fact');
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handlePauseAudio = () => {
    setIsPlaying(false);
  };

  const handleToggleText = () => {
    setShowText(!showText);
  };

  const handleCloseVoiceBar = () => {
    setCurrentFact(null);
    setIsPlaying(false);
    setShowText(false);
  };

  const getSceneBackground = (locationId) => {
    const backgrounds = {
      'ancient-egypt': 'bg-gradient-to-b from-yellow-100 via-yellow-50 to-orange-100',
      'roman-empire': 'bg-gradient-to-b from-red-100 via-orange-50 to-yellow-100',
      'dinosaur-age': 'bg-gradient-to-b from-green-100 via-lime-50 to-emerald-100',
      'space-exploration': 'bg-gradient-to-b from-purple-900 via-blue-900 to-black',
      'arctic-expedition': 'bg-gradient-to-b from-blue-100 via-cyan-50 to-white'
    };
    return backgrounds[locationId] || 'bg-gradient-to-b from-surface-100 to-surface-50';
  };

  const getSceneEmoji = (locationId) => {
    const emojis = {
      'ancient-egypt': '🏜️',
      'roman-empire': '🏛️',
      'dinosaur-age': '🦕',
      'space-exploration': '🚀',
      'arctic-expedition': '🐧'
    };
    return emojis[locationId] || '🌍';
  };

  if (loading) {
    return (
      <div className={`h-full ${getSceneBackground(location?.id)} flex items-center justify-center`}>
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
            Time traveling to {location?.name}...
          </p>
        </motion.div>
      </div>
    );
  }

  const objects = sceneObjects[location?.id] || [];

  return (
    <div className="relative h-full overflow-hidden">
      {/* Scene Background */}
      <div className={`absolute inset-0 ${getSceneBackground(location?.id)}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[20rem] select-none">
            {getSceneEmoji(location?.id)}
          </span>
        </div>
        
        {/* Ambient particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive Objects */}
      <div className="relative z-10 h-full">
        <AnimatePresence>
          {objects.map((obj, index) => (
            <motion.div
              key={obj.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Hotspot
                x={obj.x}
                y={obj.y}
                icon={obj.icon}
                discovered={discoveredFacts.has(obj.id)}
                onClick={() => handleObjectClick(obj.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Instructions overlay */}
      {objects.length > 0 && discoveredFacts.size === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-4 right-4 z-20"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                👆
              </motion.div>
              <div>
                <p className="font-medium text-surface-800 font-sans">
                  Tap the glowing objects to discover amazing facts!
                </p>
                <p className="text-sm text-surface-600 font-sans">
                  Find all {objects.length} hidden treasures in this time period.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          <span className="text-sm font-medium text-surface-800 font-sans">
            {discoveredFacts.size} / {objects.length} discovered
          </span>
        </div>
      </div>

      {/* Voice Control Bar */}
      <VoiceControlBar
        currentFact={currentFact}
        isPlaying={isPlaying}
        showText={showText}
        onPlay={handlePlayAudio}
        onPause={handlePauseAudio}
        onToggleText={handleToggleText}
        onClose={handleCloseVoiceBar}
      />
    </div>
  );
};

export default InteractiveScene;