import { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/hooks/use-auth';

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
  const { signup } = useAuth();
  const [signupError, setSignupError] = useState('');
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const handleSubmit = async (
    values: EmployeeFormValues,
    { setSubmitting }: FormikHelpers<EmployeeFormValues>
  ) => {
    try {
      setSignupError('');
      const { confirmPassword: _confirmPassword, ...signupInput } = values;
      const { needsEmailConfirmation: needsConfirmation } = await signup(signupInput);
      if (needsConfirmation) {
        setNeedsEmailConfirmation(true);
      } else {
        Alert.alert('Success', 'Account created successfully!');
        onSuccess();
      }
    } catch (err: any) {
      setSignupError(err?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (needsEmailConfirmation) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.confirmText}>
          We sent you a confirmation link. Verify your email before logging in.
        </Text>
        <TouchableOpacity style={styles.submitBtn} onPress={onSuccess}>
          <Text style={styles.submitBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ handleChange, handleBlur, handleSubmit: submitForm, handleReset, values, touched, errors, isSubmitting, isValid }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Employee Information Form</Text>

          {signupError ? <Text style={styles.alertError}>{signupError}</Text> : null}

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
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
              placeholder="At least 6 characters"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {touched.password && errors.password ? <Text style={styles.errorMessage}>{errors.password}</Text> : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
              placeholder="Re-enter your password"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.submitBtn, styles.submitBtnFlex, (!isValid || isSubmitting) && styles.submitBtnDisabled]}
              disabled={!isValid || isSubmitting}
              onPress={() => submitForm()}
            >
              <Text style={styles.submitBtnText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={() => handleReset()}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>

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
  alertError: { color: '#d32f2f', marginBottom: 12 },
  confirmText: { marginBottom: 20, color: '#374151', lineHeight: 20 },
  formGroup: { marginBottom: 12 },
  label: { marginBottom: 4, fontWeight: '500' },
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

  // reset button + row layout
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  submitBtnFlex: {
    flex: 1,
    marginTop: 0,
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { color: '#2563eb', fontWeight: '600' },
});

export default EmployeeForm;
