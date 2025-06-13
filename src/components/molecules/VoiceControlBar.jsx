import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const VoiceControlBar = ({ 
  currentFact = null, 
  isPlaying = false, 
  showText = false,
  onPlay,
  onPause,
  onToggleText,
  onClose
}) => {
  const [volume, setVolume] = useState(80);

  if (!currentFact) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl border-2 border-primary/20 p-4 z-40"
      >
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <Button
            variant="primary"
            size="sm"
            icon={isPlaying ? 'Pause' : 'Play'}
            onClick={isPlaying ? onPause : onPlay}
            className="flex-shrink-0"
          />

          {/* Fact Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary font-medium font-sans uppercase tracking-wide">
                {currentFact.category}
              </span>
              {isPlaying && (
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-4 bg-primary rounded-full"
                      animate={{
                        scaleY: [1, 2, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {showText && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-sm text-surface-700 font-sans leading-relaxed"
                >
                  {currentFact.content}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              icon="Type"
              onClick={onToggleText}
              className={showText ? 'text-primary bg-primary/10' : ''}
            />
            
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Volume Control (shown when text is visible) */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-100"
            >
              <ApperIcon name="Volume2" size={16} className="text-surface-600" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="flex-1 h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-surface-600 font-sans min-w-[3ch]">
                {volume}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceControlBar;