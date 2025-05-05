// app/edit-profile.tsx
import { Image, KeyboardAvoidingView, Text, TextInput, Picker, Platform, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
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
    // Implement save logic here (backend API call, etc.)
    // For now, just log the updated user data
    console.log('Updated user:', { name, age, location, discipline, photo });

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
          <Picker
            selectedValue={discipline}
            style={styles.input}
            onValueChange={(itemValue: Discipline) => setDiscipline(itemValue as Discipline)}
          >
            <Picker.Item label="Aikido" value="Aikido" />
            <Picker.Item label="BJJ" value="BJJ" />
            <Picker.Item label="Boxing" value="Boxing" />
            <Picker.Item label="Judo" value="Judo" />
            <Picker.Item label="Karate" value="Karate" />
            <Picker.Item label="Kendo" value="Kendo" />
            <Picker.Item label="Kickboxing" value="Kickboxing" />
            <Picker.Item label="Kung Fu" value="Kung Fu" />
            <Picker.Item label="Krav Maga" value="Krav Maga" />
            <Picker.Item label="Taekwondo" value="Taekwondo" />
            <Picker.Item label="MMA" value="MMA" />
            <Picker.Item label="Muay Thai" value="Muay Thai" />
            <Picker.Item label="Wrestling" value="Wrestling" />
          </Picker>

          

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          
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
    fontSize: 16,
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
    marginLeft: theme.spacing[2],
    marginRight: theme.spacing[2],
  },
  saveButton: {
    marginTop: theme.spacing[6],
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: theme.spacing[2],
    marginRight: theme.spacing[2],
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: theme.colors.white,
  },
});
