import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { theme } from '@/styles/theme';
import { auth } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) console.log('sign in success');
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
      setError('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) console.log('sign up success');
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
      setError('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/4761668/pexels-photo-4761668.jpeg' }} 
              style={styles.backgroundImage} 
            />
            <View style={styles.overlay} />
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>SwipeFight</Text>
              <Text style={styles.tagline}>Find your next sparring partner</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.gray[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.gray[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={signIn}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={signUp}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Create Account' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: theme.spacing[5],
  },
  headerContainer: {
    height: 240,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[10],
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.white,
    marginTop: theme.spacing[1],
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    flex: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
  },
  errorContainer: {
    backgroundColor: theme.colors.error[100],
    borderRadius: theme.spacing[2],
    padding: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.error[700],
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing[1],
  },
  input: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.spacing[2],
    padding: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.gray[900],
    fontFamily: 'Inter-Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing[2],
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.primary[500],
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.spacing[2],
    padding: theme.spacing[3],
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  loginButtonDisabled: {
    backgroundColor: theme.colors.gray[400],
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.white,
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
  },
  signupText: {
    fontFamily: 'Inter-Regular',
    color: theme.colors.gray[600],
    fontSize: 14,
  },
  signupLink: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.primary[500],
    fontSize: 14,
  },
});