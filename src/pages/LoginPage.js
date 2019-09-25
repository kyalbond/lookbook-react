import React from 'react';
import {
  View,
  Image,
  Alert,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableHighlight,
  Text,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';

import Firebase from '../services/Firebase';

/**
 * Component for loggin in
 */
class Login extends React.Component {
  // Header styling
  static navigationOptions = {
    title: 'Look-Book',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#2B353F',
    },
    headerTitleStyle: {
      backgroundColor: '#2B353F',
      color: '#ffffff',
    },
  };

  // Set state for user input
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  /**
   * Attempt to log user in
   */
  onLogin() {
    const {email, password} = this.state;

    // Check email length
    if (email.length == 0) {
      ToastAndroid.show('Please enter an email!', ToastAndroid.SHORT);

    // Check password length
    } else if (password.length == 0) {
      ToastAndroid.show('Please enter a password', ToastAndroid.SHORT);
    } else {

      // Call firebase and attempt to sign in
      Firebase.firebase_signIn(email, password)
        .then(() => {
          ToastAndroid.show('Sucessfully signed in', ToastAndroid.SHORT);

          // Navigate to the home screen
          this.props.navigation.navigate('Home');
        })
        .catch(err => {
          ToastAndroid.show('Failed to sign in', ToastAndroid.SHORT);
        });
    }
  }

  /**
   * Render app logo, user input, and login/sign-up buttons
   */
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2B353F" barStyle="light-content" />

        <View style={styles.imageContainer}>
          <Image source={require('../assets/login.png')} style={styles.image} />
        </View>

        <View style={styles.containerInput}>
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({email})}
            placeholder={'Email'}
            style={styles.input}
          />

          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({password})}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />

          <Button
            title={'Login'}
            buttonStyle={styles.button}
            containerStyle={{paddingTop: 10}}
            onPress={this.onLogin.bind(this)}
          />

          <Button
            title={'Create Account'}
            titleStyle={{color: '#2B353F'}}
            buttonStyle={styles.buttonCreate}
            containerStyle={{paddingVertical: 10}}
            type="outline"
            onPress={() => {
              this.props.navigation.navigate('CreatePage');
            }}
          />
        </View>
      </View>
    );
  }
}

// Styling for components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  containerInput: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').width * 0.9,
    paddingTop: Dimensions.get('screen').width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    width: Dimensions.get('screen').width * 0.7,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  button: {
    width: Dimensions.get('screen').width / 4,
    backgroundColor: '#2B353F',
  },
  buttonCreate: {
    padding: 10,
    borderColor: '#2B353F',
    backgroundColor: '#ffffff',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default Login;
