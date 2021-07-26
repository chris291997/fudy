import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import URL from './UrlBased'
const SplashScreen = ({ navigation }) => {


    // let [storeInfo, setStoreInfo] = useState([])
    let [logo, setLogo] = useState('')
    let [storeName, setStoreName] = useState('');
    let [storeTagline, setstoreTagline] = useState('');
    let [checkInternet, setcheckInternet] = useState(false);

    // let logoLocation = storeInfo[0].location;

    // if (logoLocation = '') {

    // }else{
    //     setLogo(logoLocation);
    // }
    // let [logo, setLogo] = useState('')

    // console.log(logo);


    // useEffect(() => {



     

    // }, []);


    if (checkInternet == true) {
        setTimeout(async () => {
            // setIsLoading(false);

            let storeCode;
            storeCode = null;
            try {
                storeCode = await AsyncStorage.getItem('SubscribeStore');
            } catch (e) {
                console.log(e);
            }
            // console.log('Store Code: ', storeCode);

            if (storeCode !== null) {


                fetch(URL + 'index.php/store_management/loadstoredata?store_code=' + storeCode)
                    .then((response) => response.json())
                    .then((json) => {
                        //console.log(json);
                        //console.log(json.store_info[0].location)
                        //  setStoreInfo(json.store_info);
                        setLogo(json.store_info[0].location)
                        setStoreName(json.store_info[0].store_name)
                        setstoreTagline(json.store_info[0].store_tagline)
                        return json.store_info;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }








        }, 500);


        setTimeout(async () => {
            navigation.navigate('SubsSelectedStore');
        }, 1500);
}

    return (
        <InternetConnectionAlert
            onChange={(connectionState) => {

                console.log("Connection State: ", connectionState);


                if (connectionState.isConnected == true) {
                    setcheckInternet(true)

                }else{
                    setcheckInternet(false)
                }
            }}
        >
            {checkInternet == false ? (<View
                style={{
                    ...StyleSheet.absoluteFill,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ActivityIndicator size="large" color="#fffff" />
            </View>) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#433520' }}>
                    {logo = '' ? (null) : (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{ width: 120, height: 120, borderRadius: 20, marginBottom: 25 }}
                                source={{ uri: URL + logo }}
                            />
                            {/* <Text>{logo}</Text> */}
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>{storeName}</Text>
                            <Text style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>{storeTagline}</Text>
                        </View>
                    )}
                </View>
            )}

        </InternetConnectionAlert>
    );

}


export default SplashScreen;