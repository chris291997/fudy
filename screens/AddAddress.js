import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions,PermissionsAndroid, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, TextInput } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from "@react-native-mapbox-gl/maps";
import DeviceInfo from 'react-native-device-info';
import URL from './UrlBased'

import preloader from '../assets/images/preloader.gif';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome5';
// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';


MapboxGL.setAccessToken('pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA');


const AddAddress = ({ navigation }) => {



    // Screen Size
    const { width, height } = Dimensions.get("screen");
    const cardWidth = width / 3;

    const screenWidth = width;
    const screenHeight = height;




   
    const [loading, setLoading] = React.useState(true);
    const [deviceId, setdeviceId] = React.useState('')

    const [hereiam, sethereiam] = React.useState([]);
    const [AddressLabel, setAddressLabel] = React.useState('')
    const [landmark, setlandmark] = React.useState('')
    const [
        currentLongitude,
        setCurrentLongitude
    ] = useState('...');

    const [
        currentLatitude,
        setCurrentLatitude
    ] = useState('...');

    React.useEffect(async () => {
        DeviceInfo.getMacAddress().then((mac) => {
            setdeviceId(mac)
        });


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

                Geolocation.getCurrentPosition( (position) => {
                     //getting the Longitude from the location json
                const currentLongitude =
                JSON.stringify(position.coords.longitude);

            //getting the Latitude from the location json
            const currentLatitude =
                JSON.stringify(position.coords.latitude);

                setCurrentLongitude(currentLongitude);
                setCurrentLatitude(currentLatitude);

                sethereiam([currentLongitude,currentLatitude]);

                fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + currentLongitude + ',' + currentLatitude + '.json?access_token=pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA')
                .then((response) => response.json())
                .then((responseJson) => {
                    setLoading(false);
                    setAddressLabel(responseJson.features[2].place_name)
                }).catch((error) => {
                    console.error(error);
                });





              
                });

            

            } else {
                setLocationStatus('Permission Denied');
            }
        } catch (err) {
            console.warn(err);
        }
      
        
        // setAddressLabel(data.address)

    }, [])

    const CoordinatesOnclick = (coord) => {

       setCurrentLongitude(coord[0]);
       setCurrentLatitude(coord[1]);

       const Longitude = coord[0];
       const Latitude = coord[1];

        sethereiam([coord[0], coord[1]]);

        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + Longitude + ',' + Latitude + '.json?access_token=pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA')
            .then((response) => response.json())
            .then((responseJson) => {
              
                setAddressLabel(responseJson.features[2].place_name)
            }).catch((error) => {
                console.error(error);
            });


    }

    const DONEUPDATE = () => {
        setLoading(true);
        const address_details = [
            {
                customer_address: AddressLabel,
                customer_device_id: deviceId,
                long: currentLongitude,
                lat:currentLatitude,
                landmark: landmark,
                location_category: 'Home'
               
     
               
            }
        ]

        console.log(JSON.stringify(address_details))
        fetch(URL + 'index.php/store_management/loadSaveAddress', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                address_details: address_details,
                mode: 'add'
            })
        }).then((response) => response.json())
            .then((json) => {

                console.log(json);
                
                setLoading(false);


            }).catch((error) => {
                console.error(error);
            });


    }

    function HeaderContent() {
        return (
            <>
                <View style={{ height: screenHeight / 2, backgroundColor: 'black' }}>
                    <MapboxGL.MapView style={{ flex: 1 }} onPress={(feature) => CoordinatesOnclick(feature.geometry.coordinates)} showUserLocation={true}>
                        <MapboxGL.Camera
                            defaultSettings={{
                                centerCoordinate: hereiam,
                                zoomLevel: 15,
                            }}
                        />

                        <MapboxGL.PointAnnotation
                            id='1'
                            coordinate={hereiam}


                        >


                        </MapboxGL.PointAnnotation>

                    </MapboxGL.MapView>

                    <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'white', padding: 5, }}>
                        <Text style={{ fontFamily: 'RalewayLight-m7nx', fontSize: 10 }}>Tap anywhere to set your address</Text>
                    </View>
                </View>



                <View style={{ padding: 20 }}>
                    <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 5, elevation: 10, width: '100%', }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon color={'#60D0A4'} size={20} name={'map-marker'} style={{ marginRight: 10 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Delivery Address</Text>
                            </View>
                            <View>

                            </View>


                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 10, }} >Address: {AddressLabel}</Text>

                        </View>
                        <View style={{ marginVertical: 10 }}>
                            <TextInput placeholder="Landmark*: Near Hotel"
                                onChangeText={(text) => setlandmark(text)}
                                value={landmark}
                                style={{ fontSize: 12, borderBottomWidth: 1 }}></TextInput>
                        </View>




                    </View>






                </View>


            </>
        )
    }





    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, }}>
                        <IconAnt name="arrowleft" size={20} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', left: 10 }}>
                        <Text style={{ fontSize: 12 }}>SETUP YOUR ADDRESS</Text>
                    </View>

                    <TouchableOpacity onPress={() => DONEUPDATE()} style={{ padding: 5, }}>
                        <Text style={{ color: '#EE1D52', fontSize: 12 }}>DONE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <ScrollView>
{ loading == true ? (

<View
    style={{
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#FFFAFC"
    }}
>
    <Image
        // resizeMode="cover"
        source={preloader}
        style={{
            width: 100,
            height: 100
        }}></Image>


</View>

) : (HeaderContent())}
                


            </ScrollView>

        </View>
    );
}


const style = StyleSheet.create({

    InputField: {
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 5,
        fontSize: 15,
        width: '100%',

    },
    container: {
        height: '100%',
        // width: SCREEN_WIDTH,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        padding: 16,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    deleteBox: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
    },
    title: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
    title2: { color: 'black', fontSize: 18 },
    title3: { color: 'black', fontSize: 15 },
    btnContainer: {
        backgroundColor: COLORS.primary,
        borderColor: 'transparent',
        borderWidth: 3,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        margin: 5
    },
    btnContainer2: {
        backgroundColor: 'transparent',
        borderColor: COLORS.primary,
        borderWidth: 1,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 5
    },
    btnContainer3: {
        backgroundColor: 'transparent',
        borderColor: COLORS.primary,
        borderWidth: 1,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 5
    },
});


export default AddAddress;
