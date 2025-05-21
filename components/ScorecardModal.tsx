import { StyleSheet, View, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import { theme } from '@/styles/theme';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { X } from 'lucide-react-native';

interface ScorecardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (winnerId: string) => void;
  participants: {
    id: string;
    name: string;
    photo: string;
  }[];
}

export default function ScorecardModal({ visible, onClose, onSubmit, participants }: ScorecardModalProps) {
  const [selectedWinner, setSelectedWinner] = useState<string>('');

  const handleSubmit = () => {
    if (selectedWinner !== '') {
      onSubmit(selectedWinner);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Report Match Result</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Winner</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedWinner}
                onValueChange={(value) => setSelectedWinner(value)}
                style={styles.picker}
                testID='result-submitter'
              >
                <Picker.Item label="Select a winner..." value="" />
                {participants.map((participant) => (
                  <Picker.Item
                    key={participant.id}
                    label={participant.name}
                    value={participant.id}
                  />
                ))}
                <Picker.Item label="Draw" value="draw" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedWinner && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedWinner}
            testID='result-submit-button'
          >
            <Text style={styles.submitButtonText}>Submit Result</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing[4],
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: theme.colors.gray[900],
  },
  closeButton: {
    padding: theme.spacing[1],
  },
  pickerContainer: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing[2],
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[3],
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: theme.spacing[3],
  },
  uploadText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing[2],
  },
  videoSelected: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.success[500],
    textAlign: 'center',
    marginBottom: theme.spacing[3],
  },
  submitButton: {
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing[3],
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.white,
  },
});