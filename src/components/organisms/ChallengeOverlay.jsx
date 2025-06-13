import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { challengeService, userProgressService } from '@/services';

const ChallengeOverlay = ({ challenge, onComplete, onClose }) => {
  const [gameState, setGameState] = useState('playing'); // playing, completed, failed
  const [userAnswer, setUserAnswer] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per challenge

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('failed');
    }
  }, [timeLeft, gameState]);

  const handleSubmitAnswer = async (answer) => {
    setAttempts(attempts + 1);
    
    const isCorrect = checkAnswer(answer);
    
    if (isCorrect) {
      setGameState('completed');
      try {
        await challengeService.markCompleted(challenge.id);
        await userProgressService.completeChallenge(challenge.id);
        toast.success(`Challenge completed! You earned: ${challenge.reward}`);
        setTimeout(() => {
          onComplete(challenge);
        }, 2000);
      } catch (err) {
        toast.error('Failed to save progress');
      }
    } else {
      if (attempts >= 2) {
        setGameState('failed');
        toast.error('Challenge failed! Try again later.');
      } else {
        toast.warning(`Not quite right. ${3 - attempts - 1} attempts remaining.`);
      }
    }
  };

  const checkAnswer = (answer) => {
    switch (challenge.type) {
      case 'find-item':
        return answer === challenge.targetObject;
      
      case 'matching':
        return JSON.stringify(answer) === JSON.stringify(challenge.pairs);
      
      case 'drag-drop':
        return JSON.stringify(answer) === JSON.stringify(challenge.blocks);
      
      case 'counting':
        return answer === challenge.coins;
      
      case 'sequence':
        return JSON.stringify(answer) === JSON.stringify(challenge.sequence);
      
      case 'sorting':
        return JSON.stringify(answer) === JSON.stringify(challenge.correctOrder);
      
      default:
        return false;
    }
  };

  const renderChallengeContent = () => {
    switch (challenge.type) {
      case 'find-item':
        return <FindItemChallenge challenge={challenge} onAnswer={handleSubmitAnswer} />;
      
      case 'matching':
        return <MatchingChallenge challenge={challenge} onAnswer={handleSubmitAnswer} />;
      
      case 'drag-drop':
        return <DragDropChallenge challenge={challenge} onAnswer={handleSubmitAnswer} />;
      
      case 'counting':
        return <CountingChallenge challenge={challenge} onAnswer={handleSubmitAnswer} />;
      
      case 'sequence':
        return <SequenceChallenge challenge={challenge} onAnswer={handleSubmitAnswer} />;
      
      case 'sorting':
        return <SortingChallenge challenge={challenge} onAnswer={handleSubmitAnswer} />;
      
      default:
        return <div>Unknown challenge type</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="primary" size="sm">
                Challenge
              </Badge>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-surface-600 font-sans">
                  <ApperIcon name="Clock" size={16} />
                  <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                />
              </div>
            </div>
            
            <p className="text-surface-700 font-sans leading-relaxed">
              {challenge.instructions}
            </p>
            
            {attempts > 0 && gameState === 'playing' && (
              <div className="mt-3 flex items-center gap-2">
                <ApperIcon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm text-warning font-sans">
                  Attempts: {attempts}/3
                </span>
              </div>
            )}
          </div>

          {/* Challenge Content */}
          <div className="p-6">
            {gameState === 'playing' && renderChallengeContent()}
            
            {gameState === 'completed' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 1 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-bold text-success font-heading mb-2">
                  Challenge Completed!
                </h3>
                <p className="text-surface-600 font-sans mb-4">
                  Excellent work! You've earned a new badge.
                </p>
                <Badge variant="earned" size="lg" icon="Award" earned>
                  {challenge.reward}
                </Badge>
              </motion.div>
            )}
            
            {gameState === 'failed' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-error font-heading mb-2">
                  Challenge Failed
                </h3>
                <p className="text-surface-600 font-sans mb-6">
                  Don't worry! You can try again anytime. Practice makes perfect!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="primary" icon="RotateCcw" onClick={() => {
                    setGameState('playing');
                    setAttempts(0);
                    setTimeLeft(60);
                    setUserAnswer(null);
                  }}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Back to Exploration
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Individual Challenge Components
const FindItemChallenge = ({ challenge, onAnswer }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
// Mock items for the scene - includes medieval and prehistoric items
  const sceneItems = challenge.locationId === 'medieval-times' 
    ? ['sword', 'shield', 'crown', 'scroll', 'gem']
    : challenge.locationId === 'dinosaur-age'
    ? ['fossil', 'bone', 'rock', 'leaf', 'egg']
    : ['treasure', 'scroll', 'vase', 'gem', 'coin'];
  
  return (
    <div>
      <h4 className="font-bold text-surface-800 font-heading mb-4">
        Find the {challenge.targetObject}!
      </h4>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {sceneItems.map((item) => (
          <motion.button
            key={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItem(item)}
            className={`
              p-4 rounded-xl border-2 text-center transition-all duration-200
              ${selectedItem === item 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-surface-200 bg-surface-50 hover:border-primary/50'
              }
            `}
          >
            <div className="text-2xl mb-2">
              {item === 'treasure' ? '💰' : 
               item === 'scroll' ? '📜' :
               item === 'vase' ? '🏺' :
               item === 'gem' ? '💎' : 
               item === 'coin' ? '🪙' :
               item === 'sword' ? '⚔️' :
               item === 'shield' ? '🛡️' :
               item === 'crown' ? '👑' :
               item === 'fossil' ? '🦴' :
               item === 'bone' ? '🦴' :
               item === 'rock' ? '🪨' :
               item === 'leaf' ? '🍃' :
               item === 'egg' ? '🥚' : '🔍'}
            </div>
            <span className="text-sm font-sans capitalize">{item}</span>
          </motion.button>
        ))}
      </div>
      <Button
        variant="primary"
        size="lg"
        disabled={!selectedItem}
        onClick={() => onAnswer(selectedItem)}
        className="w-full"
      >
        Select This Item
      </Button>
    </div>
  );

const MatchingChallenge = ({ challenge, onAnswer }) => {
  const [matches, setMatches] = useState({});
  
  const handleMatch = (symbol, meaning) => {
    setMatches({ ...matches, [symbol]: meaning });
  };
  
  return (
    <div>
      <h4 className="font-bold text-surface-800 font-heading mb-4">
        Match the symbols with their meanings
      </h4>
      <div className="space-y-4 mb-6">
        {challenge.pairs.map((pair, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl">
            <div className="text-2xl">{pair.symbol}</div>
            <div className="flex-1">
              <select
                onChange={(e) => handleMatch(pair.symbol, e.target.value)}
                className="w-full p-2 border border-surface-300 rounded-lg font-sans"
              >
                <option value="">Select meaning...</option>
                {challenge.pairs.map((p) => (
                  <option key={p.meaning} value={p.meaning}>{p.meaning}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="primary"
        size="lg"
        disabled={Object.keys(matches).length !== challenge.pairs.length}
        onClick={() => onAnswer(challenge.pairs.map(p => ({ symbol: p.symbol, meaning: matches[p.symbol] })))}
        className="w-full"
      >
        Submit Matches
      </Button>
    </div>
  );
};

const DragDropChallenge = ({ challenge, onAnswer }) => {
  const [stackOrder, setStackOrder] = useState([]);
  const [availableBlocks] = useState([...challenge.blocks].reverse());
  
  const addToStack = (block) => {
    if (!stackOrder.includes(block)) {
      setStackOrder([...stackOrder, block]);
    }
  };
  
  const removeFromStack = (block) => {
    setStackOrder(stackOrder.filter(b => b !== block));
  };
  
  return (
    <div>
      <h4 className="font-bold text-surface-800 font-heading mb-4">
        Stack the blocks in the correct order
      </h4>
      
      {/* Available blocks */}
      <div className="mb-6">
        <p className="text-sm text-surface-600 font-sans mb-3">Available blocks:</p>
        <div className="flex gap-2 flex-wrap">
          {availableBlocks.map((block) => (
            <motion.button
              key={block}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToStack(block)}
              disabled={stackOrder.includes(block)}
              className={`
                px-4 py-2 rounded-lg border-2 font-sans capitalize transition-all duration-200
                ${stackOrder.includes(block)
                  ? 'border-surface-300 bg-surface-100 text-surface-400 cursor-not-allowed'
                  : 'border-primary bg-white text-primary hover:bg-primary hover:text-white'
                }
              `}
            >
              {block}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Stack area */}
      <div className="mb-6">
        <p className="text-sm text-surface-600 font-sans mb-3">Your pyramid (bottom to top):</p>
        <div className="space-y-2">
          {stackOrder.map((block, index) => (
            <motion.div
              key={`${block}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className={`
                px-4 py-2 rounded-lg bg-secondary/20 border border-secondary/50 font-sans capitalize
                ${block === 'large' ? 'w-32' : 
                  block === 'medium' ? 'w-24' : 
                  block === 'small' ? 'w-16' : 'w-12'}
              `}>
                {block}
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => removeFromStack(block)}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      <Button
        variant="primary"
        size="lg"
        disabled={stackOrder.length !== challenge.blocks.length}
        onClick={() => onAnswer(stackOrder)}
        className="w-full"
      >
        Complete Pyramid
      </Button>
    </div>
  );
};

const CountingChallenge = ({ challenge, onAnswer }) => {
  const [count, setCount] = useState('');
  
  return (
    <div>
      <h4 className="font-bold text-surface-800 font-heading mb-4">
        Count the Roman coins
      </h4>
      
      {/* Visual coin display */}
      <div className="mb-6 p-6 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl">
        <div className="grid grid-cols-6 gap-2">
          {[...Array(challenge.coins)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: i * 0.1 }}
              className="text-2xl text-center"
            >
              🪙
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-surface-700 font-sans mb-2">
          How many coins do you count?
        </label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="Enter number..."
          className="w-full p-3 border border-surface-300 rounded-lg text-lg text-center font-sans"
          min="1"
          max="50"
        />
      </div>
      
      <Button
        variant="primary"
        size="lg"
        disabled={!count}
        onClick={() => onAnswer(parseInt(count))}
        className="w-full"
      >
        Submit Count
      </Button>
    </div>
  );
};

const SequenceChallenge = ({ challenge, onAnswer }) => {
  const [sequence, setSequence] = useState([]);
  const steps = [
    { id: 'mount', label: 'Mount chariot', emoji: '🏃‍♂️' },
    { id: 'race', label: 'Race begins', emoji: '🏇' },
    { id: 'finish', label: 'Cross finish line', emoji: '🏁' }
  ];
  
  const addStep = (stepId) => {
    if (!sequence.includes(stepId)) {
      setSequence([...sequence, stepId]);
    }
  };
  
  const removeStep = (stepId) => {
    setSequence(sequence.filter(s => s !== stepId));
  };
  
  return (
    <div>
      <h4 className="font-bold text-surface-800 font-heading mb-4">
        Put the chariot race steps in order
      </h4>
      
      {/* Available steps */}
      <div className="mb-6">
        <p className="text-sm text-surface-600 font-sans mb-3">Available steps:</p>
        <div className="space-y-2">
          {steps.map((step) => (
            <motion.button
              key={step.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addStep(step.id)}
              disabled={sequence.includes(step.id)}
              className={`
                w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all duration-200
                ${sequence.includes(step.id)
                  ? 'border-surface-300 bg-surface-100 text-surface-400 cursor-not-allowed'
                  : 'border-primary bg-white text-primary hover:bg-primary hover:text-white'
                }
              `}
            >
              <span className="text-xl">{step.emoji}</span>
              <span className="font-sans">{step.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Sequence area */}
      <div className="mb-6">
        <p className="text-sm text-surface-600 font-sans mb-3">Your sequence:</p>
        <div className="space-y-2">
          {sequence.map((stepId, index) => {
            const step = steps.find(s => s.id === stepId);
            return (
              <motion.div
                key={`${stepId}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-accent/20 border border-accent/50 rounded-lg"
              >
                <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-xl">{step.emoji}</span>
                <span className="flex-1 font-sans">{step.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => removeStep(stepId)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <Button
        variant="primary"
        size="lg"
        disabled={sequence.length !== challenge.sequence.length}
        onClick={() => onAnswer(sequence)}
        className="w-full"
      >
        Submit Sequence
      </Button>
    </div>
  );
};

const SortingChallenge = ({ challenge, onAnswer }) => {
  const [sortedItems, setSortedItems] = useState([]);
  
  const addItem = (item) => {
    if (!sortedItems.includes(item)) {
      setSortedItems([...sortedItems, item]);
    }
  };
  
  const removeItem = (item) => {
    setSortedItems(sortedItems.filter(i => i !== item));
  };
  
  const getSizeEmoji = (dino) => {
    const emojis = {
      'Compsognathus': '🦎',
      'Triceratops': '🦕',
      'T-Rex': '🦖'
    };
    return emojis[dino] || '🦕';
  };
  
  return (
    <div>
      <h4 className="font-bold text-surface-800 font-heading mb-4">
        Sort dinosaurs from smallest to largest
      </h4>
      
      {/* Available dinosaurs */}
      <div className="mb-6">
        <p className="text-sm text-surface-600 font-sans mb-3">Available dinosaurs:</p>
        <div className="space-y-2">
          {challenge.items.map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addItem(item)}
              disabled={sortedItems.includes(item)}
              className={`
                w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all duration-200
                ${sortedItems.includes(item)
                  ? 'border-surface-300 bg-surface-100 text-surface-400 cursor-not-allowed'
                  : 'border-primary bg-white text-primary hover:bg-primary hover:text-white'
                }
              `}
            >
              <span className="text-2xl">{getSizeEmoji(item)}</span>
              <span className="font-sans">{item}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Sorted list */}
      <div className="mb-6">
        <p className="text-sm text-surface-600 font-sans mb-3">Your order (smallest to largest):</p>
        <div className="space-y-2">
          {sortedItems.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-success/20 border border-success/50 rounded-lg"
            >
              <span className="w-6 h-6 bg-success text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="text-2xl">{getSizeEmoji(item)}</span>
              <span className="flex-1 font-sans">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => removeItem(item)}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      <Button
        variant="primary"
        size="lg"
        disabled={sortedItems.length !== challenge.items.length}
        onClick={() => onAnswer(sortedItems)}
        className="w-full"
      >
        Submit Order
>
        Submit Order
      </Button>
    </div>
  );
};

export default ChallengeOverlay;