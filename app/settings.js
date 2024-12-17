// app/settings.js
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { getApiEndpoint, setApiEndpoint } from '../utils/apiConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
     const [apiEndpoint, setApiEndpointState] = useState('');
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          loadApiEndpoint();
     }, []);

     const loadApiEndpoint = async () => {
          const endpoint = await getApiEndpoint();
          setApiEndpointState(endpoint);
     };

     const handleSave = async () => {
          if (!apiEndpoint.trim()) {
               Alert.alert('Error', 'Please enter API endpoint');
               return;
          }

          setLoading(true);
          try {
               const success = await setApiEndpoint(apiEndpoint.trim());
               if (success) {
                    Alert.alert('Success', 'API endpoint saved successfully');
               } else {
                    throw new Error('Failed to save');
               }
          } catch (error) {
               Alert.alert('Error', 'Failed to save API endpoint');
          } finally {
               setLoading(false);
          }
     };

     return (
          <SafeAreaView style={styles.container}>
               <View style={styles.content}>
                    <View style={styles.infoCard}>
                         <Text style={styles.infoText}>
                              Configure the API endpoint for your ATM management system.
                              Example: http://127.0.0.1:3000 or https://api.example.com
                         </Text>
                    </View>

                    <View style={styles.inputContainer}>
                         <Text style={styles.label}>API Endpoint</Text>
                         <TextInput
                              style={styles.input}
                              placeholder="Enter API endpoint"
                              placeholderTextColor="#666"
                              value={apiEndpoint}
                              onChangeText={setApiEndpointState}
                              autoCapitalize="none"
                              autoCorrect={false}
                         />
                    </View>

                    <TouchableOpacity
                         style={styles.saveButton}
                         onPress={handleSave}
                         disabled={loading}
                    >
                         <Text style={styles.saveButtonText}>
                              {loading ? 'Saving...' : 'Save Settings'}
                         </Text>
                    </TouchableOpacity>
               </View>
          </SafeAreaView>
     );
}


const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#121315',
     },
     content: {
          padding: 20,
          gap: 24,
     },
     infoCard: {
          backgroundColor: 'rgba(125, 243, 255, 0.1)',
          borderRadius: 16,
          padding: 16,
     },
     infoText: {
          color: '#FFFFFF',
          fontSize: 14,
          lineHeight: 20,
          opacity: 0.8,
     },
     inputContainer: {
          gap: 8,
     },
     label: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '600',
     },
     input: {
          backgroundColor: '#1B1C1F',
          borderRadius: 12,
          padding: 16,
          color: '#FFFFFF',
          fontSize: 16,
     },
     saveButton: {
          backgroundColor: '#7DF3FF',
          borderRadius: 12,
          padding: 16,
          alignItems: 'center',
     },
     saveButtonText: {
          color: '#121315',
          fontSize: 16,
          fontWeight: '600',
     },
});