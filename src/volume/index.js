import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import RNFS from 'react-native-fs';

import styles from './styles';
import BASE_URL from '../baseurl';

export default class Volume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ['', ''],
      renderComponent: [-1, -1],
      renderSnapButton: true,
      uploading: false,
    };
  }

  takePicture = async i => {
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
      const {image} = this.state;
      image[i] = data.uri;
      this.camera.resumePreview();
      this.setState({image, renderSnapButton: true});
      this.changeViewMode(i, 0);
    }
  };

  deletePicture = async i => {
    let {image} = this.state;
    let path = `${image[i]}`;
    console.log(path)
    await RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
        image[i] = '';
        this.changeViewMode(i, -1);
        this.setState({image});
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  renderSnapButton = i => {
    if (this.state.renderSnapButton) {
      return (
        <TouchableOpacity
          onPress={this.takePicture.bind(this, i)}
          style={styles.capture}>
          <Text style={{fontSize: 14}}> SNAP </Text>
        </TouchableOpacity>
      );
    }
    return <ActivityIndicator size={'large'} color={'tomato'} />;
  };
  renderCamera = i => {
    return (
      <View style={styles.contentContainer}>
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
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          {this.renderSnapButton(i)}
        </View>
      </View>
    );
  };

  renderImage = i => {
    return (
      <View style={styles.contentContainer}>
        <Image source={{uri: this.state.image[i]}} style={styles.image} />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => this.deletePicture(i)}
            style={styles.delete}>
            <Text style={{fontSize: 14}}> Delete Picture </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  changeViewMode = (i, mode) => {
    const {renderComponent, image} = this.state;
    renderComponent[i] = mode;
    if (renderComponent[1 - i] == 1) {
      renderComponent[1 - i] = image[1 - i].length ? 0 : -1;
    }
    this.setState({renderComponent});
  };

  renderAddImage = i => {
    return (
      <TouchableOpacity
        onPress={() => this.changeViewMode(i, 1)}
        style={[styles.contentContainer, {justifyContent: 'center'}]}>
        <Icon name={'plus-circle'} size={50} color="#dddddd" />
        <Text style={styles.addImageText}>
          {i == 0 ? 'Front View' : 'Top View'}
        </Text>
      </TouchableOpacity>
    );
  };

  renderContent = i => {
    const {renderComponent} = this.state;
    switch (renderComponent[i]) {
      case -1:
        return this.renderAddImage(i);
      case 0:
        return this.renderImage(i);
      case 1:
        return this.renderCamera(i);
    }
  };

  uploadImages = async () => {
    if (this.getButtonColor() === '#dddddd') {
      return;
    }
    var name = await AsyncStorage.getItem('UserJSON');
    name = `${await JSON.parse(name).username}-${Date.now()}`;
    this.setState({uploading: true});
    let formData = new FormData();
    formData.append('front', {
      uri: this.state.image[0],
      type: 'image/jpg',
      name: `${name}-front.jpg`,
    });
    formData.append('top', {
      uri: this.state.image[1],
      type: 'image/jpg',
      name: `${name}-top.jpg`,
    });
    axios
      .post(`${BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        this.setState({uploading: false});
        this.deletePicture(0);
        this.deletePicture(1);
        this.props.navigation.navigate('VolumeResults', {imageURI: data.image});
      })
      .catch(error => {
        console.log(error);
        this.setState({uploading: false});
      });
  };

  getButtonColor = () => {
    const {image} = this.state;
    if (image[0].length && image[1].length) {
      return '#FF0059';
    }
    return '#dddddd';
  };

  renderButton = () => {
    if (this.state.uploading) {
      return <ActivityIndicator size={'large'} color={'#FF0059'} />;
    } else {
      return (
        <TouchableOpacity
          onPress={this.uploadImages}
          style={[
            styles.uploadButton,
            {backgroundColor: this.getButtonColor()},
          ]}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>{this.renderContent(0)}</View>
        <View style={styles.imageContainer}>{this.renderContent(1)}</View>
        {this.renderButton()}
      </View>
    );
  }
}
