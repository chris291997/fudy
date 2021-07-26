import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Button,
    TouchableOpacity,
    Dimensions,
    ImageBackground
  } from 'react-native';
import Maps from '../assets/images/mapbg.png'
const { width, height } = Dimensions.get("screen");
const cardWidth = width;
const cardHeight = height;
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';

const Address = () => {

    const [
        currentLongitude,
        setCurrentLongitude
      ] = useState('...');

      const [
        currentLatitude,
        setCurrentLatitude
      ] = useState('...');

      const [
        locationStatus,
        setLocationStatus
      ] = useState('');


      useEffect(() => {
        const requestLocationPermission = async () => {
          if (Platform.OS === 'ios') {
            getOneTimeLocation();
            subscribeLocationLocation();
            
          } else {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Location Access Required',
                  message: 'This App needs to Access your location',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                getOneTimeLocation();
                subscribeLocationLocation();
              } else {
                setLocationStatus('Permission Denied');
              }
            } catch (err) {
              console.warn(err);
            }
          }
        };
        requestLocationPermission();
        return () => {
          Geolocation.clearWatch(watchID);
        };
      }, []);

      const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            setLocationStatus('You are Here');
    
            //getting the Longitude from the location json
            const currentLongitude = 
              JSON.stringify(position.coords.longitude);
    
            //getting the Latitude from the location json
            const currentLatitude = 
              JSON.stringify(position.coords.latitude);
    
            //Setting Longitude state
            setCurrentLongitude(currentLongitude);
            
            //Setting Longitude state
            setCurrentLatitude(currentLatitude);
          },
          (error) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000
          },
        );
      };



      const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
          (position) => {
            //Will give you the location on location change
            
            setLocationStatus('You are Here');
            console.log(position);
    
            //getting the Longitude from the location json        
            const currentLongitude =
              JSON.stringify(position.coords.longitude);
    
            //getting the Latitude from the location json
            const currentLatitude = 
              JSON.stringify(position.coords.latitude);
    
            //Setting Longitude state
            setCurrentLongitude(currentLongitude);
    
            //Setting Latitude state
            setCurrentLatitude(currentLatitude);
          },
          (error) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 1000
          },
        );
      };
      
      fetch('https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=EL_6bt2JiR3LYBtfBG7gBNbZ7RFddshZNdgfqj683i8&at=' + currentLatitude+','+ currentLongitude +'&lang=en-US')
      .then((response) => response.json())
      .then((responseJson) => {
          alert('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.items[0].address.label));
    })
    




    return (
        <View style={styles.container}>
            <ImageBackground source={Maps} style={styles.image}>
            <View style={[styles.top, styles.top2]}>
                <Icon name="map-marker" size={20} color={'#55CCAB'}>
                
                </Icon>
                <Text style={{marginLeft:10, fontSize:15}}>Imelda Rocess, Gogon, Legazpi City</Text>
            </View>

                <View style={[styles.footer, styles.footer2]}>
                    <View >
                        <Text style={{fontSize:15,fontWeight:'bold', textAlign:'center', marginBottom:15}}>Bicol Fuds uses your location to show nearby restaurant around you!</Text>
                        <TouchableOpacity style={{padding:15, backgroundColor:'#55CCAB', justifyContent: 'center', alignItems:'center', borderRadius:15, marginBottom:15}}>
                            <Text style={{color:'#fff', fontSize:15}}>Use Current Location </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding:15,  justifyContent: 'center', alignItems:'center', borderRadius:15}}>
                            <Text style={{color:'#55CCAB', fontSize:15}}>Choose another Location </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground>

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    footer: {
        alignItems: 'center',
        position: 'absolute',
    },
    footer2: {
        bottom: 0,
        width: cardWidth,
        height: cardHeight / 4,
        backgroundColor: 'white',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        elevation: 40,
        padding: 30

    },

    top: {
        position: 'absolute',
    },
    top2: {
       top:0,
       height: cardHeight / 15,
        width: cardWidth,
        backgroundColor: 'white',
        elevation: 40,
        padding: 20,
        flexDirection: 'row',

    },

});

export default Address;
