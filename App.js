import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AzureAuth from 'react-native-azure-auth';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [ssoProvider, setSSOProvider] = React.useState(null);

  const azureAuth = new AzureAuth({
    clientId: '70170c33-4a8c-4690-8618-4eedc21dc9e8',
  });

  const MICROSFT_PROVIDER = "Microsoft";
  const GOOGLE_PROVIDER = "Google";

  const _onLoginMircrosoft = async () => {
    try {
      setSSOProvider(MICROSFT_PROVIDER);
      let tokens = await azureAuth.webAuth.authorize({scope: 'openid profile User.Read' })
      setAccessToken(tokens.accessToken);
      let info = await azureAuth.auth.msGraphRequest({token: tokens.accessToken, path: '/me'})
      setUserInfo({ name: info.displayName, userId: tokens.userId })
    } catch (e) {
      console.log("ERROR IS: " + JSON.stringify(e));
    }
  }

  const _onLoginGoogle = async () => {
    setSSOProvider(GOOGLE_PROVIDER);
    GoogleSignin.configure({
      offlineAccess: true,
      androidClientId: "176964422252-m21vkiraioam8stscqt8qp64rk374qs6.apps.googleusercontent.com",
      iosClientId: "176964422252-coav2tace8hjd1fo0skjtn9597qe7688.apps.googleusercontent.com",
      webClientId: "176964422252-1r6fd1n8ii3kjcl91egh1kpc6aqsdbuu.apps.googleusercontent.com",
    });
    GoogleSignin.hasPlayServices().then((hasPlayService) => {
            if (hasPlayService) {
                GoogleSignin.signIn().then((info) => {
                  setUserInfo({ name: info.user.name, userId: info.user.name })
                  setAccessToken(info.idToken);
                  console.log(JSON.stringify(userInfo, null, 2))
                }).catch((e) => {
                console.log("ERROR IS: " + JSON.stringify(e));
                })
            }
    }).catch((e) => {
        console.log("ERROR IS: " + JSON.stringify(e));
    })
  }

  const _onLogout = async () => {
    setUserInfo(null);
    setAccessToken(null);
    if(ssoProvider === MICROSFT_PROVIDER){
      await azureAuth.webAuth.clearSession();
    }
    else {
      await GoogleSignin.signOut();
    }
    setSSOProvider(null);
  }
 
return (
  <View style={styles.container}>
    <View>
      <Text style={styles.header}>{ssoProvider ? (ssoProvider === MICROSFT_PROVIDER ? MICROSFT_PROVIDER : GOOGLE_PROVIDER) : ''} Auth - Login</Text>
      <Text style={styles.text}>Hello {userInfo ? userInfo.name : ''} !!!</Text>
      <Text style={styles.loginText}>
        You are {accessToken  ? '' : 'not '}logged in.
      </Text>
    </View> 
    <View style={styles.buttons}> 
      {!accessToken && (<Button
        style={styles.button}
        onPress={_onLoginMircrosoft}
        title={'Microsoft - Login'}
      />)}
      {!accessToken && (<Button
        style={styles.button}
        onPress={ () => _onLoginGoogle()}
        title={'Google - Login'}
      />)}
      {accessToken && (<Button 
        style={styles.button}
        onPress={ _onLogout}
        title={'Log Out'}
      />)}
    </View>
  </View>
)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'pink'
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'black',
    color: 'white'
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
    backgroundColor: '#ecedce'
  },
  loginText: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#ff7373'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    padding: 20
  },
  button: {
    flex: 1,
    padding:20,
    margin:20
  },
  list: {
    flex: 5,
    margin:20
  }
});