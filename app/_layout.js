// app/_layout.js
import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View, Text } from 'react-native';
import { RefreshCw, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const HeaderRight = () => (
     <TouchableOpacity
          style={{
               width: 36,
               height: 36,
               borderRadius: 12,
               backgroundColor: '#1B1C1F',
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 16,
          }}
     >
          <RefreshCw size={18} color="#7DF3FF" />
     </TouchableOpacity>
);

export default function Layout() {
     const [fontsLoaded] = useFonts({
          // Add any custom fonts here if needed
     });
     const router = useRouter();

     const onLayoutRootView = useCallback(async () => {
          if (fontsLoaded) {
               await SplashScreen.hideAsync();
          }
     }, [fontsLoaded]);

     if (!fontsLoaded) return null;

     return (
          <>
               <StatusBar style="light" />
               <Stack
                    screenOptions={{
                         headerStyle: {
                              backgroundColor: '#121315',
                              borderBottomWidth: 1,
                              borderBottomColor: 'rgba(125, 243, 255, 0.1)',
                         },
                         headerTintColor: '#7DF3FF',
                         headerTitleStyle: {
                              fontWeight: '600',
                              fontSize: 18,
                         },
                         headerShadowVisible: false,
                         headerBackTitleVisible: false,
                         contentStyle: {
                              backgroundColor: '#121315',
                         },
                         animation: 'slide_from_right',
                         headerLeft: ({ canGoBack }) =>
                              canGoBack ? (
                                   <TouchableOpacity
                                        onPress={() => router.back()}
                                        style={{
                                             width: 36,
                                             height: 36,
                                             borderRadius: 12,
                                             backgroundColor: '#1B1C1F',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             marginLeft: 16,
                                        }}
                                   >
                                        <ChevronLeft size={18} color="#7DF3FF" />
                                   </TouchableOpacity>
                              ) : null,
                         headerLeftContainerStyle: {
                              paddingLeft: 0,
                         },
                         headerRightContainerStyle: {
                              paddingRight: 0,
                         },
                         headerTitleAlign: 'center',
                         headerTitle: ({ children }) => (
                              <View style={{
                                   backgroundColor: '#1B1C1F',
                                   paddingHorizontal: 16,
                                   paddingVertical: 8,
                                   borderRadius: 12,
                              }}>
                                   <Text style={{
                                        color: '#FFFFFF',
                                        fontSize: 16,
                                        fontWeight: '600',
                                   }}>
                                        {children}
                                   </Text>
                              </View>
                         ),
                    }}
               >
                    <Stack.Screen
                         name="index"
                         options={{
                              headerShown: false
                         }}
                    />
                    <Stack.Screen
                         name="atms"
                         options={{
                              title: 'ATM Network',
                              headerRight: () => <HeaderRight />,
                              headerStyle: {
                                   backgroundColor: '#121315',
                                   borderBottomWidth: 1,
                                   borderBottomColor: 'rgba(125, 243, 255, 0.1)',
                                   height: 80,
                              },
                         }}
                    />
                    <Stack.Screen
                         name="add-atm"
                         options={{
                              title: 'Register New ATM',
                              presentation: 'modal',
                              headerStyle: {
                                   backgroundColor: '#121315',
                                   borderBottomWidth: 1,
                                   borderBottomColor: 'rgba(125, 243, 255, 0.1)',
                                   height: 80,
                              },
                         }}
                    />
                    <Stack.Screen
                         name="atm/[id]"
                         options={{
                              title: 'ATM Details',
                              headerTransparent: true,
                              headerStyle: {
                                   backgroundColor: 'rgba(18, 19, 21, 0.9)',
                                   backdropFilter: 'blur(20px)',
                                   height: 80,
                              },
                         }}
                    />
                    <Stack.Screen
                         name="settings"
                         options={{
                              title: 'Settings',
                              headerStyle: {
                                   backgroundColor: '#121315',
                                   borderBottomWidth: 1,
                                   borderBottomColor: 'rgba(125, 243, 255, 0.1)',
                                   height: 80,
                              },
                         }}
                    />
               </Stack>
          </>
     );
}