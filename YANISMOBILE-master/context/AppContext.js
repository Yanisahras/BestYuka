import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {baseURL} from '../baseURL';

axios.defaults.baseURL = baseURL;

export const AppContext = createContext();

const AppContextProvider = ({children}) => {
  const [isLoged, setLoged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  return (
    <AppContext.Provider
      value={{
        isLoged,
        user,
        login: (email, password, changeLoading, loading) => {
          axios
            .post(
              '/api/sanctum/token',
              {
                email,
                password,
                device_name: 'mobile',
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
            .then(response => {
              const userResponse = {
                name: response.data.user.name,
                email: response.data.user.email,
                age: response.data.user.age,
                poids: response.data.user.poids,
                taille: response.data.user.taille,
                token: response.data.token,
              };
              setUser(userResponse);
              setLoged(true);
              AsyncStorage.setItem('user', JSON.stringify(userResponse));
              changeLoading(false);
            })
            .catch(error => {
              console.log('error', error);
              const key = Object.keys(error.response.data.errors)[0];
              setError(error.response.data.errors[key][0]);
              changeLoading(false);
            });
        },
        logout: (loading, setLoading) => {
          setLoading(true);

          axios.defaults.headers.common['Authorization'] = `Bearer ${
            user.token
          }`;
          console.log(user);
          axios
            .post('/api/logout')
            .then(response => {
              AsyncStorage.removeItem('user').then(() => {
                setUser(null);
                setLoading(false);
              });
            })
            .catch(error => {
              console.log(error);
              setLoading(false);
            });
        },
        register: (
          email,
          password,
          repeatPassword,
          name,
          poids,
          taille,
          age,
          loading,
          setLoading,
        ) => {
          axios
            .post('/api/register', {
              name,
              email,
              password,
              repeatPassword,
              age,
              poids,
              taille,
              age,
              device_name: 'mobile',
            })
            .then(response => {
              const userResponse = {
                name: response.data.user.name,
                email: response.data.user.email,
                age: response.data.user.age,
                poids: response.data.user.poids,
                taille: response.data.user.taille,
                token: response.data.token,
              };
              setUser(userResponse);
              setLoged(true);
              AsyncStorage.setItem('user', JSON.stringify(userResponse));
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
              const key = Object.keys(error.response.data.errors)[0];
              setRegisterError(error.response.data.errors[key][0]);
            });
        },
        loading,
        setLoading,
        error,
        registerError,
        setUser,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
