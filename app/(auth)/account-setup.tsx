import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';
import { auth, db } from '@/FirebaseConfig';
import { GeoPoint } from 'firebase/firestore';
import { Discipline } from '@/types/fighter';
import * as ImagePicker from 'expo-image-picker';
import { addNewUserToDB } from '@/utils/firebaseUtils';
import { LocationSelector } from '@/components/LocationSelector';
import { createUserWithEmailAndPassword } from '@firebase/auth';
// inside your component
const { email, password } = useLocalSearchParams<{ email?: string; password?: string }>();


/**
 * Default profile photo URL used on account creation
 */
export const defaultPhoto = 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';

export default function AccountSetupScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<GeoPoint>();
  const [discipline, setDiscipline] = useState<Discipline>('MMA');
  const [rank, setRank] = useState<string>('Beginner');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { email, password } = useLocalSearchParams<{ email: string; password: string }>();

  const handlePhotoChange = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets[0].uri) {
        setPhoto(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to pick image. Please try again.');
    }
  };

  const handleCompleteSetup = async () => {
    try {
      if (!name || !age || !location || !coordinates || !discipline || !rank) {
        setError('Please fill in all required fields');
        return;
      }
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge >= 150) {
        setError('Please enter a valid age (1-149)');
        return;
      }

      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential) {
        console.log('Sign up success');
      }
      setLoading(false);
      const user = auth.currentUser;

      if (!user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user found');
      }
      addNewUserToDB(user.uid, name, age, location, coordinates, discipline, rank, photo);
      
      console.log('Profile created successfully, navigating to tabs');
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Setup failed with error:', error);
      setError(error.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell us about yourself to get started</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity onPress={handlePhotoChange} style={styles.photoContainer}>
            <Image
              source={{ uri: photo || defaultPhoto }}
              style={styles.photo}
            />
            <Text style={styles.photoText}>Add Profile Photo</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.gray[400]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor={theme.colors.gray[400]}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <LocationSelector
            initialLocation={null}
            onSelect={(loc) => {
              console.log('Selected:', loc);
              setLocation(loc.name);
              setCoordinates(new GeoPoint(loc.lat, loc.lng));
              // save to Firebase as GeoPoint(lat, lng)
            }}
          />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Discipline</Text>
            <View style={styles.disciplineContainer}>
              {['Aikido', 'BJJ', 'Boxing', 'Judo', 'Karate',
                'Kendo', 'Kickboxing', 'Kung Fu', 'Krav Maga',
                'Taekwondo', 'MMA', 'Muay Thai', 'Wrestling'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.disciplineButton,
                    discipline === d && styles.disciplineButtonSelected,
                  ]}
                  onPress={() => setDiscipline(d as Discipline)}
                >
                  <Text
                    style={[
                      styles.disciplineButtonText,
                      discipline === d && styles.disciplineButtonTextSelected,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rank</Text>
            <View style={styles.disciplineContainer}>
              {['Beginner', 'Intermediate', 'Pro'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.disciplineButton,
                    rank === r && styles.disciplineButtonSelected,
                  ]}
                  onPress={() => setRank(r as string)}
                >
                  <Text
                    style={[
                      styles.disciplineButtonText,
                      rank === r && styles.disciplineButtonTextSelected,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.completeButton, loading && styles.completeButtonDisabled]}
            onPress={handleCompleteSetup}
            disabled={loading}
          >
            <Text style={styles.completeButtonText}>
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Text>
          </TouchableOpacity>
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
  scrollContainer: {
    padding: theme.spacing[4],
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: theme.colors.gray[900],
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.gray[600],
    marginBottom: theme.spacing[6],
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing[2],
  },
  photoText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.primary[500],
  },
  inputContainer: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.gray[800],
    marginBottom: theme.spacing[2],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: 8,
    padding: theme.spacing[3],
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  disciplineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  disciplineButton: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
  },
  disciplineButtonSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  disciplineButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.gray[700],
  },
  disciplineButtonTextSelected: {
    color: theme.colors.white,
  },
  completeButton: {
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  completeButtonDisabled: {
    opacity: 0.7,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: theme.colors.white,
  },
  errorContainer: {
    backgroundColor: theme.colors.error[100],
    padding: theme.spacing[3],
    borderRadius: 8,
    marginBottom: theme.spacing[4],
  },
  errorText: {
    color: theme.colors.error[600],
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});