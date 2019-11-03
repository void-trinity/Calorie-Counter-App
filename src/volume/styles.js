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
    borderRadius: 5,
    width: '85%',
    borderStyle: 'dashed',
  },
  addImageText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#dddddd',
    marginTop: 20,
  },
  preview: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
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
  image: {
    flex: 1,
    height: 'auto',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: '85%',
    flex: 0.1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  delete: {
    flex: 0,
    width: '100%',
    backgroundColor: '#dddddd',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default styles;
