import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

type TabBarIconProps = ComponentProps<typeof Ionicons> & { name: ComponentProps<typeof Ionicons>['name'] };

export function TabBarIcon(props: TabBarIconProps) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}
