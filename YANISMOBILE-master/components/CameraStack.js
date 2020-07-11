import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const CameraStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Receip"
        component={Receip}
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
    </Stack.Navigator>
  );
};

export default CameraStack;

const Reciep = () => {
  return <Text>Recette</Text>;
};
const Stats = () => {
  return <Text>Stats</Text>;
};
