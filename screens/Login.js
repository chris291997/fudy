import React, { Component, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ImageBackground } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk'
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import { BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../components/context';
import DeviceInfo from 'react-native-device-info';

import BgLogin from '../assets/images/bgLogin.jpg'

const Login = ({ navigation, route }) => {
  const { address } = route.params;
  const { signIn } = React.useContext(AuthContext);

  DeviceInfo.getMacAddress().then((mac) => {
    // "E5:12:D8:E5:69:97"
    // setDeviceMac(mac)
    console.log(mac)
  });

  // FB Data //////
  const [fbID, setfbID] = useState('');
  const [fbphoto, setfbphoto] = useState('');
  const [timer, setTimer] = useState(false);


  const FBData = [{
    store_code: fbID,
    customer_device_id: fbphoto
  }]

  const dataDummy = [{
    fb: fbID,
    ads: address,
  }]

  console.log(FBData);
  console.log(address)

  if (fbID !== '') {
    signIn(FBData);
  }




  //    function GotoCustomer() {
  //     navigation.navigate('CustomerDetails',dataDummy
  //    )

  // }

  const getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name, first_name, last_name, picture'
      },
    }

    const profileRequest = new GraphRequest('/me', { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, result) => {
        if (error) {
          console.log('Login Info has an error:', error)
        }
        else {

          // this.setState({ userInfo: result,
          //                 profilePic: result.picture.data.url})
          // navigation.navigate('Main');
          setfbID(result.id)
          setfbphoto(result.picture.data.url)
          setTimer(true)

          // console.log(this.state.profilePic)
          console.log('result:', result)



        }
      },
    )

    new GraphRequestManager().addRequest(profileRequest).start()



  }



  const LoginMe = () => {

    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('login canceled')
        }
        else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString()
            getInfoFromToken(accessToken)


          })
        }
      },
      error => {
        console.log('login fail with error: ' + console.error(error));
        alert(error.message);
      },
    )

  }




  return (
    <ImageBackground source={BgLogin} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

<View style={{top:120}}>
  
      <View style={{alignItems: 'center', }}>
        <Text style={{fontSize:20, fontFamily: 'RalewayBold-rXY9', color: '#648813'}}>HURRY!</Text>
        <Text style={{fontFamily: 'RalewayExtralight-v02D'}}>Exciting foods are waiting!</Text>
      </View>
      <View style={{ margin: 15, }}>
        <TouchableOpacity onPress={() => LoginMe()} style={{ flexDirection: 'row', width: '100%', backgroundColor: '#4267B2', padding: 15, borderRadius: 10, }}>
          <Icon color={'white'} name="facebook-square" size={25}></Icon>
          <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10 }}> Continue With Facebook</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => LoginMe()} style={{ flexDirection: 'row', width: '100%', backgroundColor: '#EA4335', padding: 15, borderRadius: 10, marginTop:10 }}>
          <IconAnt color={'white'} name="googleplus" size={25}></IconAnt>
          <Text style={{ color: 'white', fontWeight: 'bold', marginHorizontal: 10 }}> Continue With Gmail</Text>
        </TouchableOpacity> */}
      </View>
     

      
</View>




    </ImageBackground>

  );
}

const styles = StyleSheet.create({

  input: {
    margin: 15,
    height: 40,
    borderColor: '#55CCAB',
    borderBottomWidth: 1
  },

})


export default Login;
