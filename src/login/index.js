import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {NavigationActions, StackActions} from 'react-navigation';

import styles from './styles';
import BASE_URL from '../baseurl';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      username: 'trinity',
      password: 'pass1234',
    };
  }

  onLoginButtonPressed = async () => {
    const url = `${BASE_URL}/user`;
    const {username, password} = this.state;
    this.setState({loggingIn: true});
    axios
      .get(url, {
        headers: {'Content-Type': 'application/json'},
        params: {username, password},
      })
      .then(({data}) => {
        AsyncStorage.setItem('UserJSON', JSON.stringify(data)).then(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({routeName: 'BottomTabNavigator'}),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({loggingIn: false});
      });
  };

  renderButton = () => {
    if (this.state.loggingIn) {
      return <ActivityIndicator size={'large'} color={'#FF0059'} />;
    } else {
      return (
        <>
          <TouchableNativeFeedback onPress={this.onLoginButtonPressed}>
            <View style={styles.loginButtonContainer}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.signUpButtonContainer}>
              <Text style={styles.signUpText}>
                Don't have an account, Sign Up!
              </Text>
            </View>
          </TouchableNativeFeedback>
        </>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'Username'}
            style={styles.textInput}
            onChangeText={username => this.setState({username})}
            value={this.state.username}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            placeholder={'Password'}
            style={styles.textInput}
            onChangeText={password => this.setState({password})}
            value={this.state.password}
          />
        </View>
        {this.renderButton()}
      </View>
    );
  }
}
