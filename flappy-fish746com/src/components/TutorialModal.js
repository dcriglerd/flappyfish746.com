import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const STORAGE_KEY = 'flappyfish_tutorial_completed';

// Tutorial steps configuration
const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Flappy Fish!',
    description: 'Let\'s learn how to play in just a few steps.',
    icon: '🐠',
    animation: 'bounce',
  },
  {
    id: 'tap_to_swim',
    title: 'Tap to Swim',
    description: 'Tap anywhere on the screen to make your fish swim upward. Release to let it fall.',
    icon: '👆',
    animation: 'tap',
    showHand: true,
  },
  {
    id: 'avoid_pipes',
    title: 'Avoid the Pipes',
    description: 'Navigate through the gaps in the pipes. Hitting them ends the game!',
    icon: '🚧',
    animation: 'pipes',
    showPipes: true,
  },
  {
    id: 'collect_coins',
    title: 'Collect Coins',
    description: 'Grab coins as you swim to unlock new fish skins and power-ups!',
    icon: '🪙',
    animation: 'coins',
    showCoins: true,
  },
  {
    id: 'power_ups',
    title: 'Use Power-Ups',
    description: 'Activate power-ups for special abilities:\n\n🛡️ Shield - Protection from one hit\n⏱️ Slow-Mo - Slows down time\n🧲 Magnet - Attracts nearby coins',
    icon: '⚡',
    animation: 'powerup',
  },
  {
    id: 'streaks',
    title: 'Daily Streaks',
    description: 'Play every day to build your streak and earn bonus rewards!',
    icon: '🔥',
    animation: 'streak',
  },
  {
    id: 'ready',
    title: 'You\'re Ready!',
    description: 'Time to dive in and set a high score. Good luck!',
    icon: '🎮',
    animation: 'celebrate',
  },
];

const TutorialModal = ({ visible, onComplete, forceShow = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShow, setShouldShow] = useState(forceShow);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const handAnim = useRef(new Animated.Value(0)).current;
  const fishY = useRef(new Animated.Value(0)).current;
  const coinRotate = useRef(new Animated.Value(0)).current;

  // Check if tutorial was already completed
  useEffect(() => {
    const checkTutorialStatus = async () => {
      if (forceShow) {
        setShouldShow(true);
        return;
      }
      
      try {
        const completed = await AsyncStorage.getItem(STORAGE_KEY);
        if (!completed) {
          setShouldShow(true);
        }
      } catch (err) {
        console.error('[Tutorial] Error checking status:', err);
      }
    };
    
    if (visible) {
      checkTutorialStatus();
    }
  }, [visible, forceShow]);

  // Animate step changes
  useEffect(() => {
    if (!shouldShow) return;
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    iconScale.setValue(0);
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Step-specific animations
    const step = TUTORIAL_STEPS[currentStep];
    
    if (step.showHand) {
      // Hand tapping animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(handAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(handAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Fish swimming animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(fishY, {
            toValue: -30,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(fishY, {
            toValue: 20,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    if (step.showCoins) {
      // Coin rotation
      Animated.loop(
        Animated.timing(coinRotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
    
    return () => {
      handAnim.stopAnimation();
      fishY.stopAnimation();
      coinRotate.stopAnimation();
    };
  }, [currentStep, shouldShow]);

  const handleNext = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (err) {
      console.error('[Tutorial] Error saving status:', err);
    }
    
    setShouldShow(false);
    setCurrentStep(0);
    onComplete?.();
  }, [onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  if (!visible || !shouldShow) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handTranslateY = handAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const coinSpin = coinRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            {TUTORIAL_STEPS.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          {/* Icon */}
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScale }] }]}>
            <Text style={styles.icon}>{step.icon}</Text>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>{step.title}</Text>

          {/* Interactive Demo Area */}
          {step.showHand && (
            <View style={styles.demoArea}>
              <Animated.Text 
                style={[
                  styles.demoFish,
                  { transform: [{ translateY: fishY }] }
                ]}
              >
                🐠
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.demoHand,
                  { transform: [{ translateY: handTranslateY }] }
                ]}
              >
                👆
              </Animated.Text>
            </View>
          )}

          {step.showPipes && (
            <View style={styles.demoArea}>
              <View style={styles.pipeDemo}>
                <View style={styles.pipeTop} />
                <Text style={styles.demoPipeFish}>🐠</Text>
                <View style={styles.pipeBottom} />
              </View>
            </View>
          )}

          {step.showCoins && (
            <View style={styles.demoArea}>
              <View style={styles.coinDemo}>
                <Animated.Text style={[styles.demoCoin, { transform: [{ rotateY: coinSpin }] }]}>🪙</Animated.Text>
                <Animated.Text style={[styles.demoCoin, styles.demoCoin2, { transform: [{ rotateY: coinSpin }] }]}>🪙</Animated.Text>
                <Animated.Text style={[styles.demoCoin, styles.demoCoin3, { transform: [{ rotateY: coinSpin }] }]}>🪙</Animated.Text>
                <Text style={styles.demoCoinFish}>🐠</Text>
              </View>
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>{step.description}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!isFirstStep && (
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.nextButton, isLastStep && styles.startButton]} 
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {isLastStep ? "Let's Play!" : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip button */}
          {!isLastStep && (
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip Tutorial</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

// Static method to reset tutorial
TutorialModal.resetTutorial = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('[Tutorial] Error resetting:', err);
    return false;
  }
};

// Static method to check if tutorial was completed
TutorialModal.isCompleted = async () => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEY);
    return completed === 'true';
  } catch (err) {
    return false;
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressDotActive: {
    backgroundColor: COLORS.GOLD,
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: '#4ade80',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoArea: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0, 150, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  demoFish: {
    fontSize: 36,
    position: 'absolute',
  },
  demoHand: {
    fontSize: 28,
    position: 'absolute',
    bottom: 10,
    right: 30,
  },
  pipeDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  pipeTop: {
    position: 'absolute',
    top: 0,
    left: '30%',
    width: 40,
    height: 35,
    backgroundColor: '#22c55e',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  pipeBottom: {
    position: 'absolute',
    bottom: 0,
    left: '30%',
    width: 40,
    height: 35,
    backgroundColor: '#22c55e',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  demoPipeFish: {
    fontSize: 30,
    marginLeft: 20,
  },
  coinDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  demoCoin: {
    fontSize: 28,
    position: 'absolute',
    right: 60,
  },
  demoCoin2: {
    right: 100,
  },
  demoCoin3: {
    right: 140,
  },
  demoCoinFish: {
    fontSize: 30,
    position: 'absolute',
    left: 40,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.GOLD,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 16,
    padding: 8,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
});

export default TutorialModal;
