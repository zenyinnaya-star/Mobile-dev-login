import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';

export default function Profile() {
    const { isLoading, currentUser, updateProfile, deleteAccount } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [roles, setRoles] = useState('');

    const startEditing = () => {
        if (!currentUser) return;
        setFullName(currentUser.fullName);
        setPhone(currentUser.phone);
        setRoles(currentUser.roles);
        setSaveError('');
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setSaveError('');
    };

    const confirmSave = async () => {
        if (!fullName.trim() || !phone.trim() || !roles.trim()) {
            setSaveError('All fields are required');
            return;
        }

        try {
            setIsSaving(true);
            setSaveError('');
            await updateProfile({ fullName: fullName.trim(), phone: phone.trim(), roles: roles.trim() });
            setIsEditing(false);
        } catch (err: any) {
            setSaveError(err?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete account',
            'This will permanently delete your profile record and sign you out. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await deleteAccount();
                            router.replace('/auth/login');
                        } catch (err: any) {
                            Alert.alert('Error', err?.message || 'Failed to delete account');
                        } finally {
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerCard}>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.name}>{currentUser?.fullName}</Text>
                <Text style={styles.role}>{currentUser?.roles}</Text>
            </View>

            {isLoading ? (
                <Text style={styles.message}>Loading profile...</Text>
            ) : !currentUser ? (
                <Text style={styles.message}>No signed in user found.</Text>
            ) : isEditing ? (
                <View style={styles.card}>
                    {saveError ? <Text style={styles.errorMessage}>{saveError}</Text> : null}

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

                    <Text style={styles.label}>Phone</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    <Text style={styles.label}>Roles</Text>
                    <TextInput style={styles.input} value={roles} onChangeText={setRoles} />

                    <Text style={styles.label}>Employee ID</Text>
                    <Text style={styles.value}>{currentUser.employeeId}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{currentUser.email}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.saveBtn, isSaving && styles.btnDisabled]}
                            onPress={confirmSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Confirm</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn} onPress={cancelEditing} disabled={isSaving}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.label}>Employee ID</Text>
                    <Text style={styles.value}>{currentUser.employeeId}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{currentUser.email}</Text>

                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{currentUser.phone}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.editBtn} onPress={startEditing}>
                            <Text style={styles.editBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.deleteBtn, isDeleting && styles.btnDisabled]}
                            onPress={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.deleteBtnText}>Delete</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f7fb',
    },
    headerCard: {
        backgroundColor: '#2563eb',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    name: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '700',
    },
    role: {
        color: '#dbeafe',
        fontSize: 14,
        marginTop: 4,
    },
    message: {
        color: '#6b7280',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    label: {
        color: '#6b7280',
        fontSize: 13,
        marginBottom: 4,
    },
    value: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        color: '#111827',
        marginBottom: 12,
    },
    errorMessage: {
        color: '#d32f2f',
        marginBottom: 12,
        fontSize: 13,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    editBtn: {
        flex: 1,
        backgroundColor: '#2563eb',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
    },
    editBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#dc2626',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
    },
    deleteBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    saveBtn: {
        flex: 1,
        backgroundColor: '#16a34a',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#6b7280',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#374151',
        fontWeight: '600',
    },
    btnDisabled: {
        opacity: 0.6,
    },
})
