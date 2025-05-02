// app/edit-profile.tsx
import { View, Text, TextInput, Picker, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
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

  const handleSave = () => {
    // Implement save logic here (backend API call, etc.)
    // For now, just log the updated user data
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
