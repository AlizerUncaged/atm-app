// app/atm/[id].js
import { useState, useEffect } from 'react';
import {
     View, Text, StyleSheet, Alert, TouchableOpacity,
     ScrollView, ActivityIndicator, TextInput
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
     Trash2, Power, PowerOff, RefreshCcw,
     DollarSign, AlertCircle, ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getApiEndpoint } from '../../utils/apiConfig';

export default function ATMDetails() {
     const { id } = useLocalSearchParams();
     const [atm, setAtm] = useState(null);
     const [loading, setLoading] = useState(true);
     const [isEditingCash, setIsEditingCash] = useState(false);
     const [cashValues, setCashValues] = useState({
          bill_1000_count: '',
          bill_500_count: '',
          bill_200_count: '',
          bill_100_count: ''
     });
     const router = useRouter();





     const fetchATM = async () => {
          try {
               const baseUrl = await getApiEndpoint();
               const response = await fetch(`${baseUrl}/api/atms/${id}`);
               const data = await response.json();
               if (data.status === 'success') {
                    setAtm(data.data);
                    setCashValues({
                         bill_1000_count: data.data.bill_1000_count.toString(),
                         bill_500_count: data.data.bill_500_count.toString(),
                         bill_200_count: data.data.bill_200_count.toString(),
                         bill_100_count: data.data.bill_100_count.toString(),
                    });
               }
          } catch (error) {
               Alert.alert('Error', 'Failed to fetch ATM details');
          } finally {
               setLoading(false);
          }
     };





     useEffect(() => {
          fetchATM();
     }, [id]);


     const handleDelete = async () => {
          Alert.alert(
               'Delete ATM',
               'Are you sure you want to delete this ATM? This action cannot be undone.',
               [
                    { text: 'Cancel', style: 'cancel' },
                    {
                         text: 'Delete',
                         style: 'destructive',
                         onPress: async () => {
                              try {
                                   const baseUrl = await getApiEndpoint();
                                   const response = await fetch(`${baseUrl}/api/atms/${id}`, {
                                        method: 'DELETE',
                                   });
                                   const data = await response.json();
                                   if (data.status === 'success') {
                                        Alert.alert('Success', 'ATM deleted successfully', [
                                             { text: 'OK', onPress: () => router.push('/atms') }
                                        ]);
                                   } else {
                                        Alert.alert('Error', data.message);
                                   }
                              } catch (error) {
                                   Alert.alert('Error', 'Failed to delete ATM');
                              }
                         }
                    }
               ]
          );
     };




     const toggleStatus = async () => {
          try {
               const newStatus = atm.status === 1 ? 0 : 1;
               const response = await fetch(`http://127.0.0.1:3000/api/atms/${id}/status`, {
                    method: 'PATCH',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
               });
               const data = await response.json();
               if (data.status === 'success') {
                    setAtm(data.data);
               } else {
                    Alert.alert('Error', data.message);
               }
          } catch (error) {
               Alert.alert('Error', 'Failed to update ATM status');
          }
     };

     const updateCash = async () => {
          try {
               const response = await fetch(`http://127.0.0.1:3000/api/atms/${id}/cash`, {
                    method: 'PATCH',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         bill_1000_count: parseInt(cashValues.bill_1000_count),
                         bill_500_count: parseInt(cashValues.bill_500_count),
                         bill_200_count: parseInt(cashValues.bill_200_count),
                         bill_100_count: parseInt(cashValues.bill_100_count),
                    }),
               });
               const data = await response.json();
               if (data.status === 'success') {
                    setAtm(data.data);
                    setIsEditingCash(false);
               } else {
                    Alert.alert('Error', data.message);
               }
          } catch (error) {
               Alert.alert('Error', 'Failed to update cash values');
          }
     };

     if (loading) {
          return (
               <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#7DF3FF" />
               </View>
          );
     }

     if (!atm) {
          return (
               <View style={styles.centered}>
                    <Text style={styles.errorText}>ATM not found</Text>
               </View>
          );
     }

     const totalCash =
          (atm.bill_1000_count * 1000) +
          (atm.bill_500_count * 500) +
          (atm.bill_200_count * 200) +
          (atm.bill_100_count * 100);

     return (
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
               <LinearGradient
                    colors={['rgba(125, 243, 255, 0.2)', 'transparent']}
                    style={styles.headerGradient}
               >
                    <View style={styles.header}>
                         <View>
                              <Text style={styles.title}>{atm.name}</Text>
                              <Text style={styles.subtitle}>ATM #{id}</Text>
                         </View>
                         <TouchableOpacity
                              style={[styles.statusButton, { backgroundColor: atm.status === 1 ? '#7DFFA4' : '#FF8D7D' }]}
                              onPress={toggleStatus}
                         >
                              {atm.status === 1 ? (
                                   <Power size={20} color="#121315" />
                              ) : (
                                   <PowerOff size={20} color="#121315" />
                              )}
                         </TouchableOpacity>
                    </View>

                    <View style={styles.statsGrid}>
                         <View style={styles.statsCard}>
                              <Text style={styles.statsLabel}>Total Cash</Text>
                              <Text style={styles.statsValue}>₱{totalCash.toLocaleString()}</Text>
                              <DollarSign size={20} color="#7DF3FF" style={styles.statsIcon} />
                         </View>
                         <View style={styles.statsCard}>
                              <Text style={styles.statsLabel}>Status</Text>
                              <Text style={[styles.statsValue, { color: atm.status === 1 ? '#7DFFA4' : '#FF8D7D' }]}>
                                   {atm.status === 1 ? 'Active' : 'Inactive'}
                              </Text>
                              <AlertCircle size={20} color={atm.status === 1 ? '#7DFFA4' : '#FF8D7D'} style={styles.statsIcon} />
                         </View>
                    </View>
               </LinearGradient>

               <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                         <Text style={styles.sectionTitle}>Cash Management</Text>
                         <TouchableOpacity
                              style={styles.editButton}
                              onPress={() => setIsEditingCash(!isEditingCash)}
                         >
                              <RefreshCcw size={20} color="#7DF3FF" />
                         </TouchableOpacity>
                    </View>

                    <View style={styles.billsGrid}>
                         {[
                              { label: '₱1000', key: 'bill_1000_count' },
                              { label: '₱500', key: 'bill_500_count' },
                              { label: '₱200', key: 'bill_200_count' },
                              { label: '₱100', key: 'bill_100_count' },
                         ].map((bill) => (
                              <View key={bill.key} style={styles.billCard}>
                                   <Text style={styles.billLabel}>{bill.label}</Text>
                                   {isEditingCash ? (
                                        <TextInput
                                             style={styles.billInput}
                                             value={cashValues[bill.key]}
                                             onChangeText={(text) => setCashValues(prev => ({ ...prev, [bill.key]: text }))}
                                             keyboardType="number-pad"
                                             placeholder="0"
                                             placeholderTextColor="#666"
                                        />
                                   ) : (
                                        <Text style={styles.billValue}>
                                             {atm[bill.key].toLocaleString()} bills
                                        </Text>
                                   )}
                                   <Text style={styles.billSubtitle}>
                                        ₱{(parseInt(atm[bill.key]) * parseInt(bill.label.slice(1))).toLocaleString()}
                                   </Text>
                              </View>
                         ))}
                    </View>

                    {isEditingCash && (
                         <TouchableOpacity style={styles.updateButton} onPress={updateCash}>
                              <Text style={styles.updateButtonText}>Update Cash Values</Text>
                         </TouchableOpacity>
                    )}
               </View>

               <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Trash2 size={20} color="#FF8D7D" />
                    <Text style={styles.deleteButtonText}>Delete ATM</Text>
               </TouchableOpacity>
          </ScrollView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#121315',
     },
     contentContainer: {
          paddingBottom: 24,
     },
     headerGradient: {
          padding: 24,
          paddingTop: 100, // Increased to account for header height
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
     },
     title: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 4,
     },
     subtitle: {
          fontSize: 14,
          color: '#666',
     },
     statusButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
     },
     statsGrid: {
          flexDirection: 'row',
          gap: 16,
     },
     statsCard: {
          flex: 1,
          backgroundColor: '#1B1C1F',
          borderRadius: 16,
          padding: 16,
          position: 'relative',
     },
     statsLabel: {
          fontSize: 14,
          color: '#666',
          marginBottom: 8,
     },
     statsValue: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#FFFFFF',
     },
     statsIcon: {
          position: 'absolute',
          right: 12,
          top: 12,
     },
     section: {
          padding: 24,
     },
     sectionHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#FFFFFF',
     },
     editButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#1B1C1F',
          alignItems: 'center',
          justifyContent: 'center',
     },
     billsGrid: {
          gap: 16,
     },
     billCard: {
          backgroundColor: '#1B1C1F',
          borderRadius: 16,
          padding: 16,
     },
     billLabel: {
          fontSize: 14,
          color: '#666',
          marginBottom: 8,
     },
     billValue: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 4,
     },
     billSubtitle: {
          fontSize: 14,
          color: '#7DF3FF',
     },
     billInput: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#FFFFFF',
          backgroundColor: '#121315',
          borderRadius: 8,
          padding: 8,
          marginBottom: 4,
     },
     updateButton: {
          backgroundColor: '#7DF3FF',
          borderRadius: 12,
          padding: 16,
          alignItems: 'center',
          marginTop: 16,
     },
     updateButtonText: {
          color: '#121315',
          fontSize: 16,
          fontWeight: '600',
     },
     deleteButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 16,
          marginHorizontal: 24,
          backgroundColor: '#1B1C1F',
          borderRadius: 12,
     },
     deleteButtonText: {
          color: '#FF8D7D',
          fontSize: 16,
          fontWeight: '600',
     },
});