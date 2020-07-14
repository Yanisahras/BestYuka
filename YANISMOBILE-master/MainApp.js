import React, {useState, useContext, useEffect} from 'react';
import {AppContext} from './context/AppContext';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './App';
import AuthStack from './AuthStack';
import AsyncStorage from '@react-native-community/async-storage';

const MainApp = () => {
  const {user, login, setUser} = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem('user').then(userString => {
      if (userString) {
        setUser(JSON.parse(userString));
      }
      setLoading(false);
    }, []);
  });
  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainApp;
