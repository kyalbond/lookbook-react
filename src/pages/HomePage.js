import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Firebase from '../services/Firebase';
import {ActivityIndicator, FAB} from 'react-native-paper';
import firebase from 'firebase';
import 'firebase/firestore';
import {collectionData} from 'rxfire/firestore';
import {Image, Avatar} from 'react-native-elements';
import {ListItem} from 'react-native-elements';

/**
 * Home component for rendering posts from firestore cloud
 */
class Home extends React.Component {
  // Header styling and logout functionality
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    return {
      title: 'Home  ',
      headerLeft: null,
      headerStyle: {
        backgroundColor: '#2B353F',
      },
      headerTitleStyle: {
        backgroundColor: '#2B353F',
        color: '#ffffff',
      },

      // Setup logout button
      headerRight: (
        <TouchableHighlight
          onPress={() =>
            Alert.alert(
              'Sign-out?',
              'Are you sure you want to sign-out?',
              [
                {text: 'Cancel'},
                {
                  text: 'OK',
                  onPress: () => {
                    params.goLogout();
                  },
                },
              ],
              {cancelable: false},
            )
          }>
          <Image
            style={{width: 40, height: 40, paddingRight: 20}}
            source={require('../assets/logout.png')}
          />
        </TouchableHighlight>
      ),
    };
  };

  /**
   * Setup state variables
   */
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: null,
      refreshing: false,
    };
  }

  /**
   * Get data from firestore and setup logout function
   */
  componentDidMount() {
    this.getData();
    this.props.navigation.setParams({
      goLogout: this.logout,
    });
  }

  /**
   * Calls firestore and creates a subscription to the collection allowing
   * live updates to component
   */
  getData = () => {
    const dataRef = firebase.firestore().collection('images');
    collectionData(dataRef.orderBy('date', 'desc')).subscribe(posts => {
      this.setState({
        data: posts,
        loading: false,
      });
    });
  };

  /**
   * Logs user out through firebase_auth and navigates back to login screen.
   */
  logout = () => {
    Firebase.firebase_signOut()
      .then(() => {
        ToastAndroid.show('Successfully signed out.', ToastAndroid.SHORT);
        this.props.navigation.navigate('Login');
      })
      .catch(err => {
        ToastAndroid.show('Failed to sign out.', ToastAndroid.SHORT);
      });
  };

  /**
   * Called when user taps on photo, access post and add a like to counter
   *
   * @param {String} uid
   * @param {Number} likes
   */
  likePhoto(uid, likes) {
    Firebase.firestore_addLike(uid, likes)
      .then(() => {
        ToastAndroid.show('Photo liked :)', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show('Failed to like photo :(', ToastAndroid.SHORT);
      });
  }

  /**
   * Render posts in an infinate flatlist
   */
  render() {
    if (this.loading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View>
          <FlatList
            // For each post in firestore, render component
            data={this.state.data}
            renderItem={({item}) => (
              <View>
                <TouchableHighlight
                  // Attempts to like image when pressed
                  onPress={this.likePhoto.bind(this, item.id, item.likes)}>
                  <Image
                  // Image for post
                    style={{
                      width: Dimensions.get('screen').width,
                      height: Dimensions.get('screen').width,
                    }}
                    source={{uri: item.imageURL}}
                    PlaceholderContent={<ActivityIndicator />}
                  />
                </TouchableHighlight>
                <ListItem
                // Info under image
                  title={item.name}       // Username of post
                  subtitle={new Date(     // Date of post
                    parseInt((item.date + '').split('=')[1].split(',')[0]) *
                      1000,
                  ).toDateString()}
                  leftAvatar={
                    <Avatar               // Initals of user
                      overlayContainerStyle={{backgroundColor: '#2B353F'}}
                      title={item.name[0]}
                      rounded
                    />
                  }                       // Likes of post
                  rightTitle={'Likes:  ' + item.likes} 
                />
              </View>
            )}
          />

          <FAB
            // Floating action button for accessing camera
            style={styles.fab}
            color="#ecf0f1"
            icon={require('../assets/camera.png')}
            onPress={() => {
              this.props.navigation.navigate('CameraPage');
            }}
          />
        </View>
      );
    }
  }
}

// Styling for component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#2B353F',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  avatar: {
    backgroundColor: '#2B353F',
    color: '#e0e0e0',
  },
  listItemContainer: {
    borderStyle: 'solid',
    borderColor: '#fff',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  imageContainer: {
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
});

export default Home;
