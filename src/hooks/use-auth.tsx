import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
 
const AUTH_TOKEN_KEY = 'authToken';
const USERS_KEY = 'users';
 
export interface Employee {
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  roles: string;
}
 
interface StoredUser extends Employee {
  passwordHash: string;
}
 
export interface SignupInput extends Employee {
  password: string;
}
 
interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  currentUser: Employee | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}
 
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
 
async function hashPassword(password: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}
 
async function getUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}
 
function toEmployee({ passwordHash: _passwordHash, ...employee }: StoredUser): Employee {
  return employee;
}
 
export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
 
  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (email) {
          const users = await getUsers();
          const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (user) {
            setCurrentUser(toEmployee(user));
            setIsLoggedIn(true);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
 
  const signup = async (input: SignupInput) => {
    const users = await getUsers();
    const email = input.email.toLowerCase();
 
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error('An account with this email already exists');
    }
    if (users.some((u) => u.employeeId.toUpperCase() === input.employeeId.toUpperCase())) {
      throw new Error('An account with this employee ID already exists');
    }
 
    const passwordHash = await hashPassword(input.password);
    const { password: _password, ...employee } = input;
    const newUser: StoredUser = { ...employee, passwordHash };
 
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  };
 
  const login = async (email: string, password: string) => {
    const users = await getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const passwordHash = await hashPassword(password);
 
    if (!user || user.passwordHash !== passwordHash) {
      throw new Error('Invalid email or password');
    }
 
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, user.email);
    setCurrentUser(toEmployee(user));
    setIsLoggedIn(true);
  };
 
  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    setCurrentUser(null);
    setIsLoggedIn(false);
  };
 
  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
