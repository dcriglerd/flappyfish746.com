import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAds } from '../context/AdsContext';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Adaptive & Collapsible Banner Ad Component
 * 
 * Features:
 * - Anchored adaptive banner that fits screen width
 * - Collapsible functionality (expands/collapses)
 * - Graceful error handling
 * - Position options (top/bottom)
 */
const BannerAdComponent = ({ 
  position = 'bottom', // 'top' or 'bottom'
  collapsible = true,  // Enable collapsible feature
}) => {
  const { showBanner, bannerAdUnitId, adsRemoved } = useAds();
  const [adError, setAdError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Animation for collapse/expand
  const [collapseAnim] = useState(new Animated.Value(1));

  const handleAdLoaded = useCallback(() => {
    console.log('[BannerAd] Loaded successfully');
    setAdLoaded(true);
    setAdError(false);
  }, []);

  const handleAdFailedToLoad = useCallback((error) => {
    console.log('[BannerAd] Failed to load:', error);
    setAdError(true);
    setAdLoaded(false);
  }, []);

  const handleAdOpened = useCallback(() => {
    console.log('[BannerAd] Ad opened');
  }, []);

  const handleAdClosed = useCallback(() => {
    console.log('[BannerAd] Ad closed');
  }, []);

  // Toggle collapse/expand (manual control if needed)
  const toggleCollapse = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(collapseAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  }, [isExpanded, collapseAnim]);

  if (!showBanner || adsRemoved) return null;

  // If ad failed to load, show nothing (graceful degradation)
  if (adError) {
    return null;
  }

  // Build request options with collapsible support
  const requestOptions = {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['game', 'fish', 'arcade', 'fun', 'casual', 'mobile game'],
  };

  // Add collapsible network extras if enabled
  if (collapsible) {
    requestOptions.networkExtras = {
      collapsible: position, // 'top' or 'bottom'
    };
  }

  const containerStyle = [
    styles.bannerContainer,
    position === 'top' ? styles.topPosition : styles.bottomPosition,
  ];

  return (
    <View style={containerStyle}>
      {/* Ad loaded indicator (subtle) */}
      {adLoaded && (
        <View style={styles.adLoadedIndicator}>
          <Text style={styles.adLabel}>Ad</Text>
        </View>
      )}
      
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={requestOptions}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdOpened={handleAdOpened}
        onAdClosed={handleAdClosed}
      />
    </View>
  );
};

/**
 * Inline Adaptive Banner for use within content
 * Automatically sizes to container width
 */
export const InlineAdaptiveBanner = ({ containerWidth = SCREEN_WIDTH }) => {
  const { showBanner, bannerAdUnitId, adsRemoved } = useAds();
  const [adError, setAdError] = useState(false);

  if (!showBanner || adsRemoved || adError) return null;

  return (
    <View style={styles.inlineBannerContainer}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['game', 'fish', 'arcade', 'fun'],
        }}
        onAdLoaded={() => console.log('[InlineBanner] Loaded')}
        onAdFailedToLoad={(error) => {
          console.log('[InlineBanner] Failed:', error);
          setAdError(true);
        }}
      />
    </View>
  );
};

/**
 * Medium Rectangle Banner (300x250)
 * Good for game over screens or between content
 */
export const MediumRectangleBanner = () => {
  const { showBanner, bannerAdUnitId, adsRemoved } = useAds();
  const [adError, setAdError] = useState(false);

  if (!showBanner || adsRemoved || adError) return null;

  return (
    <View style={styles.mediumRectContainer}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.MEDIUM_RECTANGLE}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['game', 'fish', 'arcade', 'fun'],
        }}
        onAdLoaded={() => console.log('[MediumRect] Loaded')}
        onAdFailedToLoad={(error) => {
          console.log('[MediumRect] Failed:', error);
          setAdError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    minHeight: 50,
    width: '100%',
  },
  topPosition: {
    top: 0,
  },
  bottomPosition: {
    bottom: 0,
  },
  adLoadedIndicator: {
    position: 'absolute',
    top: 2,
    left: 5,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  adLabel: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  inlineBannerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  mediumRectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
});

export default BannerAdComponent;
