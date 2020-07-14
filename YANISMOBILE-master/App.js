import React, {PureComponent, useContext, useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Axios from 'axios';
import CameraModule from './components/CameraModule';
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Body,
  View,
  ListItem,
  Left,
  Right,
  Radio,
  List,
  Image,
} from 'native-base';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AppContextProvider, {AppContext} from './context/AppContext';
import AsyncStorage from '@react-native-community/async-storage';
import {baseURL} from './baseURL';
import Historique from './components/Historique';

Axios.defaults.baseURL = baseURL;

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: () => null,
        }}
      />

      <Stack.Screen
        name="Historique"
        component={Historique}
        options={{
          header: () => null,
        }}
      />

      <Stack.Screen
        name="Camera"
        component={CameraModule}
        options={{
          header: () => null,
        }}
      />

      <Stack.Screen
        name="Reciep"
        component={Reciep}
        options={{
          header: () => null,
        }}
      />

      <Stack.Screen
        name="Stats"
        component={Stats}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="RealStats"
        component={RealStats}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
  // return <CameraModule />;
};

export default App;

const Home = ({navigation}) => {
  const {user, logout} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>déconnexion en cours</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View
      style={{justifyContent: 'space-around', alignItems: 'center', flex: 1}}>
      <Text>coucou {user.name} </Text>
      <Button onPress={() => navigation.navigate('Camera')}>
        <Text>Commancer</Text>
      </Button>

      <Button onPress={() => navigation.navigate('Historique')}>
        <Text>historique</Text>
      </Button>

      <Button
        onPress={() => {
          setLoading(true);
          logout(loading, setLoading);
        }}>
        <Text>Log Out</Text>
      </Button>
    </View>
  );
};

const Reciep = ({navigation}) => {
  return (
    <Container>
      <Header style={styles.customheader}>
        <Text style={{color: 'white', fontSize: 22}}>Recette</Text>
      </Header>
      <Content>
        <ListItem style={{flex: 1}}>
          <Left>
            <Text>ingérdient 1</Text>
          </Left>
          <Right>
            <Text>200 g</Text>
          </Right>
        </ListItem>
        <ListItem>
          <Left>
            <Text>ingrédient 2</Text>
          </Left>
          <Right>
            <Text>300 cl</Text>
          </Right>
        </ListItem>

        <Text>
          Préchauffer votre four à 250°C (fonction rôtisserie) Préparation des
          légumes Laver le citron et râper les zeste. Réservez le. Avec un
          presse agrume, récupérer le jus du citron. Éplucher les gousses d'ail.
          Peler et couper en cube les pommes Dans un bol, mélanger le jus de
          citron et l'ail écrasé. Dans un récipient, mélanger: les pommes, le
          zeste de citron et la coriandre hachée. Préparation de la viande
          Enduire le poulet du mélange "jus de citron -ail" à l'intérieur et à
          l'extérieur. Puis enveloppez le poulet dans un papier aluminium et
          laissez poser pendant 30 minutes. Puis farcir le poulet de la
          préparation à base de pommes, bridez le poulet. Et faites le rôtir
          pendant 35-40 minutes. Présentation A proposer avec une salade et des
          frites.
        </Text>
        <Button
          block
          style={{alignContent: 'flex-end'}}
          onPress={() => navigation.goBack()}>
          <Text>Prendre un autre repas</Text>
        </Button>
      </Content>
    </Container>
  );
};

const Stats = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [fail, setFail] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const {user} = useContext(AppContext);
  const changePAS = true;
  Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
  useEffect(() => {
    console.log('axios post');
    Axios.post('/api/getResults', {
      image: route.params.imageb64,
    })
      .then(response => {
        console.log(response.data.data);
        setResponseData(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.log('error', error);
        setFail(true);
        setLoading(false);
      });
  }, [changePAS]);

  const {imageb64} = route.params;

  if (loading) {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Traitement de l'image en cours</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (fail) {
    return (
      <Container>
        <Content>
          <Text>Sad Reacts only xd</Text>
          <Button
            block
            style={{alignContent: 'flex-end'}}
            onPress={() => navigation.goBack()}>
            <Text>Prendre un autre repas</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header style={styles.customheader}>
          <Text style={{color: 'white', fontSize: 22}}>Choose something</Text>
        </Header>
        {responseData.map(repas => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RealStats', {
                  repas,
                });
              }}>
              <View>
                <Text> {repas.name} </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <Button
          block
          style={{alignContent: 'flex-end'}}
          onPress={() => navigation.goBack()}>
          <Text>Prendre un autre repas</Text>
        </Button>
      </Content>
    </Container>
  );
};

const RealStats = ({navigation, route}) => {
  const {repas} = route.params;
  return (
    <Container>
      <Content>
        <Header style={styles.customheader}>
          <Text style={{color: 'white', fontSize: 22}}>
            Valeur Nutritionelle par 100gr
          </Text>
        </Header>
        <Text style={{color: 'black', fontSize: 22}}>{repas.name}</Text>
        <ListItem>
          <Left>
            <Text>Protéines</Text>
          </Left>
          <Right>
            <Text>{repas.prots} g</Text>
          </Right>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Lipides</Text>
          </Left>
          <Right>
            <Text>{repas.lipides} g</Text>
          </Right>
        </ListItem>

        <ListItem>
          <Left>
            <Text>Glucies</Text>
          </Left>
          <Right>
            <Text>{repas.glucides} g</Text>
          </Right>
        </ListItem>

        <ListItem>
          <Left>
            <Text>Total Calories</Text>
          </Left>
          <Right>
            <Text>{repas.calories} cal</Text>
          </Right>
        </ListItem>

        <Button
          block
          style={{alignContent: 'flex-end'}}
          onPress={() => navigation.goBack()}>
          <Text>Prendre un autre repas</Text>
        </Button>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  customheader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
