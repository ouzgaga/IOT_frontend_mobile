import AsyncStorage from '@react-native-community/async-storage';

class StorageManager {
  constructor() {
    this.TOKEN_KEY = "@TOKEN";
  }

  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(`Error while storing data: ${e}`);
    }
    console.log(`Stored ${key}`);
  }

  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(`Retrieved ${key}`);
        return value;
      }
    } catch(e) {
      console.log(`Error while storing data: ${e}`);
    }
  }

  async clearValue(key) {
    try {
      await AsyncStorage.removeItem(key)
    } catch(e) {
      console.log(`Error while removing data: ${e}`);
    }
    console.log(`Removed ${key}`);
  }

  setToken(value) {
    this.set(this.TOKEN_KEY, value);
  }

  getToken() {
    return this.get(this.TOKEN_KEY);
  }
}

const storageManager = new StorageManager();

export default storageManager;