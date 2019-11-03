import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inputContainer: {
    marginVertical: 20,
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#dddddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  textInput: {
    fontSize: 16,
    color: 'black',
  },
  loginButtonContainer: {
    backgroundColor: '#FF0059',
    borderRadius: 5,
    width: '90%',
    marginTop: '10%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUpButtonContainer: {
    marginTop: 20,
  },
  signUpText: {
    color: '#2d2d2d',
  },
});

export default styles;
