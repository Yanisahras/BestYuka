import React, {useContext, useState} from 'react';
import {AppContext} from './context/AppContext';
import {
  Button,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function LoginScreen({navigation}) {
  const {login, error} = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, changeLoading] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>connexion en cours</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {error && <Text style={{color: 'red', marginBottom: 24}}>{error}</Text>}
      <TextInput
        style={{
          height: 40,
          width: 300,
          borderColor: 'gray',
          borderWidth: 1,
          padding: 8,
        }}
        onChangeText={text => setEmail(text)}
        placeholder="Email"
        textContentType="emailAddress"
        autoCapitalize="none"
      />
      <TextInput
        style={{
          height: 40,
          width: 300,
          borderColor: 'gray',
          borderWidth: 1,
          padding: 8,
          marginTop: 24,
        }}
        onChangeText={text => setPassword(text)}
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button
        title="Connexion"
        onPress={() => {
          changeLoading(true);
          login(email, password, changeLoading, loading);
        }}
      />
      <Button
        title="Inscription"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

function RegisterScreen({navigation}) {
  const {registerError, register} = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');
  const [taille, setTaille] = useState('');
  const [poids, setPoids] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Traitement en cours</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}>
        {registerError && (
          <Text style={{color: 'red', marginBottom: 24}}>{registerError}</Text>
        )}
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
          }}
          onChangeText={text => setName(text)}
          placeholder="Nom et Prenom"
          textContentType="name"
          autoCapitalize="none"
        />
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
            marginTop: 24,
          }}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
            marginTop: 24,
          }}
          onChangeText={text => setPoids(text)}
          placeholder="Poids en Kg"
          autoCapitalize="none"
        />
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
            marginTop: 24,
          }}
          onChangeText={text => setTaille(text)}
          placeholder="Taille en cm"
          autoCapitalize="none"
        />
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
            marginTop: 24,
          }}
          onChangeText={text => setAge(text)}
          placeholder="Age"
          autoCapitalize="none"
        />
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
            marginTop: 24,
          }}
          onChangeText={text => setPassword(text)}
          placeholder="Mot de passe"
          secureTextEntry={true}
        />
        <TextInput
          style={{
            height: 40,
            width: 300,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 8,
            marginTop: 24,
          }}
          onChangeText={text => setRepeatPassword(text)}
          placeholder="Répetez le Mot de passe"
          secureTextEntry={true}
        />
        <Button
          title="Confirmer"
          onPress={() => {
            setLoading(true);
            register(
              email,
              password,
              repeatPassword,
              name,
              poids,
              taille,
              age,
              loading,
              setLoading,
            );
          }}
        />
        <Button
          title="Connexion"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </ScrollView>
  );
}

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
