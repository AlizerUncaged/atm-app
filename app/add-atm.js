
// app/add-atm.js
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getApiEndpoint } from '../utils/apiConfig';

export default function AddATM() {
     const [name, setName] = useState('');
     const [loading, setLoading] = useState(false);
     const router = useRouter();




     const handleSubmit = async () => {
          if (!name.trim()) {
               Alert.alert('Error', 'Please enter ATM name');
               return;
          }

          setLoading(true);
          try {
               const baseUrl = await getApiEndpoint();
               const response = await fetch(`${baseUrl}/api/atms`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name }),
               });

               const data = await response.json();
               if (data.status === 'success') {
                    Alert.alert('Success', 'ATM created successfully', [
                         { text: 'OK', onPress: () => router.back() }
                    ]);
               } else {
                    Alert.alert('Error', data.message);
               }
          } catch (error) {
               Alert.alert('Error', 'Failed to create ATM');
          } finally {
               setLoading(false);
          }
     };






     return (
          <View style={styles.container}>
               <TextInput
                    style={styles.input}
                    placeholder="ATM Name"
                    placeholderTextColor="#666"
                    value={name}
                    onChangeText={setName}
               />
               <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
               >
                    <Text style={styles.buttonText}>
                         {loading ? 'Creating...' : 'Create ATM'}
                    </Text>
               </TouchableOpacity>
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#121315',
          paddingTop: 24, // Add padding for content
     },
     input: {
          backgroundColor: '#1B1C1F',
          color: '#FFFFFF',
          padding: 16,
          borderRadius: 12,
          fontSize: 16,
          marginBottom: 16,
     },
     button: {
          backgroundColor: '#7DF3FF',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
     },
     buttonText: {
          color: '#121315',
          fontSize: 16,
          fontWeight: '600',
     },
});