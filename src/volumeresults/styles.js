import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imageContainer: {
    alignItems: 'center',
    flex: 0.4,
    borderWidth: 2,
    borderColor: '#dddddd',
    justifyContent: 'space-around',
    borderRadius: 5,
    width: '85%',
    borderStyle: 'dashed',
  },
  image: {
    flex: 1,
    height: 'auto',
    width: '100%',
  },
  loadingText: {
    fontSize: 20,
    color: '#dddddd',
    fontWeight: 'bold',
  },
});

export default styles;
