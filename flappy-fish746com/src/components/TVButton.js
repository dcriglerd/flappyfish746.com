import React, { useState, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  TVFocusGuideView,
} from 'react-native';

// Check if running on TV
const isTV = Platform.isTV || Platform.OS === 'android';

/**
 * TVButton - A button component with Fire TV / D-pad focus support
 * Wraps TouchableOpacity with focus state handling for TV navigation
 */
const TVButton = ({ 
  children, 
  style, 
  onPress, 
  focusStyle,
  hasTVPreferredFocus = false,
  nextFocusUp,
  nextFocusDown,
  nextFocusLeft,
  nextFocusRight,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Default focus style
  const defaultFocusStyle = {
    borderWidth: 3,
    borderColor: '#00d4ff',
    transform: [{ scale: 1.05 }],
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  };

  return (
    <TouchableOpacity
      ref={buttonRef}
      style={[
        style,
        isFocused && (focusStyle || defaultFocusStyle),
      ]}
      onPress={onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      accessible={true}
      accessibilityRole="button"
      hasTVPreferredFocus={hasTVPreferredFocus}
      nextFocusUp={nextFocusUp}
      nextFocusDown={nextFocusDown}
      nextFocusLeft={nextFocusLeft}
      nextFocusRight={nextFocusRight}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

/**
 * TVFocusContainer - Wrapper for managing TV focus within a group of elements
 */
const TVFocusContainer = ({ children, style, ...props }) => {
  if (Platform.OS === 'android' && TVFocusGuideView) {
    return (
      <TVFocusGuideView style={style} {...props}>
        {children}
      </TVFocusGuideView>
    );
  }
  return children;
};

export { TVButton, TVFocusContainer, isTV };
export default TVButton;
