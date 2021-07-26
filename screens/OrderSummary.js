import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert, Image} from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
// import preloader from '../assets/images/preloader.gif';`                     
const { width, height } = Dimensions.get("screen");
const cardWidth = width;
const cardHeight = height;

import DeviceInfo from 'react-native-device-info';
import preloader from '../assets/images/preloader.gif';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome5';
import URL from './UrlBased';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'ordering.db' });

import database from '../firebaseConfig'



const OrderSummary = ({ route, navigation }) => {
    const data = route.params;

    const [DeliveryData, setDeliveryData] = useState(data);
    const [orderData, setOrderData] = useState([]);
    const [custName, setName] = useState('');
    const [custNo, setMobile] = useState('');
    const [deviceId, setdeviceId] = React.useState('')
    const [currentDate, setCurrentDate] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [checkInternet, setcheckInternet] = useState(false);

    function LoadData() {

    
  setTimeout(async () => {
            
            let customerName;
            customerName = null;
            let custcontact;
            custcontact = null;
           
            try {

                customerName = await AsyncStorage.getItem('cust_name');
                custcontact = await AsyncStorage.getItem('cust_contact');
               
            } catch (e) {
                console.log(e);
            }

         
            console.log(customerName);
            setName(customerName)

            

            setMobile(custcontact)
     


        }, 500);







        DeviceInfo.getMacAddress().then((mac) => {
            // "E5:12:D8:E5:69:97"
            setdeviceId(mac)
            console.log(mac)
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT prod_id,prod_name,prod_price,prod_qty,prod_variant, prodstore_code FROM table_orders', [], (tx, results) => {

                var len = results.rows.length;

                if (len > 0) {

                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                        
                      setOrderData(temp);
                      console.log(temp);
                      setLoading(false)


                } else {
                    navigation.navigate('AllStore');
                }

            });
        });
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
           
            LoadData()
            // loadDateTime()
        });
        return unsubscribe;
    }, [navigation]);


    React.useEffect(() => {
        (async () => {

            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds

            setCurrentDate(
                year + '-' + month + '-' + date
            );

        })();

        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true)
            LoadData()
        });
        return unsubscribe;
    }, [navigation]);

    function deleteCart() {

        db.transaction((tx) => {
            tx.executeSql('DELETE FROM table_orders', [], (tx, results) => {
                console.log('Deleted')
               
            });
        });
    }

    function PlaceOrder() {
     

        setLoading(true)

        if (!custName) {
            alert('Customer Name is required');
            return;
        }
        if (!custNo) {
            alert('Customer Mobile number is required');
            return;
        }

        const address_details_array = [{
            order_date: currentDate,
            customer_device_id: deviceId,
            cusomer_name: custName,
            customer_contact: custNo,
            address_id: DeliveryData.customer_address_id,
            order: orderData,


        }];

        //console.log(JSON.stringify(address_details_array));


        fetch(URL + 'index.php/store_management/loadSaveOrder', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                order_details: address_details_array,

            })
        }).then((response) => response.json())
            .then((json) => {

                 console.log(json);



                // alert (json.msg)
                if (json.msg == 'success') {
                    database.ref('orderTracker/' + json.track_code + '_' + deviceId).set({

                        track_code: json.track_code,
                        status: 1
                        
                      });
                    deleteCart();
                    navigation.navigate('OrderHistory');
                    Alert.alert(
                       'Thank for your order!',
                       'Your order has been received 😊',

                       [
                        {
                            text: 'OK',
                            // onPress: () => DeleteOrder(),
                        },

                    ],

                   )

                } else {
                    setLoading(false)
                    alert('Order Processing Failed!')
                }

            }).catch((error) => {
                alert(error);
                console.error(error);
            });



    }


    function onLoadTotal() {
        var total = 0;

        const cart = orderData;

        for (var i = 0; i < cart.length; i++) {
            total = total + cart[i].prod_price * cart[i].prod_qty;
        }

        var deliveryCharge = total + 20;
        return deliveryCharge;
    }


    return (
        <View style={styles.container}>
        {loading == true ? (
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
        ) : 
    (
        <>
            <ScrollView>
                <View style={{ padding: SIZES.padding * 2 }}>
                    <View style={{ padding: SIZES.padding * 1, backgroundColor: 'white', borderRadius: 5, elevation: 10, width: '100%', height: 100 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon color={'#60D0A4'} size={20} name={'map-marker'} style={{ marginRight: 10 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Delivery address</Text>
                            </View>
                            <View>
                                <TouchableOpacity>
                                    <Icon color={'#60D0A4'} size={20} name={'pencil'} />
                                </TouchableOpacity>
                            </View>


                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 10, }} >Address: {DeliveryData.address}</Text>
                            <Text style={{ fontSize: 10, }}>Landmark: {DeliveryData.landmark}</Text>
                        </View>
                    </View>
                    <View style={{ padding: SIZES.padding * 1, backgroundColor: 'white', borderRadius: 5, elevation: 10, width: '100%', height: 100, marginTop: 10 }}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icons color={'#60D0A4'} size={20} name={'wallet'} style={{ marginRight: 10 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Payment Method</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>

                                <View style={{ flexDirection: 'row' }}>
                                    <Icons color={'#60D0A4'} size={15} name={'money-bill'} style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 10 }}>Cash on Delivery</Text>
                                </View>

                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>₱ {onLoadTotal()}.00</Text>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={{ padding: SIZES.padding * 1, backgroundColor: 'white', borderRadius: 5, elevation: 10, width: '100%', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icons color={'#60D0A4'} size={20} name={'receipt'} style={{ marginRight: 10 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Order summary</Text>
                            </View>

                        </View>
                        {/* Start Here */}
                        {orderData.map((item, i) => {
                            return (
                                <View style={{ marginTop: 10 }} key={i}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 12 }}>{item.prod_name}</Text>

                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.prod_qty} x {item.prod_price}.00</Text>
                                    </View>
                                </View>
                            )

                        })}

                        <View style={{ marginTop: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Total</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>₱ {onLoadTotal()}.00</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Delivery Fee</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Free Delivery</Text>
                            </View>
                        </View>

                    </View>
                    
                    

                </View>

            </ScrollView>

            <View style={[styles.footer, styles.footer2]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Total</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>₱ {onLoadTotal()}.00</Text>
                </View>
                <TouchableOpacity onPress={() => PlaceOrder()} style={{ padding: 15, backgroundColor: '#55CCAB', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 0, width: '100%' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>CONFIRM ORDER </Text>
                </TouchableOpacity>


            </View>
            </>
            )
            }
            
        </View>
    );

}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: "column",

        backgroundColor: '#f3f3f3'
    },

    boxs: {

        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    footer: {

        position: 'absolute',
    },
    footer2: {
        bottom: 0,
        width: cardWidth,
        height: cardHeight / 7,
        backgroundColor: 'white',
        elevation: 40,
        padding: 20

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

export default OrderSummary;
