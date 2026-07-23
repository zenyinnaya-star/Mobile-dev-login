import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Employee {
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  roles: string;
}

export interface SignupInput extends Employee {
  password: string;
}

interface SignupResult {
  needsEmailConfirmation: boolean;
}

export type ProfileUpdateInput = Partial<Pick<Employee, 'fullName' | 'phone' | 'roles'>>;

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  currentUser: Employee | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: SignupInput) => Promise<SignupResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdateInput) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toEmployee(row: {
  full_name: string;
  email: string;
  phone: string;
  employee_id: string;
  roles: string;
}): Employee {
  return {
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    employeeId: row.employee_id,
    roles: row.roles,
  };
}

async function loadEmployee(userId: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select('full_name, email, phone, employee_id, roles')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return toEmployee(data);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const applySession = async (session: Session | null) => {
      setIsLoggedIn(!!session?.user);
      setUserId(session?.user?.id ?? null);
      if (session?.user) {
        setCurrentUser(await loadEmployee(session.user.id));
      } else {
        setCurrentUser(null);
      }
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await applySession(session);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        applySession(session);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signup = async (input: SignupInput): Promise<SignupResult> => {
    const { password, email, fullName, phone, employeeId, roles } = input;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          employee_id: employeeId,
          roles,
        },
      },
    });

    if (error) {
      if (/employees_employee_id_key/i.test(error.message)) {
        throw new Error('An account with this employee ID already exists');
      }
      throw new Error(error.message);
    }

    return { needsEmailConfirmation: !data.session };
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: ProfileUpdateInput) => {
    if (!userId) {
      throw new Error('Not signed in');
    }

    const { error } = await supabase
      .from('employees')
      .update({
        ...(updates.fullName !== undefined && { full_name: updates.fullName }),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.roles !== undefined && { roles: updates.roles }),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const deleteAccount = async () => {
    if (!userId) {
      throw new Error('Not signed in');
    }

    const { error } = await supabase.from('employees').delete().eq('id', userId);
    if (error) {
      throw new Error(error.message);
    }

    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, currentUser, login, signup, logout, updateProfile, deleteAccount }}
    >
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
