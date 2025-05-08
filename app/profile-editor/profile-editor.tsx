// app/edit-profile.tsx
import { Image, KeyboardAvoidingView, Text, TextInput, Platform, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';
import { mockCurrentUser } from '@/data/mockCurrentUser';
import { Discipline } from '@/types/fighter';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = mockCurrentUser;

  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age.toString());
  const [location, setLocation] = useState(user.location);
  const [discipline, setDiscipline] = useState<Discipline>(user.discipline);
  const [photo, setPhoto] = useState(user.photo);

  const handleSave = () => {
    // Update the user profile with new values
    const updatedUser = {
      ...user,
      name,
      age: parseInt(age, 10),
      location,
      discipline,
      photo,
    };

    // Update the mock user data
    Object.assign(mockCurrentUser, updatedUser);

    // Force a refresh of the mock user data
    mockCurrentUser.name = name;
    mockCurrentUser.age = parseInt(age, 10);
    mockCurrentUser.location = location;
    mockCurrentUser.discipline = discipline;
    mockCurrentUser.photo = photo;

    // Go back to profile
    router.back();
  };

  const handlePhotoChange = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
      // Launch the image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Ensure the image is square
        quality: 1,
      });
  
      // Ensure the result is not canceled and has the expected structure
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets[0].uri) {
        setPhoto(pickerResult.assets[0].uri); // Access the URI of the first image asset
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
            placeholder='Select your discipline'
            data={[ { label: 'Aikido', value: 'Aikido' },
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
                    { label: 'Wrestling', value: 'Wrestling' },   ]}
            />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
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
    gap: theme.spacing[3],
    width: '100%',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.gray[200],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
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
});
