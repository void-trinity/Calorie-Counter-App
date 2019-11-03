import React, {Component} from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';
import Tflite from 'tflite-react-native';

import styles from './styles';
import axios from 'axios';
import BASE_URL from '../baseurl';
import AsyncStorage from '@react-native-community/async-storage';

const localUri = 'file:///storage/emulated/0/Test/1 (60).jpg';

export default class Scanresult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      data: '',
      data2: '',
      thumb: {},
      orange: {},
      apple: {},
    };
  }

  analyzeResult = async () => {
    const {navigation} = this.props;
    let uri = navigation.getParam('imageURI');
    uri = localUri;
    let tflite = new Tflite();
    tflite.loadModel(
      {
        model: 'models/ssd_mobilenet.tflite',
        labels: 'models/ssd_mobilenet.txt',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      },
    );
    tflite.detectObjectOnImage(
      {
        path: uri,
        model: 'SSDMobileNet',
        imageMean: 127.5,
        imageStd: 127.5,
        numResultsPerClass: 5, // defaults to 5
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          var count_a = 0;
          for (let i = 0; i < res.length; i++) {
            if (res[i].detectedClass === 'apple' && count_a == 0) {
              count_a++;
              this.setState({apple: res[i]});
            } else if (res[i].detectedClass === 'orange') {
              this.setState({orange: res[i]});
            }
          }
        }
      },
    );
    tflite.close();
    tflite.loadModel(
      {
        model: 'models/detect.tflite',
        labels: 'models/ssd_mobilenet.txt',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
      },
    );
    tflite.detectObjectOnImage(
      {
        path: uri,
        model: 'SSDMobileNet',
        imageMean: 127.5,
        imageStd: 127.5,
        numResultsPerClass: 1, // defaults to 5
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          this.setState({result2: true, data2: res});
          for (let i = 0; i < res.length; i++) {
            if (res[i].detectedClass === 'thumb') {
              this.setState({thumb: res[i]});
            }
          }
        }
      },
    );
    tflite.close();

    let formData = new FormData();
    var name = await AsyncStorage.getItem('UserJSON');
    name = `${await JSON.parse(name).username}-${Date.now()}`;
    formData.append('image', {
      uri: uri,
      type: 'image/jpg',
      name: `${name}.jpg`,
    });
    if (this.state.apple && this.state.apple.detectedClass) {
      formData.append('apple', JSON.stringify(this.state.apple));
    }
    if (this.state.orange && this.state.orange.detectedClass) {
      formData.append('orange', JSON.stringify(this.state.orange));
    }
    if (this.state.thumb && this.state.thumb.detectedClass) {
      formData.append('thumb', JSON.stringify(this.state.thumb));
    }
    axios
      .post(`${BASE_URL}/testupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        console.log(data);
        this.setState({result: true, data});
      })
      .catch(error => {
        console.log(error);
        this.setState({result: true, data: ''});
      });
  };

  componentDidMount() {
    this.analyzeResult();
  }

  renderContent = () => {
    if (this.state.result) {
      return <Text>{JSON.stringify(this.state.data)}</Text>;
    }
    return <ActivityIndicator size={'large'} color={'tomato'} />;
  };

  render() {
    return <View style={styles.container}>{this.renderContent()}</View>;
  }
}
