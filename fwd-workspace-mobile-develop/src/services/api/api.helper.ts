import AsyncStorage from '@react-native-async-storage/async-storage';
import {StoreKeys} from '@/stores';

export const getJWT = async () => {
  const authStore = await AsyncStorage.getItem(StoreKeys.AUTH_STORE);

  if (authStore) {
    const authStoreData = JSON.parse(authStore);

    if (authStoreData && authStoreData.token) {
      return authStoreData.token;
    }
  }

  return null;
};
