import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
  AsyncStorage
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

class BlinkingTitle extends Component {
  constructor(props) {
    super(props);
    this.state = { showText: true };
    // Change the state every second or the time given by User.
    setInterval(() => {
        this.setState(previousState => {
          return { showText: !previousState.showText };
        });
      },
      // Define blinking time in milliseconds
      1000
    );
  }
  render() {
    let display = this.state.showText ? this.props.text : ' ';
    return (
      <Text>{display}</Text>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();
    //Setting the state for the data after login
    this.state = {
      user_name: '',
      token: '',
      profile_pic: '',
      title: 'Welcome To MovieGO',
    };
  }

  get_Response_Info = (error, result) => {
    if (error) {
      //Alert for the Error
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      //response alert
      this.setState({ user_name: 'Welcome' + ' ' + result.name });
      this.setState({ token: 'User Token: ' + ' ' + result.id });
      this.setState({ profile_pic: result.picture.data.url });
      this.setState({ title: null })
      AsyncStorage.setItem('username', this.state.user_name);
      AsyncStorage.setItem('token', this.state.token);
      AsyncStorage.setItem('profilepic', this.state.profile_pic);
      AsyncStorage.setItem('status', 'Login');
    }
  };

  onLogout = () => {
    //Clear the state after logout
    this.setState({ user_name: null, token: null, profile_pic: null });
    this.setState({ title: 'Welcome To MovieGO' })
    AsyncStorage.setItem('username', 'empty');
    AsyncStorage.setItem('token', 'empty');
    AsyncStorage.setItem('profilepic', 'empty');
    AsyncStorage.setItem('status', 'Logout');
  };

  componentDidMount(){
    AsyncStorage.getItem('status')
    .then((item) => {
         if (item == 'Login') {
           this.setState({ title: null })
           this.props.navigation.navigate('Home')
         }
    });
    AsyncStorage.getItem('username')
        .then((item) => {
             if (item !== 'empty') {
                this.setState({ user_name: item })
             }
        });
    AsyncStorage.getItem('profilepic')
        .then((item) => {
             if (item !== 'empty') {
               this.setState({ profile_pic: item })
             }
        });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.profile_pic ? (
          <Image
            source={{ uri: this.state.profile_pic }}
            style={styles.imageStyle}
          />
        ) : null}
        <Text style={styles.text}> {this.state.user_name} </Text>
        {this.state.title ? (
        <View style={styles.titlebox}>
          <Text style={styles.title}><BlinkingTitle text={this.state.title} /></Text>
        </View>
        ) : null}

        <LoginButton
          readPermissions={['public_profile']}
          onLoginFinished={(error, result) => {
            if (error) {
              alert(error);
              alert('login has error: ' + result.error);
            } else if (result.isCancelled) {
              alert('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                  const processRequest = new GraphRequest(
                    '/me?fields=name,picture.type(large)',
                    null,
                    this.get_Response_Info
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(processRequest).start();
                });
              this.props.navigation.navigate('Home');
            }
          }}
          onLogoutFinished={this.onLogout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    padding: 20,
  },
  imageStyle: {
    width: 180,
    height: 270,
    resizeMode: 'contain',
  },
  titlebox: {
    height: 260,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: '#48BBEC',
    textAlign: 'center',
    margin: 30,
  },
});