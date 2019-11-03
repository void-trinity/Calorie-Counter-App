import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ProgressCircle} from 'react-native-svg-charts';
import Svg, {Text as SvgText} from 'react-native-svg';

import styles from './styles';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('UserJSON')
      .then(async data => {
        const {budget} = JSON.parse(data);
        this.setState({budget: budget.toString()});
      })
      .catch(error => console.log('error'));
  }

  renderScreen = () => {
    if (this.state.budget.length) {
      return (
        <>
          <ProgressCircle
            style={{width: '60%', height: '60%'}}
            animate={true}
            progress={0.7}
            progressColor={'tomato'}
            strokeWidth={30}
            cornerRadius={0}
            children={
              <Svg>
                <SvgText
                  fill="black"
                  fontSize="30"
                  fontWeight="bold"
                  textAnchor="middle">
                  {this.state.budget}
                  <SvgText
                    fill="black"
                    fontSize="18"
                    textAnchor="middle"
                    fontWeight={'normal'}
                    y="30">
                    Calories
                  </SvgText>
                </SvgText>
              </Svg>
            }
          />
        </>
      );
    } else {
      return <ActivityIndicator size={'large'} color={'tomato'} />;
    }
  };

  render() {
    return <View style={styles.container}>{this.renderScreen()}</View>;
  }
}
