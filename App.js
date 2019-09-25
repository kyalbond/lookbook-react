import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomePage from './src/pages/HomePage';
import LoginPage from './src/pages/LoginPage';
import CameraPage from './src/pages/CameraPage';
import CreatePage from './src/pages/CreatePage';

import Firebase from './src/services/Firebase';

/**
 * Main app class for initializing application
 */
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }

  componentDidMount() {
    Firebase.firebase_init;
  }
}

/**
 * Stack navigator for setting up navigation routes
 */
const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomePage,
    },
    Login: {
      screen: LoginPage,
    },
    CameraPage: {
      screen: CameraPage,
    },
    CreatePage: {
      screen: CreatePage,
    }},
  {
    initialRouteName: 'Login',
  },
);

const AppContainer = createAppContainer(AppNavigator);
