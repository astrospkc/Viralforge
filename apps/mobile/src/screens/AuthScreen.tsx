import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!formData.email) {
      Alert.alert('Required', 'Please enter your email address first.');
      return;
    }
    setLoading(true);
    // Simulating sending OTP via AuthService
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      Alert.alert('OTP Sent', `A verification code was sent to ${formData.email}`);
    }, 600);
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Required', 'Please fill in email and password.');
      return;
    }
    if (isSignUp && (!formData.name || !formData.otp)) {
      Alert.alert('Required', 'Please enter your name and OTP code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
      if (onSuccess) onSuccess();
    }, 800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>
            VIRAL<Text style={styles.brandAccent}>FORGE</Text>
          </Text>
          <Text style={styles.title}>{isSignUp ? 'Create an Account' : 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Join developers & creators sharing verified proof of work'
              : 'Sign in to access your portfolio and reviews'}
          </Text>
        </View>

        {/* Tab Toggle */}
        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isSignUp && styles.toggleBtnActive]}
            onPress={() => {
              setIsSignUp(false);
              setOtpSent(false);
            }}
          >
            <Text style={[styles.toggleBtnText, !isSignUp && styles.toggleBtnTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isSignUp && styles.toggleBtnActive]}
            onPress={() => setIsSignUp(true)}
          >
            <Text style={[styles.toggleBtnText, isSignUp && styles.toggleBtnTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Jane Doe"
                placeholderTextColor="#777"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@domain.com"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#777"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
          </View>

          {isSignUp && !otpSent && (
            <TouchableOpacity
              style={styles.otpButton}
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text style={styles.otpButtonText}>
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
              </Text>
            </TouchableOpacity>
          )}

          {isSignUp && otpSent && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#777"
                keyboardType="numeric"
                value={formData.otp}
                onChangeText={(text) => setFormData({ ...formData, otp: text })}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, (!isSignUp || otpSent) ? {} : styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSignUp && !otpSent}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  brandAccent: {
    color: '#E50914',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 18,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#E50914',
  },
  toggleBtnText: {
    color: '#888888',
    fontWeight: '700',
    fontSize: 13,
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  otpButton: {
    backgroundColor: '#2E2E2E',
    borderWidth: 1,
    borderColor: '#E50914',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  otpButtonText: {
    color: '#E50914',
    fontWeight: '700',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

