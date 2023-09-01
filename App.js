//web 176964422252-1r6fd1n8ii3kjcl91egh1kpc6aqsdbuu.apps.googleusercontent.com
//android 176964422252-m21vkiraioam8stscqt8qp64rk374qs6.apps.googleusercontent.com
//ios 176964422252-coav2tace8hjd1fo0skjtn9597qe7688.apps.googleusercontent.com 

import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] =  Google.useAuthRequest({
    androidClientId: "176964422252-m21vkiraioam8stscqt8qp64rk374qs6.apps.googleusercontent.com",
    iosClientId: "176964422252-coav2tace8hjd1fo0skjtn9597qe7688.apps.googleusercontent.com",
    webClientId: "176964422252-1r6fd1n8ii3kjcl91egh1kpc6aqsdbuu.apps.googleusercontent.com"
  });

  React.useEffect(()=>{
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle(){
    const user = await AsyncStorage.getItem("@user");
    if (!user){
      if(response?.type === "success"){
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

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text>Code with Malinda</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()}></Button>
      <Button title="Delete local storage" onPress={() => AsyncStorage.removeItem("@user")}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
