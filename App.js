//web 176964422252-1r6fd1n8ii3kjcl91egh1kpc6aqsdbuu.apps.googleusercontent.com
//android 176964422252-m21vkiraioam8stscqt8qp64rk374qs6.apps.googleusercontent.com
//ios 176964422252-coav2tace8hjd1fo0skjtn9597qe7688.apps.googleusercontent.com 

//MS
// --- Geveo AD
//   clientId: '42d95333-1920-4be8-a244-afa38c7d4463',
//   tenant:  '2dc5556c-805e-4168-9b18-91a81ce717f9', // your app tenant ID

// --- My person AD
//  clientId: '70170c33-4a8c-4690-8618-4eedc21dc9e8',
//  tenant: 'e48c12e9-6f51-4aa2-ab71-dcdc690ad071', // your app tenant ID

import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AzureAuth from 'react-native-azure-auth';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] =  Google.useAuthRequest({
    androidClientId: "176964422252-m21vkiraioam8stscqt8qp64rk374qs6.apps.googleusercontent.com",
    iosClientId: "176964422252-coav2tace8hjd1fo0skjtn9597qe7688.apps.googleusercontent.com",
    webClientId: "176964422252-1r6fd1n8ii3kjcl91egh1kpc6aqsdbuu.apps.googleusercontent.com",
  });

  const azureAuth = new AzureAuth({
    clientId: '70170c33-4a8c-4690-8618-4eedc21dc9e8',
  });

  React.useEffect(()=>{
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle(){
    const user = await AsyncStorage.getItem("@user");
    if (!user){
      if(response?.type === "success"){
        setAccessToken(response.authentication.accessToken);
        await getUserInfo(response.authentication.accessToken);
      }
    } 
    else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}`},
        }
      )

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      
    }
  }

  const _onLogin = async () => {
    try {
      let tokens = await azureAuth.webAuth.authorize({scope: 'openid profile User.Read' })
      setAccessToken(tokens.accessToken);
      let info = await azureAuth.auth.msGraphRequest({token: tokens.accessToken, path: '/me'})
      setUserInfo({ name: info.displayName, userId: tokens.userId })
    } catch (error) {
      console.log(error)
    }
  }

  const _onLogout = async () => {
    setUserInfo(null);
    setAccessToken(null);
    await AsyncStorage.removeItem("@user");
  }

return (
  <View style={styles.container}>
    <View>
      <Text style={styles.header}>Azure Auth - Login</Text>
      <Text style={styles.text}>Hello {userInfo ? userInfo.name : 'USER'} !</Text>
      <Text style={styles.text}>
        You are {accessToken  ? '' : 'not '}logged in.
      </Text>
    </View>  
    <View style={styles.buttons}> 
      {!accessToken && (<Button
        style={styles.button}
        onPress={_onLogin}
        title={'Microsoft Log In'}
      />)}
      {!accessToken && (<Button
        style={styles.button}
        onPress={ () => promptAsync()}
        title={'Google Log In'}
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
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  text: {
    textAlign: 'center'
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