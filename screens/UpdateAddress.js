import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, TextInput } from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import MapboxGL from "@react-native-mapbox-gl/maps";
import DeviceInfo from 'react-native-device-info';
import URL from './UrlBased'


import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome5';
// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';


MapboxGL.setAccessToken('pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA');


const UpdateAddress = ({ route, navigation }) => {



    // Screen Size
    const { width, height } = Dimensions.get("screen");
    const cardWidth = width / 3;

    const screenWidth = width;
    const screenHeight = height;




    const data = route.params;

    const [deviceId, setdeviceId] = React.useState('')
    const [address_id, setaddressid] = React.useState('');
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

    React.useEffect(() => {
        DeviceInfo.getMacAddress().then((mac) => {
            setdeviceId(mac)
        });
        //  console.log();
        sethereiam([data.c_long, data.c_lat]);
        setAddressLabel(data.address);
        setlandmark(data.landmark);
        setaddressid(data.customer_address_id);

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
                // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.items[0].address.label));
                // console.log(responseJson.features[2].place_name);
                // setAddressLabel(responseJson.features[2].place_name)
                setAddressLabel(responseJson.features[2].place_name)
            }).catch((error) => {
                console.error(error);
            });


    }

    const DONEUPDATE = () => {

        const address_details = [
            {
                customer_address_id:address_id,
                customer_address: AddressLabel,
                customer_device_id: deviceId,
                long: currentLongitude,
                lat:currentLatitude,
                landmark: landmark,
                location_category: 'Home'
               
     
               
            }
        ]

        // console.log(JSON.stringify(address_details))
        fetch(URL + 'index.php/store_management/loadSaveAddress', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                address_details: address_details,
                mode: 'edit'
            })
        }).then((response) => response.json())
            .then((json) => {

                console.log(json);
        //         navigation.navigate('Login',
        // {
        //     address : addressLabel
        
        // })
        //         setLoading(false)

                // if (json.msg1 == '') {
                //     setVisible(false)
                //     refreshData();
                //     clearInputs();
                // }


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

                {HeaderContent()}


            </ScrollView>

        </View>
    );
}


export default UpdateAddress;
