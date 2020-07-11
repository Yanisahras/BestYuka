import React, {PureComponent, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon} from 'native-base';
import Axios from 'axios';

class CameraModule extends PureComponent {
  takePicture = async () => {
    console.log('cc');
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        pauseAfterCapture: true,
        width: 500,
      };
      const data = await this.camera.takePictureAsync(options);
      this.props.navigation.navigate('Stats', {
        imageb64: data.base64,
      });
      // Axios.post('http://192.168.8.101/api/test', {
      //   data: data.base64,
      // })
      //   .then(function(response) {
      //     console.log(response.data);
      //   })
      //   .catch(function(error) {
      //     console.log('sorry');
      //   });
    }
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
          flashMode={RNCamera.Constants.FlashMode.off}
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
          ratio="4:3"
        />

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {/* <TouchableOpacity
          onPress={() =>navigation.navigate('Reciep')}
          style={styles.capture}>
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            Recette
          </Text>
           navigation.navigate('Stats')
        </TouchableOpacity> */}

          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Text
              style={{
                fontSize: 14,
                color: 'white',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              Envoyer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default CameraModule;
