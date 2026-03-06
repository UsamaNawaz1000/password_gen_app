import { StyleSheet, View, Text, TextInput, Button, Alert, Switch, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useFormik } from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import * as yup from 'yup';
import { useState } from 'react';

// Define the form values interface
interface PasswordFormValues {
  passwordLength: string;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

// Create validation schema with Yup
const validationSchema = yup.object().shape({
  passwordLength: yup.number()
    .typeError('Must be a number')
    .min(4, 'Password must be at least 4 characters')
    .max(20, 'Password cannot exceed 20 characters')
    .required('Password length is required'),
  includeUppercase: yup.boolean(),
  includeLowercase: yup.boolean(),
  includeNumbers: yup.boolean(),
  includeSymbols: yup.boolean()
});

export default function HomeScreen() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Initialize Formik
  const formik = useFormik<PasswordFormValues>({
    initialValues: {
      passwordLength: '8',
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      generatePassword(values);
    },
  });

  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  // Generate password based on form values
  const generatePassword = (values: PasswordFormValues) => {
    let charList = '';
    
    if (values.includeUppercase) charList += uppercaseChars;
    if (values.includeLowercase) charList += lowercaseChars;
    if (values.includeNumbers) charList += numberChars;
    if (values.includeSymbols) charList += symbolChars;
    
    // Check if at least one option is selected
    if (charList.length === 0) {
      Alert.alert('Error', 'Select at least one character type');
      return;
    }
    
    // Generate password
    const length = Number(values.passwordLength);
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charList.length);
      result += charList[randomIndex];
    }
    
    setGeneratedPassword(result);
    setModalVisible(true);
  };

  // Reset form to initial values - THIS WAS MISSING
  const resetForm = () => {
    formik.resetForm();
    setGeneratedPassword('');
    setModalVisible(false);
  };

  // Copy to clipboard and close modal
  const copyAndClose = () => {
    Alert.alert('Success!', 'Password copied to clipboard');
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Password Generator</Text>
        
        {/* Password Length Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password Length (4-20)</Text>
          <TextInput
            style={[styles.input, formik.touched.passwordLength && formik.errors.passwordLength ? styles.inputError : null]}
            value={formik.values.passwordLength}
            onChangeText={formik.handleChange('passwordLength')}
            onBlur={formik.handleBlur('passwordLength')}
            keyboardType="numeric"
            placeholder="Enter length"
          />
          {formik.touched.passwordLength && formik.errors.passwordLength && (
            <Text style={styles.errorText}>{formik.errors.passwordLength}</Text>
          )}
        </View>

        {/* Options Section */}
        {/* Options Section */}
<View style={styles.optionsContainer}>
  <Text style={styles.sectionTitle}>Include:</Text>
  
  {/* Uppercase Toggle */}
  <View style={styles.optionRow}>
    <Text style={styles.optionText}>Uppercase (A-Z)</Text>
    <BouncyCheckbox
      isChecked={formik.values.includeUppercase}
      onPress={(checked: boolean) => {
        formik.setFieldValue('includeUppercase', checked);
      }}
      fillColor="#ff0000"
      size={25}
      iconStyle={{ borderColor: "#ff0000" }}
      innerIconStyle={{ borderWidth: 2 }}
    />
  </View>

  {/* Lowercase Toggle */}
  <View style={styles.optionRow}>
    <Text style={styles.optionText}>Lowercase (a-z)</Text>
    <BouncyCheckbox
      isChecked={formik.values.includeLowercase}
      onPress={(checked: boolean) => {
        formik.setFieldValue('includeLowercase', checked);
      }}
      fillColor="#ffe600"
      size={25}
      iconStyle={{ borderColor: "#ffe600" }}
      innerIconStyle={{ borderWidth: 2 }}
    />
  </View>

  {/* Numbers Toggle */}
  <View style={styles.optionRow}>
    <Text style={styles.optionText}>Numbers (0-9)</Text>
    <BouncyCheckbox
      isChecked={formik.values.includeNumbers}
      onPress={(checked: boolean) => {
        formik.setFieldValue('includeNumbers', checked);
      }}
      fillColor="#007AFF"
      size={25}
      iconStyle={{ borderColor: "#007AFF" }}
      innerIconStyle={{ borderWidth: 2 }}
    />
  </View>

  {/* Symbols Toggle */}
  <View style={styles.optionRow}>
    <Text style={styles.optionText}>Symbols (!@#$)</Text>
    <BouncyCheckbox
      isChecked={formik.values.includeSymbols}
      onPress={(checked: boolean) => {
        formik.setFieldValue('includeSymbols', checked);
      }}
      fillColor="#7300ff"
      size={25}
      iconStyle={{ borderColor: "#7300ff" }}
      innerIconStyle={{ borderWidth: 2 }}
    />
  </View>
</View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Generate Password"
              onPress={() => formik.handleSubmit()}
              color="#007AFF"
              disabled={!formik.isValid || formik.isSubmitting}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Reset"
              onPress={resetForm}  // Now this works!
              color="#FF3B30"
            />
          </View>
        </View>
      </ScrollView>

      {/* Password Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Generated Password</Text>
            
            <View style={styles.modalPasswordBox}>
              <Text style={styles.modalPasswordText}>{generatedPassword}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.copyButton]}
                onPress={copyAndClose}
              >
                <Text style={styles.modalButtonText}>Copy Password</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonWrapper: {
    marginVertical: 8,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalPasswordBox: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 25,
    width: '100%',
  },
  modalPasswordText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'monospace',
    color: '#007AFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#34C759',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optionText: {
  fontSize: 16,
  color: '#333',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}
});