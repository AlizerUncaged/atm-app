// utils/apiConfig.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApiEndpoint = async () => {
     try {
          const endpoint = await AsyncStorage.getItem('apiEndpoint');
          return endpoint || 'http://127.0.0.1:3000'; // Default fallback
     } catch (error) {
          console.error('Failed to get API endpoint:', error);
          return 'http://127.0.0.1:3000'; // Default fallback
     }
};

export const setApiEndpoint = async (endpoint) => {
     try {
          await AsyncStorage.setItem('apiEndpoint', endpoint);
          return true;
     } catch (error) {
          console.error('Failed to save API endpoint:', error);
          return false;
     }
};