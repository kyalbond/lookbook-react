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

class CreatePage extends React.Component {
  static navigationOptions = {
    title: 'Create Account     ',

    headerStyle: {
      backgroundColor: '#2B353F',
    },
    headerTitleStyle: {
      backgroundColor: '#2B353F',
      color: '#ffffff',
    },
    headerTintColor: '#ffffff'
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username: '',
    };
  }

  onCreateAccount() {
    const {email, password, username} = this.state;

    if (email.length == 0) {
      ToastAndroid.show('Please enter a username', ToastAndroid.SHORT);
    } else if (password.length == 0) {
      ToastAndroid.show('Please enter an email!', ToastAndroid.SHORT);
    } else if (username.length == 0) {
      ToastAndroid.show('Please enter a password', ToastAndroid.SHORT);
    } else {
      Firebase.auth_createAccount(email, password)
        .then(() => {
          ToastAndroid.show('Sucessfully created account', ToastAndroid.SHORT);
          Firebase.firebase_signIn(email, password).then(() => {
            Firebase.auth_updateProfile(username);
          });
          this.props.navigation.navigate('Login');
        })
        .catch(err => {
          ToastAndroid.show('Failed to create account', ToastAndroid.SHORT);
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2B353F" barStyle="light-content" />

        <View style={styles.containerInput}>
          <TextInput
            value={this.state.username}
            onChangeText={username => this.setState({username})}
            placeholder={'Username'}
            style={styles.input}
          />

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
            title={'Create Account'}
            titleStyle={{color: '#ffffff'}}
            buttonStyle={styles.buttonCreate}
            containerStyle={{paddingVertical: 10}}
            onPress={this.onCreateAccount.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  containerInput: {
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').width * 0.9,
    alignItems: 'center',
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
    padding: 10,
    width: Dimensions.get('screen').width / 4,
    backgroundColor: '#2B353F',
  },
  buttonCreate: {
    padding: 10,
    borderColor: '#2B353F',
    backgroundColor: '#2B353F',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default CreatePage;
