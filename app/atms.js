// app/atms.js
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { getApiEndpoint } from '../utils/apiConfig';
export default function ATMsList() {
     const [atms, setAtms] = useState([]);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);
     const [error, setError] = useState(null);
     const router = useRouter();

     const fetchATMs = async () => {
          try {
               const baseUrl = await getApiEndpoint();
               const response = await fetch(`${baseUrl}/api/atms`);
               const data = await response.json();
               if (data.status === 'success') {
                    setAtms(data.data);
                    setError(null);
               } else {
                    setError(data.message);
               }
          } catch (err) {
               setError('Failed to fetch ATMs');
          } finally {
               setLoading(false);
               setRefreshing(false);
          }
     };


     // Refresh when screen comes into focus
     useFocusEffect(
          useCallback(() => {
               fetchATMs();
          }, [])
     );

     const onRefresh = () => {
          setRefreshing(true);
          fetchATMs();
     };

     const getStatusColor = (status) => {
          return status === 1 ? '#7DFFA4' : '#FF8D7D';
     };

     const renderHeader = () => (
          <View style={styles.headerContainer}>
               <View style={styles.statsContainer}>
                    <View style={styles.statsCard}>
                         <Text style={styles.statsLabel}>Total ATMs</Text>
                         <Text style={styles.statsValue}>{atms.length}</Text>
                    </View>
                    <View style={styles.statsCard}>
                         <Text style={styles.statsLabel}>Active</Text>
                         <Text style={[styles.statsValue, { color: '#7DFFA4' }]}>
                              {atms.filter(atm => atm.status === 1).length}
                         </Text>
                    </View>
                    <View style={styles.statsCard}>
                         <Text style={styles.statsLabel}>Inactive</Text>
                         <Text style={[styles.statsValue, { color: '#FF8D7D' }]}>
                              {atms.filter(atm => atm.status === 0).length}
                         </Text>
                    </View>
               </View>

               <View style={styles.infoCard}>
                    <AlertCircle size={20} color="#7DF3FF" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                         Tap on any ATM to view details or manage its status and cash inventory.
                         Pull down to refresh the list.
                    </Text>
               </View>
          </View>
     );

     const renderItem = ({ item }) => (
          <TouchableOpacity
               style={styles.atmCard}
               onPress={() => router.push(`/atm/${item.id}`)}
          >
               <View style={styles.atmInfo}>
                    <View>
                         <Text style={styles.atmName}>{item.name}</Text>
                         <Text style={styles.atmSubtitle}>
                              Total Cash: ₱{((item.bill_1000_count * 1000) +
                                   (item.bill_500_count * 500) +
                                   (item.bill_200_count * 200) +
                                   (item.bill_100_count * 100)).toLocaleString()}
                         </Text>
                    </View>
                    <View style={styles.rightContainer}>
                         <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                         <ChevronRight size={20} color="#666" />
                    </View>
               </View>
          </TouchableOpacity>
     );

     if (loading && !refreshing) {
          return (
               <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#7DF3FF" />
               </View>
          );
     }

     return (
          <View style={styles.container}>
               <FlatList
                    data={atms}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={renderHeader}
                    refreshControl={
                         <RefreshControl
                              refreshing={refreshing}
                              onRefresh={onRefresh}
                              tintColor="#7DF3FF"
                              colors={["#7DF3FF"]}
                         />
                    }
                    ListEmptyComponent={
                         <View style={styles.emptyContainer}>
                              <Text style={styles.emptyText}>No ATMs found</Text>
                              <Text style={styles.emptySubtext}>Pull down to refresh</Text>
                         </View>
                    }
               />
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#121315',
     },
     headerContainer: {
          padding: 16,
          gap: 16,
     },
     statsContainer: {
          flexDirection: 'row',
          gap: 8,
     },
     statsCard: {
          flex: 1,
          backgroundColor: '#1B1C1F',
          borderRadius: 12,
          padding: 12,
     },
     statsLabel: {
          fontSize: 12,
          color: '#666',
          marginBottom: 4,
     },
     statsValue: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#FFFFFF',
     },
     infoCard: {
          backgroundColor: 'rgba(125, 243, 255, 0.1)',
          borderRadius: 12,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
     },
     infoIcon: {
          opacity: 0.7,
     },
     infoText: {
          flex: 1,
          color: '#FFFFFF',
          fontSize: 13,
          lineHeight: 18,
          opacity: 0.8,
     },
     list: {
          paddingBottom: 16,
     },
     atmCard: {
          backgroundColor: '#1B1C1F',
          marginHorizontal: 16,
          marginTop: 8,
          borderRadius: 12,
          overflow: 'hidden',
     },
     atmInfo: {
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
     },
     atmName: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 4,
     },
     atmSubtitle: {
          color: '#666',
          fontSize: 13,
     },
     rightContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
     },
     statusDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
     },
     centered: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
     emptyContainer: {
          flex: 1,
          alignItems: 'center',
          paddingTop: 32,
     },
     emptyText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 4,
     },
     emptySubtext: {
          color: '#666',
          fontSize: 14,
     },
});