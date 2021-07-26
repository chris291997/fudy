import React, { Component, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { RadioButton, Paragraph, } from 'react-native-paper'
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { openDatabase } from 'react-native-sqlite-storage';
import URL from './UrlBased';
import preloader from '../assets/images/preloader.gif';
import InternetConnectionAlert from "react-native-internet-connection-alert";
var db = openDatabase({ name: 'ordering.db' });

const ProductDetails = ({ route, navigation }) => {
    const [checked, setChecked] = React.useState(0);
    let [flatListItems, setFlatListItems] = useState([]);
    const [priceChange, setpriceChange] = React.useState(0);
    const [priceChangeName, setpriceChangeName] = React.useState('')
    const [loading, setLoading] = React.useState(true);
    const [checkInternet, setcheckInternet] = useState(false);
    const [asyncStoreCode, setasyncStoreCode] = useState(null)


    useEffect(() => {
        console.log(data);


        fetch(URL + 'index.php/store_management/loadStoreProductPricing?product_id=' + data.store_product_id)
            .then((response) => response.json())
            .then((json) => {
                //  console.log(json);
                let sizeData = json.product_pricing;
                sizeData.sort((a, b) => a.store_product_price - b.store_product_price);
                // console.log(sizeData[0].store_product_price);
                setpriceChange(sizeData[0].store_product_price);
                setpriceChangeName(sizeData[0].store_pricing_name);
                setFlatListItems(sizeData);
                setLoading(false)


                // console.log(sizeData)






                //  console.log(json.product_pricing);


            })
            .catch((error) => {
                console.error(error);
            });



        (async () => {

            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds

            // setCurrentDateTime(
            //     year + '-' + month + '-' + date
            //     + ' ' + hours + ':' + min + ':' + sec
            // );

            setCurrentDate(
                year + '-' + month + '-' + date
            );

            let storeCode;
            storeCode = null;
            try {
                storeCode = await AsyncStorage.getItem('SubscribeStore');
            } catch (e) {
                console.log(e);
            }
            setasyncStoreCode(storeCode);

        })();

    }, []);
    const [currentDate, setCurrentDate] = useState('');
    const data = route.params;
    // console.log(JSON.stringify(data.store_code))
    // let [details, setDetails] = useState(item);

    // console.log(data.store_product_id);

    function GotoWebsite(data) {
        const dataDetail = JSON.stringify(data);
        // alert(dataDetail);
        // console.log(dataDetail);

        navigation.navigate('WebViewData');

    }

    let [qty, setQty] = useState(1)
    // let [totalAmount, setTotalAmount] = useState(0)

    function sumOrder() {
        if (qty < 1) {
            return priceChange
        } else {
            let total = qty * priceChange

            return total.toFixed(2)
        }

    }

    function editOrder(action) {
        if (action == "-") {
            setQty(qty - 1);
        } else {
            setQty(qty + 1);
        }
    }



    const CartBtn = () => {
        if(asyncStoreCode == null){
            navigation.navigate('CartPage')
        }else{
            navigation.navigate('subsCartPage')
        }
       
    }
  


    let addCart_db = () => {
        let total = qty * priceChange
        // alert(total + "=" + data.price + "*" + qty);
        
        const DeleteOrder = () => {

            db.transaction((tx) => {
                tx.executeSql('DELETE FROM table_orders', [], (tx, results) => {
                   
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'INSERT INTO table_orders (prod_id, prod_name, prod_qty, prod_variant, prod_price, prod_total, prod_photo, prod_seller,prodstore_code, order_date) VALUES (?,?,?,?,?,?,?,?,?,?)',
                            [data.store_product_id, data.store_product_name, qty, priceChangeName, priceChange, total, data.location, data.store_name, data.store_code, currentDate],
                            (tx, results) => {
                                console.log('Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {
                                    Alert.alert(
                                        'Success',
                                        'Product Successfully Added to Cart',
                                        [
                                            {
                                                text: 'Ok',
                                                onPress: () => CartBtn(),
                                            },
                                        ],
                                        { cancelable: false },
                                    );
                                } else alert('Failed');
                            },
                        );
                    });
                   
                });
            });
        }


        if (total == 0) {
        } else {

            //Checking
            db.transaction(function (tx) {
                tx.executeSql(
                    'SELECT * FROM table_orders',
                    [],
                    (tx, results) => {
                        
                        var len = results.rows.length;

                        if (len <= 0) {
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'INSERT INTO table_orders (prod_id, prod_name, prod_qty,prod_variant, prod_price, prod_total, prod_photo, prod_seller,prodstore_code, order_date) VALUES (?,?,?,?,?,?,?,?,?,?)',
                                    [data.store_product_id, data.store_product_name, qty, priceChangeName, priceChange, total, data.location, data.store_name, data.store_code, currentDate],
                                    (tx, results) => {
                                        console.log('Results', results.rowsAffected);
                                        if (results.rowsAffected > 0) {
                                            Alert.alert(
                                                'Success',
                                                'Product Successfully Added to Cart',
                                                [
                                                    {
                                                        text: 'Ok',
                                                        onPress: () => CartBtn(),
                                                    },
                                                ],
                                                { cancelable: false },
                                            );
                                        } else alert('Failed');
                                    },
                                );
                            });
                        }else{
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'SELECT prodstore_code FROM table_orders WHERE prodstore_code = ? LIMIT 1',
                                    [data.store_code],
                                    (tx, results) => {
                                        
                                        var len = results.rows.length;
                
                                        if (len  > 0) {

                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    'INSERT INTO table_orders (prod_id, prod_name, prod_qty,prod_variant, prod_price, prod_total, prod_photo, prod_seller,prodstore_code, order_date) VALUES (?,?,?,?,?,?,?,?,?,?)',
                                                    [data.store_product_id, data.store_product_name, qty, priceChangeName,priceChange, total, data.location, data.store_name, data.store_code, currentDate],
                                                    (tx, results) => {
                                                        console.log('Results', results.rowsAffected);
                                                        if (results.rowsAffected > 0) {
                                                            Alert.alert(
                                                                'Success',
                                                                'Product Successfully Added to Cart',
                                                                [
                                                                    {
                                                                        text: 'Ok',
                                                                        onPress: () => CartBtn(),
                                                                    },
                                                                ],
                                                                { cancelable: false },
                                                            );
                                                        } else alert('Failed');
                                                    },
                                                );
                                            });
                
                                        }else{
                                            
                                            Alert.alert(
                                                'Message',
                                                'You have already selected different restaurant. If you continue your cart and selection will be removed.',
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => alert('Cancel'),
                                                    },
                                                    {
                                                        text: 'Continue',
                                                        onPress: () => DeleteOrder(),
                                                    },
                                                ],
                                                { cancelable: false },
                                            );

                
                                        }
                                        
                
                
                
                
                                    },
                                );
                            });
                        }
                        




                    },
                );
            });




          






             
        }




    }
    function rb(i, cat, prc) {
       
        //let rbutton = flatListItems[i].prodID;

        setChecked(i)
        setpriceChange(prc)
        setpriceChangeName(cat)
        // alert(prc + cat)


        //alert(rbutton);
        //  setpriceChange(prc);
        //  setChecked(true);


    }

    function SizesSelection() {
        return (
            <View style={{}}>
                {flatListItems.map((item, i) => {
                    return (
                        <View
                            key={i}
                            style={{ marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <RadioButton
                                    value="first"
                                    status={checked === i ? 'checked' : 'unchecked'}
                                    onPress={() => rb(i, item.store_pricing_name, item.store_product_price)}
                                />
                                <Paragraph style={{ paddingTop: 5, fontWeight: 'bold' }}>{item.store_pricing_name}</Paragraph>
                            </View>

                            <View>
                                <Paragraph style={{ paddingTop: 5, fontWeight: 'bold' }}>{item.store_product_price}.00</Paragraph>
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    function HeaderContent() {
        return (
            <>
                <View>
                    <View style={{ height: SIZES.height * 0.35 }}>
                        <Image
                            source={{ uri: URL + data.location }}
                            resizeMode="cover"
                            style={{
                                width: SIZES.width,
                                height: "100%"
                            }}
                        />


                        <View
                            style={{
                                position: 'absolute',
                                bottom: - 20,
                                width: SIZES.width,
                                height: 50,
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >

                            {qty == 1 ? (<TouchableOpacity
                                style={{
                                    width: 50,
                                    backgroundColor: COLORS.white,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: 25,
                                    borderBottomLeftRadius: 25
                                }}

                            >
                                <Text style={{ ...FONTS.body1 }}>-</Text>
                            </TouchableOpacity>) : (<TouchableOpacity
                                style={{
                                    width: 50,
                                    backgroundColor: COLORS.white,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: 25,
                                    borderBottomLeftRadius: 25
                                }}
                                onPress={() => editOrder("-")}
                            >
                                <Text style={{ ...FONTS.body1 }}>-</Text>
                            </TouchableOpacity>)}

                            <View
                                style={{
                                    width: 50,
                                    backgroundColor: COLORS.white,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ ...FONTS.h2 }}>{qty}</Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    width: 50,
                                    backgroundColor: COLORS.white,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopRightRadius: 25,
                                    borderBottomRightRadius: 25
                                }}
                                onPress={() => editOrder("+")}
                            >
                                <Text style={{ ...FONTS.body1 }}>+</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View
                        style={{
                            width: SIZES.width,
                            alignItems: 'center',
                            marginTop: 15,
                            paddingHorizontal: SIZES.padding * 2
                        }}
                    >
                        <Text style={{ marginVertical: 10, textAlign: 'center', ...FONTS.h2 }}>{data.store_product_name} </Text>

                    </View>


                </View>



            </>
        );
    }

    function BodyContent() {
        return (
            <>
                <View style={{ padding: SIZES.padding * 2 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Details </Text>
                    <Text>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies,
                 purus lectus malesuada libero, sit amet commodo magna eros quis urna.</Text>


                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Image
                                source={{ uri: URL + data.logo }}
                                resizeMode="cover"
                                style={{
                                    borderRadius: 5,
                                    width: 50,
                                    height: 50
                                }}
                            />
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={{ fontWeight: 'bold' }}>{data.store_name}</Text>
                            {/* <View style={{ flexDirection: 'row' }}>
                                <Text>Know more? Click</Text>
                                <TouchableOpacity onPress={() => GotoWebsite(data.id)}>
                                    <Text style={{ color: '#58CDA9' }}> Here</Text>
                                </TouchableOpacity>
                            </View> */}

                        </View>
                    </View>


                </View>

                {SizesSelection()}

            </>

        );
    }

    function FooterContent() {
        return (


            <View
                style={{ top: 30 }}

            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: SIZES.padding * 2,
                        paddingHorizontal: SIZES.padding * 3,

                    }}
                >
                    <Text style={{ ...FONTS.h3 }}>{qty} items in Cart</Text>
                    <Text style={{ ...FONTS.h3 }}>{sumOrder()}</Text>
                </View>




                <View
                    style={{
                        padding: SIZES.padding * 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: SIZES.width * 0.9,
                            padding: SIZES.padding,
                            backgroundColor: COLORS.primary,
                            alignItems: 'center',
                            borderRadius:10
                        }}

                        onPress={addCart_db}

                    >
                        <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
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
            </View>
            ) : loading == true ? (

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
                </View>

            ) : (
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: '#F5F5F6', paddingBottom: 20 }}>

                        {HeaderContent()}
                        {BodyContent()}
                        {FooterContent()}

                    </View>
                </ScrollView>
                )
            }

        </InternetConnectionAlert>
    )
}


export default ProductDetails;

