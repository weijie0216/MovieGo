import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import SearchPage from './SearchMovie';
import SearchResults from './SearchResults';
import MovieDetails from './MovieDetails';

const Stack = createStackNavigator();

function NavStack() {
  return (
     <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#621FF7',
          },
          headerTintColor: '#fff',
          headerTitleStyle :{
            fontWeight: 'bold',
          },
        }}
      >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="Home"
        component={SearchPage}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Results"
        component={SearchResults}
        options={{ title: 'Results' }}
      />
      <Stack.Screen
        name="Details"
        component={MovieDetails}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <NavStack />
    </NavigationContainer>
  );
}