import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';

import styles from './styles';

export default class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      renderSnapButton: true,
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        fixOrientation: true,
        orientation: 'portrait',
      };
      this.setState({renderSnapButton: false});
      const data = await this.camera.takePictureAsync(options);
      this.camera.pausePreview();
      this.setState({image: data.uri, renderSnapButton: true});
      console.log(data.uri);
    }
  };

  deletePicture = async () => {
    let {image} = this.state;
    let path = `${image}`;
    console.log(path);
    await RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
        image = '';
        this.setState({image});
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  renderSnapButton = () => {
    if (this.state.renderSnapButton) {
      return (
        <TouchableOpacity
          onPress={this.takePicture.bind(this)}
          style={styles.capture}>
          <Text style={{fontSize: 14}}> SNAP </Text>
        </TouchableOpacity>
      );
    }
    return <ActivityIndicator size={'large'} color={'tomato'} />;
  };

  scanFood = () => {
    this.props.navigation.navigate('Scanresult', {imageURI: this.state.image});
  };

  renderCameraOrImage = () => {
    if (this.state.image.length) {
      return (
        <>
          <Image source={{uri: this.state.image}} style={styles.image} />
          <View
            style={{flex: 0.2, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={this.deletePicture}
              style={styles.capture}>
              <Text style={{fontSize: 14}}> Delete Picture </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.scanFood} style={styles.capture}>
              <Text style={{fontSize: 14}}> Scan Food </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return (
      <>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View
          style={{flex: 0.2, flexDirection: 'row', justifyContent: 'center'}}>
          {this.renderSnapButton()}
        </View>
      </>
    );
  };
  render() {
    return <View style={styles.container}>{this.renderCameraOrImage()}</View>;
  }
}
