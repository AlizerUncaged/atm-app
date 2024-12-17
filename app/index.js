// app/index.js
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Plus, CreditCard, BarChart3, AlertCircle, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '../utils/apiConfig';

export default function Home() {
     const router = useRouter();
     const [stats, setStats] = useState({
          activeCount: 0,
          totalCash: 0,
          loading: true
     });




     const fetchStats = async () => {
          try {
               const baseUrl = await getApiEndpoint();
               const response = await fetch(`${baseUrl}/api/atms`);
               const data = await response.json();
               if (data.status === 'success') {
                    const activeAtms = data.data.filter(atm => atm.status === 1).length;
                    const totalCash = data.data.reduce((sum, atm) => {
                         return sum +
                              (atm.bill_1000_count * 1000) +
                              (atm.bill_500_count * 500) +
                              (atm.bill_200_count * 200) +
                              (atm.bill_100_count * 100);
                    }, 0);

                    setStats({
                         activeCount: activeAtms,
                         totalCash: totalCash,
                         loading: false
                    });
               }
          } catch (error) {
               console.error(error);
               setStats(prev => ({ ...prev, loading: false }));
          }
     };








     useEffect(() => {
          fetchStats();
     }, []);

     const MenuButton = ({ icon: Icon, title, subtitle, onPress, colors }) => (
          <TouchableOpacity
               style={styles.menuButton}
               onPress={onPress}
          >
               <LinearGradient
                    colors={colors}
                    style={styles.gradientBg}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
               >
                    <View style={styles.iconContainer}>
                         <Icon size={24} color="#121315" strokeWidth={2} />
                    </View>
                    <View style={styles.menuTextContainer}>
                         <Text style={styles.menuButtonTitle}>{title}</Text>
                         <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>
                    </View>
               </LinearGradient>
          </TouchableOpacity>
     );

     return (
          <SafeAreaView style={styles.container}>
               <View style={styles.header}>
                    <View>
                         <Text style={styles.welcomeText}>Welcome Back 👋</Text>
                         <Text style={styles.headerTitle}>ATM Management</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                         <AlertCircle size={22} color="#7DF3FF" />
                    </TouchableOpacity>
               </View>

               <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.infoCard}>
                         <AlertCircle size={20} color="#7DF3FF" style={{ opacity: 0.8 }} />
                         <Text style={styles.infoText}>
                              Monitor your ATM network, manage cash inventory, and maintain operational status all in one place.
                         </Text>
                    </View>

                    <View style={styles.statsContainer}>
                         <View style={styles.statsCard}>
                              <Text style={styles.statsLabel}>Active ATMs</Text>
                              {stats.loading ? (
                                   <ActivityIndicator size="small" color="#7DF3FF" />
                              ) : (
                                   <Text style={styles.statsValue}>{stats.activeCount}</Text>
                              )}
                              <BarChart3 size={20} color="#7DF3FF" style={styles.statsIcon} />
                         </View>
                         <View style={styles.statsCard}>
                              <Text style={styles.statsLabel}>Total Cash</Text>
                              {stats.loading ? (
                                   <ActivityIndicator size="small" color="#7DFFA4" />
                              ) : (
                                   <Text style={styles.statsValue}>₱{(stats.totalCash / 1000000).toFixed(1)}M</Text>
                              )}
                              <CreditCard size={20} color="#7DFFA4" style={styles.statsIcon} />
                         </View>
                    </View>
                    <View>
                         <Text style={styles.sectionTitle}>Quick Actions</Text>
                         <Text style={styles.sectionSubtitle}>Access frequently used features</Text>
                    </View>

                    <View style={styles.menuGrid}>
                         <MenuButton
                              icon={Activity}
                              title="ATM Network"
                              subtitle="Monitor machines"
                              colors={['rgba(125, 243, 255, 0.9)', 'rgba(125, 196, 255, 0.9)']}
                              onPress={() => router.push('/atms')}
                         />

                         <MenuButton
                              icon={Plus}
                              title="Register ATM"
                              subtitle="Add new machine"
                              colors={['rgba(125, 255, 164, 0.9)', 'rgba(125, 255, 141, 0.9)']}
                              onPress={() => router.push('/add-atm')}
                         />

                         <MenuButton
                              icon={CreditCard}
                              title="Cash Management"
                              subtitle="Update inventory"
                              colors={['rgba(255, 249, 125, 0.9)', 'rgba(255, 217, 125, 0.9)']}
                              onPress={() => router.push('/atms')}
                         />
                         <MenuButton
                              icon={Settings}
                              title="Settings"
                              subtitle="Configure API"
                              colors={['rgba(177, 125, 255, 0.9)', 'rgba(155, 125, 255, 0.9)']}
                              onPress={() => router.push('/settings')}
                         />
                    </View>
               </ScrollView>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#121315',
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 16,
     },
     welcomeText: {
          fontSize: 14,
          color: '#666',
          marginBottom: 4,
     },
     headerTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
     },
     profileButton: {
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: '#1B1C1F',
          alignItems: 'center',
          justifyContent: 'center',
     },
     scrollContainer: {
          padding: 20,
          gap: 24,
     },
     infoCard: {
          backgroundColor: 'rgba(125, 243, 255, 0.1)',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
     },
     infoText: {
          flex: 1,
          color: '#FFFFFF',
          fontSize: 13,
          lineHeight: 18,
          opacity: 0.8,
     },
     statsContainer: {
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
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
     },
     statsIcon: {
          position: 'absolute',
          right: 12,
          top: 12,
          opacity: 0.5,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: 4,
     },
     sectionSubtitle: {
          fontSize: 13,
          color: '#666',
          marginBottom: 16,
     },
     menuGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
     },
     menuButton: {
          width: '48%',
          aspectRatio: 1,
          borderRadius: 16,
          overflow: 'hidden',
     },
     gradientBg: {
          flex: 1,
          padding: 16,
          justifyContent: 'space-between',
     },
     iconContainer: {
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          alignItems: 'center',
          justifyContent: 'center',
     },
     menuTextContainer: {
          gap: 4,
     },
     menuButtonTitle: {
          color: '#121315',
          fontSize: 16,
          fontWeight: '600',
     },
     menuButtonSubtitle: {
          color: 'rgba(18, 19, 21, 0.7)',
          fontSize: 13,
     },
});