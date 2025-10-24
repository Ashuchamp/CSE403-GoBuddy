import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg';

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
};

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}_text`],
    styles[`size_${size}_text`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'default' ? '#fff' : colors.primary}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <Text style={textStyles}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  default: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  // Sizes
  size_default: {
    height: 44,
    paddingHorizontal: spacing.md,
  },
  size_sm: {
    height: 36,
    paddingHorizontal: spacing.sm,
  },
  size_lg: {
    height: 52,
    paddingHorizontal: spacing.lg,
  },
  // Text styles
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  default_text: {
    color: '#FFFFFF',
  },
  outline_text: {
    color: colors.text,
  },
  ghost_text: {
    color: colors.text,
  },
  destructive_text: {
    color: '#FFFFFF',
  },
  size_default_text: {},
  size_sm_text: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  size_lg_text: {
    fontSize: 18,
    fontWeight: '600',
  },
});

