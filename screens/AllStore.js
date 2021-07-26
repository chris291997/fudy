import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, TouchableWithoutFeedback, Animated, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import SearchFoods from '../assets/images/searchFood.png';
import StoreLogo from '../assets/images/1.png';
import orderhistory from '../assets/images/orderhistory1.png';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'ordering.db' });
import selectedStore from '../assets/images/select_Store.png';
import cart from '../assets/images/cart.png';
// import RNSimData from 'react-native-sim-data'
import preloader from '../assets/images/preloader.gif';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import URL from './UrlBased'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Settings from '../assets/images/settings.png';
const { width } = Dimensions.get("screen");
const cardWidth = width;
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';



// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}



const AllStore = ({ navigation }) => {

    const [restaurants, setRestaurants] = React.useState([]);
    let [searchData, setsearchData] = useState([]);

    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [yourName, setYourName] = React.useState('');
    const [availableRes, setAvailableRes] = React.useState('');
    const [eatingTime, setEattime] = React.useState('');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        LoadStores()
        loadDateTime()
        wait(2000).then(() => setRefreshing(false));
    }, []);

    function loadDateTime() {
        (async () => {

            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds

            // setCurrentDate(
            //     year + '-' + month + '-' + date
            // );

            // console.log(hours);
            setEattime(hours);

        })();
    }


    function LoadStores() {
        fetch(URL + 'index.php/store_management/loadGenStoredata',
            {
                method: 'GET',
            })
            .then((response) => response.json())
            .then((json) => {
                //     alert(JSON.stringify(json));
                //   console.log(json);
                // console.log(json.store_info[0].store_name);
                // setStoreName(json.store_info[0].store_name);
                // setrecommendedParentSubs(json.store_info)
                const countKey = Object.keys(json.store_info).length;
                console.log(countKey);

                setAvailableRes(countKey);

                setRestaurants(json.store_info)
                setsearchData(json.store_info)

                setLoading(false)
                return json;
            })
            .catch((error) => {
                // alert(JSON.stringify(error));
                console.error(error);

            });
    }



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true)
            LoadStores()
            loadDateTime()
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {

        setTimeout(async () => {
            LoadStores()
            loadDateTime()
            let custName;
            custName = null;
            try {

                custName = await AsyncStorage.getItem('cust_name');
            } catch (e) {
                console.log(e);
            }

            //   console.log('Your Name: ', custName);
            let fullname = custName;
            let firstWord = fullname.split(" ")[0];

            console.log(firstWord);
            setYourName(firstWord)

        }, 500);



        // db.transaction((tx) => {
        //     tx.executeSql('SELECT * FROM table_orders', [], (tx, results) => {

        //       var len = results.rows.length;

        //       if (len  > 0) {

        //            console.log(len)
        //            setCartTotal(len);
        //       }else{
        //         console.log(len)
        //         setCartTotal(0);
        //       }



        //     });
        //   });



    }, []);

    let searchAction = (text) => {
        const newData = searchData.filter(item => {
            const itemData = `${item.store_name.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        //console.log(newData);
        setRestaurants(newData);
    }

    function HeaderContent() {

        return (
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontFamily: 'RalewayBlackItalic-Yxg8', fontSize: 20 }}>Hello {yourName}! 😋</Text>
                        <Text style={{ width: '85%', fontFamily:'RalewayLight-m7nx' }}>{eatingTime < 10 ? 'Breakfast' : eatingTime <= 12 ? 'Lunch' : eatingTime <= 17 ? 'Snack' : 'Dinner'} Time? There are {availableRes} restaurants in your area.</Text>
                    </View>
                    {/* <View>
                    <TouchableOpacity >
                        <Image source={Settings} style={{ width: 70, height: 70, }} />
                    </TouchableOpacity>

                    </View> */}
                </View>
                <View
                    style={{
                        marginTop: 40,
                        flexDirection: 'row',
                        paddingHorizontal: 0,
                    }}>
                    <View style={style.inputContainer}>
                        <IconAnt name='search1' color='black' size={20} />
                        <TextInput onChangeText={text => searchAction(text)} placeholder='Search here' style={{ left: 10, fontFamily: 'Satisfy-Regular', fontSize: 15, color: 'rgba(52, 52, 52, 0.7)' }}></TextInput>
                    </View>

                </View>
            </View>
        )

    }
    const ViewStore = (item) => {
        // alert(item);
        navigation.navigate('SelectedStore', {
            StoreCode: item
        })

    }
    function StoreList() {

        const renderItem = ({ item }) => {
            let address = item.store_street + ' ' + item.store_brgy + ' ' + item.store_city + ' ' + item.store_province;
            let shortAdd = address.substring(0, 33)
            return (
                <View>
                    <TouchableOpacity onPress={() => ViewStore(item.store_code)}>
                        <View style={{ height: 90, marginTop: 40, flexDirection: 'row', }}>
                            <View style={{
                                elevation: 50, width: '23%', height: 90, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: URL + item.location }}
                                    style={{

                                        borderRadius: 20,
                                        width: 77,
                                        height: 77
                                    }}></Image>

                            </View>
                            <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.store_name} </Text>
                                <Text style={{ width: '70%',fontFamily:'RalewayLight-m7nx' }}>{address}...</Text>
                            </View>
                            {/* <View style={{ justifyContent: 'center', width: 50 }}>
                            <View style={{ width: 40, height: 40, borderWidth:1,borderColor:'#64D1A2', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={selectedStore} style={{ height: 18, width: 20 }}></Image>
                            </View>
                        </View> */}
                        </View>
                    </TouchableOpacity>
                </View>

            )
        }



        return (
            <View style={{marginBottom:100}}>

                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={restaurants}
                    // horizontal
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => `${item.store_code}`}
                    renderItem={renderItem}

                />
            </View>

        )
    }
    // let [cartTotal, setCartTotal] = useState(0)
    const [checkInternet, setcheckInternet] = useState(false);

    function refresh() {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_orders', [], (tx, results) => {

                var len = results.rows.length;

                if (len > 0) {

                    console.log(len)
                    setCartTotal(len);
                } else {
                    console.log(len)
                    setCartTotal(0);
                }




            });
        });
    }

    // function floationgButton2() {



    //     const CartBtn = () => {

    //         navigation.navigate('CartPage')
    //     }


    //     return (
    //         // <View style={{ padding: SIZES.padding * 2, }}>
    //         <View style={{ flex: 1, alignItems: 'center', }}>

    //             <View style={[style.floatContainer2, style.floatContainerBottom2]}>

    //                 <TouchableOpacity onPress={() => alert('test')}>
    //                     <Animated.View style={[style.button, style.menu2]}  >
    //                         <View style={{ backgroundColor: '#35A281', height: 18, width: 60, borderRadius: 5, position: 'absolute', bottom: 30, left: 25, justifyContent: 'center', alignItems: 'center', }}>
    //                             <Text style={{ textAlign: 'center', color: 'white', fontSize: 9 }}>My Cart</Text>
    //                         </View>

    //                         <Image
    //                             source={cart}
    //                             // resizeMode="cover"
    //                             style={{

    //                                 width: 20,
    //                                 height: 20
    //                             }}
    //                         />
    //                     </Animated.View>
    //                 </TouchableOpacity>
    //             </View>

    //         </View>

    //         // </View>
    //     )
    // }







    function floationgButton2() {



        const CartBtn = () => {

            navigation.navigate('CartPage')
        }


        return (
            // <View style={{ padding: SIZES.padding * 2, }}>
            <View style={{ flex: 1, alignItems: 'center', }}>

                <View style={[style.floatContainer2, style.floatContainerBottom2]}>

                    <TouchableWithoutFeedback onPress={CartBtn}>
                        <Animated.View style={[style.button, style.menu2]}  >
                            <View style={{ backgroundColor: '#35A281', height: 18, width: 60, borderRadius: 5, position: 'absolute', bottom: 30, left: 18, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 9 }}>My Cart</Text>
                            </View>

                            <Image
                                source={cart}
                                // resizeMode="cover"
                                style={{

                                    width: 20,
                                    height: 20
                                }}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>

            </View>

            // </View>
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
                <View style={{ backgroundColor:'white', flex: 1, padding: SIZES.padding * 2}}>
                    <SafeAreaView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, }}>
                                <IconAnt name="arrowleft" size={20} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', left: 10 }}>
                                <Text>RESTAURANTS NEAR YOU</Text>
                            </View>

                            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{ padding: 5, }}>
                                <IconAnt name="bars" style={{ color: '#EE1D52' }} size={25} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    {HeaderContent()}
                   
                    {StoreList()}

                    {/* {floationgButton3()} */}
                    {/* {floationgButton2()} */}



                </View>
            )
            }



        </InternetConnectionAlert>
    );

}


const style = StyleSheet.create({

    inputContainer: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor:"#f0f0f0",
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    sortBtn: {
        width: 50,
        height: 50,
        marginLeft: 10,

        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    floatContainer3: {
        alignItems: 'center',
        position: 'absolute',
    },
    floatContainerBottom3: {
        bottom: 160,
        right: 50
    },
    floatContainer2: {
        alignItems: 'center',
        position: 'absolute',
    },
    floatContainerBottom2: {
        bottom: 160,
        right: 50


    },
    secondary: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,

    },
    button: {
        position: 'absolute',
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60 / 2,
        shadowRadius: 10,
        shadowColor: '#58CDA9',
        shadowOpacity: 0.3,
        shadowOffset: { height: 10 },
        elevation: 15

    },
    menu: {
        backgroundColor: '#58CDA9'
    },
    menu2: {
        backgroundColor: '#ffff',
        borderColor: '#58CDA9',
        borderWidth: 2,
    }
});

export default AllStore;
