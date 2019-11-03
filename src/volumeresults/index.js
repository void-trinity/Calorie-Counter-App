import React, {Component} from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';
import axios from 'axios';

import BASE_URL from '../baseurl';
import styles from './styles';

export default class VolumeResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: [false, false],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const uri = navigation.getParam('imageURI');
    this.setState({
      image: [
        `${BASE_URL}/image/${uri}-front.jpg`,
        `${BASE_URL}/image/${uri}-top.jpg`,
      ],
    });
    axios
      .get(`${BASE_URL}/detectobject`, {
        headers: {'Content-Type': 'application/json'},
        params: {image: `${uri}-front.jpg`},
      })
      .then(({data}) => {
        console.log(data);
        let {loaded} = this.state;
        loaded[0] = true;
        this.setState({loaded});
      })
      .catch(error => console.log('error: ', error));
    axios
      .get(`${BASE_URL}/detectobject`, {
        headers: {'Content-Type': 'application/json'},
        params: {image: `${uri}-top.jpg`},
      })
      .then(({data}) => {
        let {loaded} = this.state;
        loaded[1] = true;
        this.setState({loaded});
      })
      .catch(error => console.log('error: ', error));
  }

  renderContent = i => {
    if (this.state.loaded[i]) {
      return <Image source={{uri: this.state.image[i]}} style={styles.image} />;
    }
    return (
      <>
        <ActivityIndicator size={'large'} color={'tomato'} />
        <Text style={styles.loadingText}>Analyzing Results</Text>
      </>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>{this.renderContent(0)}</View>
        <View style={styles.imageContainer}>{this.renderContent(1)}</View>
      </View>
    );
  }
}
