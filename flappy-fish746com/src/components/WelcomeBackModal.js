import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/config';

const { width } = Dimensions.get('window');

const WelcomeBackModal = ({ 
  visible, 
  onClaim, 
  daysAway = 3,
  bonusCoins = 50,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const coinBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      coinBounce.setValue(0);

      // Entry animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(coinBounce, {
              toValue: -10,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(coinBounce, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Sparkle rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]);

  const handleClaim = () => {
    // Exit animation then claim
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClaim(bonusCoins);
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {/* Sparkle background */}
          <Animated.View style={[styles.sparkle, { transform: [{ rotate: spin }] }]}>
            <Text style={styles.sparkleText}>✨</Text>
          </Animated.View>
          <Animated.View style={[styles.sparkle2, { transform: [{ rotate: spin }] }]}>
            <Text style={styles.sparkleText}>⭐</Text>
          </Animated.View>

          {/* Welcome text */}
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          
          {/* Fish icon */}
          <View style={styles.fishContainer}>
            <Text style={styles.fishEmoji}>🐠</Text>
            <Text style={styles.heartEmoji}>💙</Text>
          </View>

          {/* Message */}
          <Text style={styles.messageText}>
            We missed you! It's been {daysAway} {daysAway === 1 ? 'day' : 'days'} since your last swim.
          </Text>

          {/* Bonus coins */}
          <View style={styles.bonusContainer}>
            <Text style={styles.bonusLabel}>Welcome Back Bonus</Text>
            <Animated.View style={{ transform: [{ translateY: coinBounce }] }}>
              <View style={styles.coinsRow}>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={styles.coinsAmount}>+{bonusCoins}</Text>
              </View>
            </Animated.View>
          </View>

          {/* Claim button */}
          <TouchableOpacity 
            style={styles.claimButton} 
            onPress={handleClaim}
            activeOpacity={0.8}
          >
            <Text style={styles.claimButtonText}>Claim & Play!</Text>
          </TouchableOpacity>

          {/* Subtext */}
          <Text style={styles.subtext}>
            Play daily to earn streak bonuses!
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f1c40f',
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  sparkle: {
    position: 'absolute',
    top: -15,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    top: 30,
    left: 15,
  },
  sparkleText: {
    fontSize: 28,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f1c40f',
    marginBottom: 12,
    textShadowColor: 'rgba(241, 196, 15, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  fishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fishEmoji: {
    fontSize: 48,
  },
  heartEmoji: {
    fontSize: 24,
    marginLeft: -8,
    marginTop: -20,
  },
  messageText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  bonusContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  bonusLabel: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  coinsAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#f1c40f',
    textShadowColor: 'rgba(241, 196, 15, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  claimButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  claimButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtext: {
    marginTop: 16,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default WelcomeBackModal;
