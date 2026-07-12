import { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name cannot exceed 50 characters'),

  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),

  phone: Yup.string()
    .required('Phone is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),

  employeeId: Yup.string()
    .required('Employee ID is required')
    .matches(/^EMP\d{4}$/, 'Format: EMP followed by 4 digits (e.g., EMP0001)'),

  roles: Yup.string()
    .required('Roles is required')
    .min(2, 'Role must be at least 2 characters'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

interface EmployeeFormValues {
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  roles: string;
  password: string;
  confirmPassword: string;
}

interface EmployeeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const initialValues: EmployeeFormValues = {
  fullName: '',
  email: '',
  phone: '',
  employeeId: '',
  roles: '',
  password: '',
  confirmPassword: '',
};

const EmployeeForm = ({ onSuccess, onCancel }: EmployeeFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values: EmployeeFormValues, { setSubmitting }: FormikHelpers<EmployeeFormValues>) => {
    console.log('Form submitted:', values);
    setSubmitting(false);
    Alert.alert('Success', 'Form submitted successfully!');
    onSuccess();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ handleChange, handleBlur, handleSubmit: submitForm, values, touched, errors, isSubmitting, isValid }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Employee Information Form</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, touched.fullName && errors.fullName ? styles.inputError : null]}
              placeholder="Zabdiel Doe"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
            />
            {touched.fullName && errors.fullName ? <Text style={styles.errorMessage}>{errors.fullName}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
              placeholder="john@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && errors.email ? <Text style={styles.errorMessage}>{errors.email}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone (10 digits)</Text>
            <TextInput
              style={[styles.input, touched.phone && errors.phone ? styles.inputError : null]}
              placeholder="5551234567"
              keyboardType="phone-pad"
              value={values.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
            />
            {touched.phone && errors.phone ? <Text style={styles.errorMessage}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              style={[styles.input, touched.employeeId && errors.employeeId ? styles.inputError : null]}
              placeholder="EMP0001"
              autoCapitalize="characters"
              value={values.employeeId}
              onChangeText={handleChange('employeeId')}
              onBlur={handleBlur('employeeId')}
            />
            {touched.employeeId && errors.employeeId ? (
              <Text style={styles.errorMessage}>{errors.employeeId}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Roles</Text>
            <TextInput
              style={[styles.input, touched.roles && errors.roles ? styles.inputError : null]}
              placeholder="e.g., Manager, waiter, chef, etc."
              value={values.roles}
              onChangeText={handleChange('roles')}
              onBlur={handleBlur('roles')}
            />
            {touched.roles && errors.roles ? <Text style={styles.errorMessage}>{errors.roles}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePassword}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
              placeholder="At least 6 characters"
              secureTextEntry={!showPassword}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {touched.password && errors.password ? <Text style={styles.errorMessage}>{errors.password}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                touched.confirmPassword && errors.confirmPassword ? styles.inputError : null,
              ]}
              placeholder="Re-enter your password"
              secureTextEntry={!showPassword}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, (!isValid || isSubmitting) && styles.submitBtnDisabled]}
            disabled={!isValid || isSubmitting}
            onPress={() => submitForm()}
          >
            <Text style={styles.submitBtnText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  formGroup: { marginBottom: 12 },
  label: { marginBottom: 4, fontWeight: '500' },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  togglePassword: { color: '#2563eb', fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  inputError: { borderColor: '#d32f2f' },
  errorMessage: { color: '#d32f2f', marginTop: 4, fontSize: 12 },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { backgroundColor: '#93c5fd' },
  submitBtnText: { color: '#fff', fontWeight: '600' },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { color: '#2563eb' },
});

export default EmployeeForm;
