import React, {Component} from 'react';
import {StyleSheet, Text, View, ToastAndroid} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {FAB} from 'react-native-paper';

import Firebase from '../services/Firebase';

export default class CameraPage extends React.Component {
  static navigationOptions = {
    title: 'Camera   ',
    headerStyle: {
      backgroundColor: '#2B353F'
    },
    headerTintColor: '#ffffff'
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />

        <FAB
          style={styles.fab}
          color="#ecf0f1"
          label="CAPTURE"
          icon={require('../assets/camera.png')}
          onPress={() => this.takePicture()}
        />
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.3, base64: true, fixOrientation: true};
      const data = await this.camera.takePictureAsync(options);
      ToastAndroid.show('Uploading Captured Image...', ToastAndroid.LONG);
      Firebase.firestore_uploadPost('data:/image/jpeg;base64,' + data['base64']);
      this.props.navigation.navigate('Home');
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2B353F',
  },
});
