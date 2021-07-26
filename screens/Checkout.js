import React, { Component, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Animated, ActivityIndicator, Image, SafeAreaView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import DeliveryBTN from '../assets/images/deliverBtn.png'

import preloader from '../assets/images/preloader.gif';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import URL from './UrlBased'

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'ordering.db' });


// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

const Checkout = ({ navigation }) => {

   const [myAddress, setmyAddress] = React.useState(null)
    let [deviceId, setdeviceId] = React.useState('')
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [checkInternet, setcheckInternet] = useState(false);
    const [dataRow, setDataRow] = useState(0);

    function LoadAddress() {
        DeviceInfo.getMacAddress().then((mac) => {
            // "E5:12:D8:E5:69:97"
            setdeviceId(mac)
            console.log(mac)


            if (mac != null) {
                fetch(URL + 'index.php/store_management/loadAddressRequest?customer_id=' + mac)
                    .then((response) => response.json())
                    .then((json) => {
                        console.log(json);


                        setmyAddress(json.address_info)
                        setLoading(false)


                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }

    function LoadBasket() {

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_orders', [], (tx, results) => {
      
              var len = results.rows.length;
      
              if (len  > 0) {
                    LoadAddress()
              }else{
               navigation.navigate('AllStore');
              }
      
            });
          });
        
    }


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true)
            LoadBasket()
        });
        return unsubscribe;
    }, [navigation]);



    

    const [addressIsTrue, setaddressIsTrue] = React.useState(false);
    const myAddressID = (data) => {

        // alert(JSON.stringify(data));

        navigation.navigate('OrderSummary', data)
    }

    const myAddressUpdate = (data) => {
        // setaddressIsTrue(false)
        // setVisible(true);
        // setaddressid(data.customer_address_id);
        // setHouseNO(data.house_no)
        // setStreet(data.street);
        // setBrgy(data.brgy);
        // setCity(data.city);
        // setProvince(data.province);
        // setLandMark(data.landmark);

        navigation.navigate('UpdateAddress', data)
    }

    const clearInputs = () => {
        setHouseNO('');
        setStreet('');
        setBrgy('');
        setCity('');
        setProvince('');
        setLandMark('');
    }
    const hideDialog = () => {
        alert('Your Data will not be saved')
        setVisible(false)
    };
    const addAddress = () => {
        setaddressIsTrue(true)
        setVisible(true);
        clearInputs();
    }

    ////////////addres Details//////////////////////////////
    const [address_id, setaddressid] = React.useState('');

    const [HouseNO, setHouseNO] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [brgy, setBrgy] = React.useState('');
    const [city, setCity] = React.useState('');
    const [province, setProvince] = React.useState('');
    const [landMark, setLandMark] = React.useState('');

    ///////////////////////////////////////////////////////

    function refreshData() {
        DeviceInfo.getMacAddress().then((mac) => {
            // "E5:12:D8:E5:69:97"
            setdeviceId(mac)
            console.log(mac)
        });

        console.log(deviceId);
        fetch(URL + 'index.php/store_management/loadAddressRequest?customer_id=' + deviceId)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setmyAddress(json.address_info)
                 setLoading(false)


            })
            .catch((error) => {
                console.error(error);
            });
    }

    const saveAddress = () => {
        const address_details = [
            {
                customer_device_id: deviceId,
                house_no: HouseNO,
                province: province,
                city: city,
                brgy: brgy,
                street: street,
                landmark: landMark,
                location_category: "Home",

                mode: 'add'
            }
        ]

        // if (!street) {
        //     alert('Please fill Street');
        //     return;
        // }
        // if (!brgy) {
        //     alert('Please fill Brgy');
        //     return;
        // }
        // if (!city) {
        //     alert('Please fill City');
        //     return;
        // }
        // if (!province) {
        //     alert('Please fill Province');
        //     return;
        // }
        // if (!landMark) {
        //     alert('Please fill Landmark');
        //     return;
        // }

        fetch(URL + 'index.php/store_management/loadSaveAddress', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                address_details: address_details


            })
        }).then((response) => response.json())
            .then((json) => {

                console.log(json.msg1);


                if (json.msg1 == '') {
                    setVisible(false)
                    refreshData();
                    clearInputs();
                }


            }).catch((error) => {
                console.error(error);
            });

        // alert (street + ' ' + brgy + ' ' + city + ' ' + province + ' ' + landMark);
    };

    const UpdateAddress = () => {



        const address_details = [
            {
                customer_address_id: address_id,
                customer_device_id: deviceId,
                house_no: HouseNO,
                province: province,
                city: city,
                brgy: brgy,
                street: street,
                landmark: landMark,
                location_category: "Home",
                mode: 'edit'
            }
        ]

        // alert (JSON.stringify(address_details));
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

                //console.log(json);
                setLoading(true)

                if (json.msg1 == '') {
                    setVisible(false)
                    refreshData();
                    clearInputs();
                }


            }).catch((error) => {
                console.error(error);
            });


    }


    function addressDirectory() {
        const renderItem = ({ item }) => {
           
            const leftSwipe = (progress, dragX) => {
                const scale = dragX.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                });
                return (
                    <TouchableOpacity onPress={() => myAddressUpdate(item)} activeOpacity={0.6}>
                        <View style={style.deleteBox}>
                            <Animated.Text style={{ transform: [{ scale: scale }], }}>
                                UPDATE
                      </Animated.Text>
                        </View>
                    </TouchableOpacity>
                );
            };

            return (


                <Swipeable renderLeftActions={leftSwipe}>
                    <TouchableOpacity onPress={() => myAddressID(item)}>
                        <View style={style.container}>
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: 'bold',}} >{item.address}</Text>
                                <Text style={{ marginTop: 10 }} >Landmark: {item.landmark == "" ? 'Not Set' : item.landmark}</Text>

                                <Text style={{ marginTop: 10, fontSize: 12, top: 10, fontStyle: 'italic' }}>➔ Swipe to update</Text>
                            </View>

                            {/* <View>
                                <Image 
                                source={DeliveryBTN}
                                style={{width:100, height:60}}
                                >
                                </Image>


                            </View> */}
                        </View>

                    </TouchableOpacity>
                </Swipeable>




            )
        }

        return (
            <View>



                <FlatList
                    data={myAddress}
                    keyExtractor={item => `${item.customer_address_id}`}
                    renderItem={renderItem}
                />



            </View>
        )
    }

    return (

        <InternetConnectionAlert
            onChange={(connectionState) => {

                //   console.log("Connection State: ", connectionState);


                if (connectionState.isConnected == true && connectionState.isInternetReachable == true) {

                    setcheckInternet(true)

                } else {
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
                <Text>To use this app , turn on Mobile data or Connect to Wi-Fi</Text>
            </View>) : loading == true ? (

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

            ) : (

        <Provider>
            <View style={{flex: 1, backgroundColor: "white"}}>
                <View style={{ padding: SIZES.padding * 2, }}>
                <SafeAreaView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, }}>
                                <IconAnt name="arrowleft" size={20} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', left: 10 }}>
                                <Text>SELECT ADDRESS</Text>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('AddAddress')} style={{ padding: 5, }}>
                                <IconAnt name="pluscircleo" style={{ color: '#EE1D52' }} size={25} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                </View>

                {addressDirectory()}

                {/* <View style={{}}> */}

                    {/* <TouchableOpacity activeOpacity={0.8}>
                        <View style={style.btnContainer}>
                            <Text style={style.title}>Add New Address</Text>

                        </View>

                    </TouchableOpacity> */}


                {/* </View> */}
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Address Details</Dialog.Title>
                        <Dialog.Content>
                            <TextInput placeholder="House No.#" style={style.InputField} value={HouseNO} onChangeText={(val) => setHouseNO(val)}  ></TextInput>
                            <TextInput placeholder="Street" style={style.InputField} value={street} onChangeText={(val) => setStreet(val)}  ></TextInput>
                            <TextInput placeholder="Brgy." style={style.InputField} value={brgy} onChangeText={(val) => setBrgy(val)}></TextInput>
                            <TextInput placeholder="City" style={style.InputField} value={city} onChangeText={(val) => setCity(val)}></TextInput>
                            <TextInput placeholder="Province" style={style.InputField} value={province} onChangeText={(val) => setProvince(val)}></TextInput>
                            <TextInput placeholder="Landmark" style={style.InputField} value={landMark} onChangeText={(val) => setLandMark(val)}></TextInput>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Cancel</Button>
                            {addressIsTrue == true ? (
                                <Button onPress={saveAddress}>Save Changes</Button>
                            ) : (<Button onPress={UpdateAddress}>Save Changes</Button>)}

                        </Dialog.Actions>
                    </Dialog>
                </Portal>




            </View>
        </Provider>

            )
            }
        </InternetConnectionAlert>
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
        marginVertical:2,
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

export default Checkout;