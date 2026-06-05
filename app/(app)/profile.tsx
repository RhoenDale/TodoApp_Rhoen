import { APP_VERSION } from '@/constants/AppInfo';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { isDarkMode, setDarkMode } = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleDarkModeToggle = async (value: boolean) => {
    try {
      setIsLoading(true);
      await setDarkMode(value);
      if (user) {
        await updateProfile({ darkMode: value });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update dark mode';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            Alert.alert('Error', errorMessage);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#6D28D9" />
        </View>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Dark Mode Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color="#6D28D9" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isDarkMode && styles.toggleButtonActive,
              isLoading && styles.disabledToggle,
            ]}
            onPress={() => handleDarkModeToggle(!isDarkMode)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View
                style={[
                  styles.toggleSwitch,
                  isDarkMode && styles.toggleSwitchActive,
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* App Version */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.versionContainer}>
          <Text style={styles.versionLabel}>App Version</Text>
          <Text style={styles.versionNumber}>{APP_VERSION}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },

  avatarContainer: {
    marginBottom: 15,
  },

  accountInfo: {
    alignItems: 'center',
  },

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },

  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },

  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B21B6',
    marginBottom: 15,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  settingText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },

  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },

  toggleButtonActive: {
    backgroundColor: '#6D28D9',
  },

  disabledToggle: {
    opacity: 0.6,
  },

  toggleSwitch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  toggleSwitchActive: {
    alignSelf: 'flex-end',
  },

  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  versionLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },

  versionNumber: {
    fontSize: 16,
    color: '#6D28D9',
    fontWeight: '700',
  },

  logoutButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
