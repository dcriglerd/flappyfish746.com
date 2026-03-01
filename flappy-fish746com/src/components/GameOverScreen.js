import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/config';

const GameOverScreen = ({
  score,
  highScore,
  coins,
  isNewHighScore,
  canRevive,
  onRetry,
  onRevive,
  onHome,
}) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={isNewHighScore ? styles.newRecordTitle : styles.gameOverTitle}>
        {isNewHighScore ? '🌟 NEW RECORD! 🌟' : 'GAME OVER'}
      </Text>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🏆 Best</Text>
            <Text style={styles.statValue}>{highScore}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🪙 Coins</Text>
            <Text style={styles.statValue}>{coins}</Text>
          </View>
        </View>
      </View>

      {/* Revive Button */}
      {canRevive && (
        <FocusableButton style={styles.reviveButton} onPress={onRevive}>
          <Text style={styles.reviveButtonText}>🎥 Watch Ad to Revive</Text>
        </FocusableButton>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <FocusableButton style={styles.retryButton} onPress={onRetry} hasTVPreferredFocus={true}>
          <Text style={styles.retryButtonText}>🔄 RETRY</Text>
        </FocusableButton>
        <FocusableButton style={styles.homeButton} onPress={onHome}>
          <Text style={styles.homeButtonText}>🏠 Menu</Text>
        </FocusableButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // TV Focus state
  focusedButton: {
    borderWidth: 3,
    borderColor: '#00d4ff',
    transform: [{ scale: 1.05 }],
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ff4757',
    marginBottom: 20,
  },
  newRecordTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.GOLD,
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    minWidth: 250,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  scoreValue: {
    color: COLORS.WHITE,
    fontSize: 48,
    fontWeight: '900',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.GOLD,
    fontSize: 12,
  },
  statValue: {
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: '700',
  },
  reviveButton: {
    backgroundColor: '#9333ea',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
  },
  reviveButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  retryButton: {
    backgroundColor: COLORS.ORANGE,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 3,
    borderColor: '#c44d1a',
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '900',
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  homeButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameOverScreen;