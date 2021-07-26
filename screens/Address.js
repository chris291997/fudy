// @refresh reset
import React, { useState, useEffect } from 'react';
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
    ImageBackground,
    ActivityIndicator,
    LogBox
} from 'react-native';
import Maps from '../assets/images/mapbg.png'
import preloader from '../assets/images/preloader.gif';
const { width, height } = Dimensions.get("screen");
const cardWidth = width;
const cardHeight = height;
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from "@react-native-mapbox-gl/maps";
import DeviceInfo from 'react-native-device-info';
import URL from './UrlBased'
MapboxGL.setAccessToken('pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA');

const Address = ({navigation}) => {

    // Sample reverse geocode
    //https://api.mapbox.com/geocoding/v5/mapbox.places/123.73466703361076,%2013.149309903575801.json?access_token=pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA



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

    const [addressLabel, setAddressLabel] = useState('');
    const [hereiam,sethereiam] = React.useState([]);
    const [street, setStreet] = React.useState('');
    const [brgy, setBrgy] = React.useState('');
    const [city, setCity] = React.useState('');
    const [province, setProvince] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [deviceId, setdeviceId] = React.useState('')

    useEffect(() => {


        DeviceInfo.getMacAddress().then((mac) => {
            setdeviceId(mac)
        });

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
    LogBox.ignoreLogs(["Warning: Each", "Warning: Failed"]);
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
                sethereiam([currentLongitude,currentLatitude]);

                setLoading(false)
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {
                //Will give you the location on location change

              
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
                sethereiam([currentLongitude,currentLatitude]);
                setLoading(false)
        
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


    if(currentLatitude != '...' && currentLongitude != '...') {

        console.log(currentLatitude + ',' + currentLongitude)


        // fetch('https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=IGxBk0Q6Dc0zeWhE6GrFxb5zrNPAhC55b7LVPBF57EI&at=' + currentLatitude + ',' + currentLongitude + '&lang=en-US')
        
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + currentLongitude  + ',' + currentLatitude + '.json?access_token=pk.eyJ1IjoiYnJiaTIwMjAiLCJhIjoiY2tvZjVpaXlyMGJ6YjJvbGE5ZmV5MmIxNyJ9.pmGECD9ozlFY8m2J1e9LUA')
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.items[0].address.label));
            console.log(responseJson.features[2].place_name);
            setAddressLabel(responseJson.features[2].place_name)
            // const Fetch_Street = responseJson.items[0].address.street;
            // const Fetch_brgy = responseJson.items[0].address.district;
            // const Fetch_city = responseJson.items[0].address.city;
            // const Fetch_province = responseJson.items[0].address.county;
            // setAddressLabel(Fetch_Street + ' ' + Fetch_brgy + ' ' + Fetch_city + ' ' + Fetch_province);

            // console.log(Fetch_Street + ' ' + Fetch_brgy + ' ' + Fetch_city + ' ' + Fetch_province )

        }).catch((error) => {
            console.error(error);
        });
    }





    const GotoLogin = () => {
        // navigation.navigate('Login',
        // {
        //     address : addressLabel
        
        // })

        setLoading(true)


        const address_details = [
            {
                customer_address: addressLabel,
                customer_device_id: deviceId,
                long: currentLongitude,
                lat:currentLatitude,
                landmark: '',
                location_category: 'Home'
               
     
               
            }
        ]

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
                navigation.navigate('Login',
        {
            address : addressLabel
        
        })
                setLoading(false)

                // if (json.msg1 == '') {
                //     setVisible(false)
                //     refreshData();
                //     clearInputs();
                // }


            }).catch((error) => {
                console.error(error);
            });

    }

    const ClickLocation = (data) => {
        console.log(data)
        sethereiam(data)

        /// Need didi mag fetch san Country tas Region kung outside country ang inselect no no no hahaha
    }




    return (
        <>
        {
            loading == true ? (
                <View
                    style={{
                        ...StyleSheet.absoluteFill,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: "#FFFAFC"
                    }}
                >
                    <Image
                        // resizeMode="cover"
                        source={preloader}
                        style={{
                            width: 100,
                            height: 100
                        }}></Image>
                        <Text>We are getting your location..</Text>


                </View>

            ) : ( <View style={styles.page}>
            <MapboxGL.MapView style={styles.map} showUserLocation={true}>
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

            
            <View style={[styles.top, styles.top2]}>
                    <Icon name="map-marker" size={20} color={'#EE1D52'}>

                    </Icon>
                   {addressLabel == '' ? (<Text style={{ marginLeft: 10, fontSize: 15 }}>....</Text>) : (<Text style={{ marginLeft: 10, fontSize: 12 }}>{addressLabel}</Text>)} 
                </View>

            <View style={[styles.footer, styles.footer2]}>
                <View >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Bicol Fuds uses your location to show nearby restaurant around you!</Text>
                    <TouchableOpacity onPress={() => GotoLogin()} style={{ padding: 10, backgroundColor: '#EE1D52', justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginBottom: 0 }}>
                        <Text style={{ color: '#fff', fontSize: 15 }}>Use Current Location </Text>
                    </TouchableOpacity>
                   
                </View>
            </View>


        </View>)
        }
       
        </>
    );

}

const styles = StyleSheet.create({
    page: {
        flex: 1,

    },

    map: {
        flex: 1
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
        height: 150,
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
        top: 0,
        height: cardHeight / 14,
        width: cardWidth,
        backgroundColor: 'white',
        elevation: 40,
        padding: 20,
        flexDirection: 'row',

    },

});

export default Address;
