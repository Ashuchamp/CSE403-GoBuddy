import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'destructive';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Badge({
  children,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}_text`], textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: colors.primary,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.badgeBackground,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  success: {
    backgroundColor: colors.success,
  },
  destructive: {
    backgroundColor: colors.error,
  },
  text: {
    ...typography.caption,
    fontWeight: '500',
  },
  default_text: {
    color: '#FFFFFF',
  },
  primary_text: {
    color: '#FFFFFF',
  },
  secondary_text: {
    color: colors.badgeText,
  },
  outline_text: {
    color: colors.text,
  },
  success_text: {
    color: '#FFFFFF',
  },
  destructive_text: {
    color: '#FFFFFF',
  },
});

