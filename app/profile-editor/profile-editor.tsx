import { Image, KeyboardAvoidingView, Text, TextInput, Platform, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';
import { updateUserInDB } from '@/utils/firebaseUtils';
import { auth } from '@/FirebaseConfig';
import { Discipline } from '@/types/fighter';
import { useUser } from '@/context/UserContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser(); // Shared user state from UserContext
  const [saving, setSaving] = useState(false);

  // Initialize form fields with user data from context
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age.toString() || '');
  const [location, setLocation] = useState(user?.location || '');
  const [discipline, setDiscipline] = useState<Discipline | undefined>(user?.discipline);
  const [rank, setRank] = useState<string | undefined>(user?.rank);
  const [photo, setPhoto] = useState(user?.photo || '');

  const handleSave = async () => {
    if (!name || !age || !location || !discipline || !rank) {
      alert('Please fill in all required fields');
      return;
    } else if (!user) {
      console.error('user has not been set');
      return;
    } else if (!auth.currentUser) {
      console.error('No authenticated user found.');
      return;
    }
    
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge >= 150) {
      console.error('Please enter a valid age (1-149)');
      return;
    }

    const updatedUser = {
      ...user,
      name,
      age: parsedAge,
      location,
      discipline,
      rank,
      photo,
    };

    setSaving(true); // Start saving process
    try {
      const result = await updateUserInDB(user.id, updatedUser);
      if (result) {
        console.log('Profile updated successfully.');

        setUser(updatedUser); // Update shared user state

        router.back();
      } else {
        console.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async () => {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Edit Profile</Text>

          <Text style={styles.label}>Profile Picture</Text>
          <TouchableOpacity onPress={handlePhotoChange}>
            <Image
              source={{ uri: photo }}
              style={styles.picture}
            />
          </TouchableOpacity>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Discipline</Text>
          <SelectList
            inputStyles={styles.selectText}
            boxStyles={styles.input}
            dropdownStyles={styles.input}
            dropdownItemStyles={styles.dropdownText}
            setSelected={setDiscipline}
            search={false}
            placeholder={ discipline || "Select your discipline" }
            data={[
              { label: 'Aikido', value: 'Aikido' },
              { label: 'BJJ', value: 'BJJ' },
              { label: 'Boxing', value: 'Boxing' },
              { label: 'Judo', value: 'Judo' },
              { label: 'Karate', value: 'Karate' },
              { label: 'Kendo', value: 'Kendo' },
              { label: 'Kickboxing', value: 'Kickboxing' },
              { label: 'Kung Fu', value: 'Kung Fu' },
              { label: 'Krav Maga', value: 'Krav Maga' },
              { label: 'Taekwondo', value: 'Taekwondo' },
              { label: 'MMA', value: 'MMA' },
              { label: 'Muay Thai', value: 'Muay Thai' },
              { label: 'Wrestling', value: 'Wrestling' },
            ]}
          />

          <Text style={styles.label}>Rank</Text>
          <SelectList
            inputStyles={styles.selectText}
            boxStyles={styles.input}
            dropdownStyles={styles.input}
            dropdownItemStyles={styles.dropdownText}
            setSelected={setRank}
            search={false}
            placeholder={ rank || "Select your rank" }
            data={[
              { label: 'Beginner', value: 'Beginner' },
              { label: 'Intermediate', value: 'Intermediate' },
              { label: 'Pro', value: 'Pro' },
            ]}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving} // Disable button while waiting on save
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
    backgroundColor: theme.colors.white,
  },
  scrollContainer: {
    paddingBottom: theme.spacing[10],
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: theme.spacing[4],
    color: theme.colors.gray[900],
    marginTop: theme.spacing[2],
    marginLeft: theme.spacing[3],
  },
  label: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.gray[800],
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[1],
    marginLeft: theme.spacing[3],
  },
  picture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: theme.spacing[2],
    alignContent: 'center',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: 8,
    padding: theme.spacing[3],
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: theme.spacing[1],
    marginHorizontal: theme.spacing[2],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[6],
    marginHorizontal: theme.spacing[2],
    width: '100%',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    marginHorizontal: theme.spacing[6], // Add spacing from the Cancel button
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.gray[200],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    marginHorizontal: theme.spacing[2], // Add spacing from the Save button
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: theme.colors.white,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: theme.colors.gray[700],
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.gray[800],
  },
  dropdownText: {
    color: theme.colors.gray[800],
    padding: theme.spacing[4],
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
});
