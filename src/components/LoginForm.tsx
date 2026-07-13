import { useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

// simple password strength checker
// just checking a few basic rules and giving a score out of 5
function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) {
    return { label: '', color: '#ccc', score: 0 };
  } else if (score <= 2) {
    return { label: 'Weak', color: '#d32f2f', score };
  } else if (score <= 3) {
    return { label: 'Medium', color: '#f59e0b', score };
  } else {
    return { label: 'Strong', color: '#16a34a', score };
  }
}

const LoginForm = ({ onSwitchToSignup, onLoginSuccess }: LoginFormProps) => {
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
    try {
      setLoginError('');
     
      onLoginSuccess();
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {({ handleChange, handleBlur, handleSubmit: submitForm, handleReset, values, touched, errors, isSubmitting, isValid }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          {loginError ? <Text style={styles.alertError}>{loginError}</Text> : null}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
              placeholder="user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && errors.email ? <Text style={styles.errorMessage}>{errors.email}</Text> : null}
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
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {touched.password && errors.password ? <Text style={styles.errorMessage}>{errors.password}</Text> : null}

            {values.password.length > 0 && (
              <View style={styles.strengthBox}>
                <View style={styles.strengthBarBackground}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${(getPasswordStrength(values.password).score / 5) * 100}%`,
                        backgroundColor: getPasswordStrength(values.password).color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: getPasswordStrength(values.password).color }]}>
                  {getPasswordStrength(values.password).label}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.submitBtn, styles.submitBtnFlex, (!isValid || isSubmitting) && styles.submitBtnDisabled]}
              disabled={!isValid || isSubmitting}
              onPress={() => submitForm()}
            >
              <Text style={styles.submitBtnText}>{isSubmitting ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                handleReset();
                setLoginError('');
              }}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.authSwitch}>
            Don&apos;t have an account?{' '}
            <Text style={styles.linkButton} onPress={onSwitchToSignup}>
              Sign up here
            </Text>
          </Text>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  alertError: { color: '#d32f2f', marginBottom: 12 },
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
  authSwitch: { marginTop: 16, textAlign: 'center' },
  linkButton: { color: '#2563eb', fontWeight: '600' },

  // password strength meter styles
  strengthBox: { marginTop: 6 },
  strengthBarBackground: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: 6,
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },

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

export default LoginForm;
