// app/edit-profile.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';
import { mockCurrentUser } from '@/data/mockCurrentUser';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = mockCurrentUser;

  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);

  const handleSave = () => {
    // In a real app, you'd send this to your backend.
    console.log('Updated user:', { name, location });

    // Go back to profile
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: theme.spacing[4],
    color: theme.colors.gray[900],
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.gray[800],
    marginTop: theme.spacing[3],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: 8,
    padding: theme.spacing[3],
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: theme.spacing[1],
  },
  saveButton: {
    marginTop: theme.spacing[6],
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing[4],
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: theme.colors.white,
  },
});
