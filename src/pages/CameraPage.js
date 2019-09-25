import React, {Component} from 'react';
import {StyleSheet, Text, View, ToastAndroid} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {FAB} from 'react-native-paper';

import Firebase from '../services/Firebase';

/**
 * Camera component for streaming camera data and taking photos.
 */
export default class CameraPage extends React.Component {

  // Header styling
  static navigationOptions = {
    title: 'Camera   ',
    headerStyle: {
      backgroundColor: '#2B353F'
    },
    headerTintColor: '#ffffff'
  };

  // Render camera stream
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}

          // Permissions
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

        <FAB                  // Fab for taking photo
          style={styles.fab}
          color="#ecf0f1"
          label="CAPTURE"
          icon={require('../assets/camera.png')}
          onPress={() => this.takePicture()}
        />
      </View>
    );
  }

  /**
   * Take image as base64 then upload to firestore
   */
  takePicture = async () => {
    if (this.camera) {
      // Setup parameters for image
      const options = {quality: 0.3, base64: true, fixOrientation: true};
      const data = await this.camera.takePictureAsync(options);
      ToastAndroid.show('Uploading Captured Image...', ToastAndroid.LONG);
      
      // Attempt to upload image ti firestore
      Firebase.firestore_uploadPost('data:/image/jpeg;base64,' + data['base64']);
      
      // Navigate back home
      this.props.navigation.navigate('Home');
    }
  };
}

// Styling for component
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
