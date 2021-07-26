import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity, Image, FlatList, Dimensions, Alert, ActivityIndicator } from 'react-native';
import StoreBtn from '../assets/images/store.png';
import StarRatings from '../assets/images/star.png';
import orderhistory from '../assets/images/orderhistory1.png';
import userprofile from '../assets/images/userprof.png';
import { SearchBar } from "../components";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cart from '../assets/images/cart.png';
import time from '../assets/images/time.png';
import location from '../assets/images/location.png';
import call from '../assets/images/call.png';
import Communications from 'react-native-communications';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import { openDatabase } from 'react-native-sqlite-storage';
import { set } from 'react-native-reanimated';
import preloader from '../assets/images/preloader.gif';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import URL from './UrlBased'
// import AsyncStorage from '@react-native-async-storage/async-storage';

var db = openDatabase({ name: 'ordering.db' });
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 40;



const SelectedStore = ({ navigation }) => {


    const [asyncStoreCode, setasyncStoreCode] = useState(null)

   
    React.useEffect( () => {
        setTimeout(async () => {
            // setIsLoading(false);

            let storeCode;
            storeCode = null;
            try {
                storeCode = await AsyncStorage.getItem('SubscribeStore');
            } catch (e) {
                console.log(e);
            }
            setasyncStoreCode(storeCode);
            // console.log('Store Code: ', storeCode);

            if (storeCode !== null) {

                fetch(URL + 'index.php/store_management/loadstorebasicdata?store_code=' + storeCode)
                    .then((response) => response.json())
                    .then((json) => {
                        console.log(json);
                        setStoreName(json.store_info[0].store_name);
        setLogo(json.store_info[0].logo);
        setstoreAddress(json.store_info[0].address);
        setrecommendedParentSubs(json.store_info)
        setRestaurants(json.store_info)
        setCategories(json.store_category);

        const rerenderData = [
            {
                prodDetail: json.store_info
            }
        ]

        setCatdata(rerenderData)
        setLoading(false)
                        
                        return json.store_info;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }








        }, 500);
    }, []);

    // const [selectedStore, setSelectedStore] = useState(StoreCode)
    
    let [storeName, setStoreName] = useState('')
    let [storeAddress, setstoreAddress] = useState('')
    let [storeLogo, setLogo] = useState('')
    let [cartTotal, setCartTotal] = useState(0)
    const [loading, setLoading] = React.useState(true);
    const [checkInternet, setcheckInternet] = useState(false);




    useEffect(() => {

        setTimeout(async () => {
            // refresh();

        
            db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='table_orders'",
                    [],
                    function (tx, res) {
                        // console.log('item:', res.rows.length);
                        console.log('Drop ang table orders');
                        if (res.rows.length == 0) {

                            txn.executeSql('DROP TABLE IF EXISTS table_orders', []);
                            txn.executeSql(
                                'CREATE TABLE IF NOT EXISTS table_orders(order_id INTEGER PRIMARY KEY AUTOINCREMENT, prod_id VARCHAR(255),prod_name VARCHAR(255), prod_qty VARCHAR(255), prod_price VARCHAR(255),prod_variant VARCHAR(255),prod_total VARCHAR(255), prod_photo VARCHAR(455), prod_seller VARCHAR(255), prodstore_code VARCHAR(255),order_date VARCHAR(255))',
                                []
                            );
                        }
                    }
                );
            });



        }, 500);



    }, []);


    const [categories, setCategories] = React.useState([])
    const [recommendedParentSubs, setrecommendedParentSubs] = React.useState([])
    const [selectedCategory, setSelectedCategory] = React.useState(null)
    const [restaurants, setRestaurants] = React.useState([])

    const [catdata, setCatdata] = React.useState(null)


    function onSelectCategory(category) {

        const data = catdata[0].prodDetail;
      


        const restaurantList = data.filter(item => {
            const itemData = `${item.store_product_cat_id}`;
            const textData = category.category_id;
            return itemData.indexOf(textData) > -1;
        })

        setRestaurants(restaurantList)


        setSelectedCategory(category.category_id)

        // alert(category+ ' '+ JSON.stringify(restaurantList))


        // alert(category.name)
    }

    function GotoDetails(data) {
        const dataDetail = JSON.stringify(data);
        // alert(dataDetail);
        // console.log(dataDetail);

        navigation.navigate('ProductDetails', data);

    }
    // function HeaderContent() {
    //     return (
    //         <View style={{ padding: SIZES.padding * 2, }}>
    //             {/* <SearchBar /> */}

               

                
              


    //             <View>
    //                 {/* {renderRecommended()} */}
    //                 {renderMainCategories()}
    //             </View>

    //         </View>
    //     );
    // }

    function renderRecommended() {
        const renderItem = ({ item }) => {
            let address = item.address;
            let shortAdd = address.substring(0, 20)
            return (
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 25, width: 260, height: 290, marginHorizontal: 10 }} onPress={() => GotoDetails(item)} >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View>
                            <Image
                                source={{ uri: URL + item.location }}
                                resizeMode="cover"
                                style={{
                                    borderRadius: 20,
                                    width: 260,
                                    height: 150
                                }}
                            />
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', ...FONTS.h2 }}>{item.store_product_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ paddingHorizontal: 10 }}>
                                <Image
                                    source={{ uri: URL + item.logo }}
                                    // resizeMode="cover"
                                    style={{
                                      
                                        borderRadius: 5,
                                        width: 50,
                                        height: 50
                                    }}
                                />
                            </View>
                            <View>
                                <Text>{item.store_name}</Text>
                                <Text style={{ width: 300 }}>{shortAdd}...</Text>
                            </View>
                        </View>
                        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image source={StarRatings} style={{ width: 15, height: 15, paddingTop: 3, marginRight: 5 }} />
                                <Text>{item.rates}</Text>
                            </View>
                            <View>
                                <Text>Php.{item.pricedata}.00</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: SIZES.padding * 2, }}>
                <Text style={{ ...FONTS.h3, fontWeight: 'bold', marginTop: 20, paddingVertical: 20 }}>Recommended For You</Text>
                <FlatList
                    data={recommendedParentSubs}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.store_product_id}`}
                    renderItem={renderItem}

                />
            </View>
        )




    }

    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                        backgroundColor: (selectedCategory == item.category_id) ? COLORS.primary : COLORS.white,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SIZES.padding,
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >


                    <Text
                        style={{
                            marginTop: SIZES.padding,
                            color: (selectedCategory == item.category_id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                        }}
                    >
                        {item.category_name}
                    </Text>
                </TouchableOpacity>
            )
        }




        return (
            <View >
                <Text style={{ ...FONTS.h3, fontWeight: 'bold', marginTop: 20, paddingVertical: 20 }}>Menu Categories</Text>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.category_id}`}
                    renderItem={renderItem}

                />
            </View>
        )
    }

    function renderRestaurantList() {
        const renderItem = ({ item }) => {
            let storeName = item.store_name;
            let shortName = storeName.substring(0, 9)

            let prodName = item.store_product_name;
            let shortprodName = prodName.substring(0, 20)

            // console.log(prodName.length)
            return (

                <View
                    //   key={item.store_code}
                    style={{ padding: SIZES.padding * 2,}}>

                    <TouchableOpacity style={{
                        backgroundColor: 'white',
                        height: 220,
                        width: cardWidth,
                        borderRadius: 20,
                        // marginHorizontal: 10,
                        marginBottom: 10,
                        marginTop: 50,
                        elevation: 5,

                    }}
                        onPress={() => GotoDetails(item)}
                    >
                        <View style={{ alignItems: 'center', top: -40 }}>
                            <Image source={{ uri: URL + item.location }} style={{ height: 120, width: 120, borderRadius: 80 }} />
                        </View>

                        <View style={{ alignItems: 'center', top: -15, padding: 10 }}>
                            {prodName.length < 15 ? (<Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', }}>{prodName}</Text>)
                                : (<Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', }}>{shortprodName}...</Text>)}


                            <Text style={{ fontSize: 13, color: '#58CDA9' }}>{item.pricedata}.00</Text>

                        </View>

                     

                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View>
                <SafeAreaView style={{padding: SIZES.padding * 2,}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                           <View>
                           <Image
                            source={{ uri: URL + storeLogo }}
                            // resizeMode="cover"
                            style={{
                                borderRadius: 20,
                                width: 50,
                                height: 50

                            }}
                        />
                           </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{  fontFamily: 'Roboto-Black'}}>{storeName}</Text>
                                {/* <Text style={{fontFamily: 'RalewayLight-m7nx'}}>{StoreCode}</Text> */}
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('AllStore')} style={{ padding: 5, }}>
                                <IconFontisto name="shopping-store" style={{ color: '#EE1D52' }} size={25} />
                            </TouchableOpacity>
                        </View>
                        {renderMainCategories()}
                </SafeAreaView>


                <FlatList
                   
                    data={restaurants}
                    // horizontal
                    // showsHorizontalScrollIndicator={false}
                    numColumns={2}
                    keyExtractor={item => `${item.store_product_id}`}
                    renderItem={renderItem}

                />

            </View>
        )
    }




    // para sa fab
    const toggleOpen = () => {

        alert('ok')



    };
    const closeFAB = () => {
        setopentToggle(1);

        toggleOpen();

    }




    function floationgButton2() {



        const CartBtn = () => {
            if(asyncStoreCode == null){
                navigation.navigate('CartPage')
            }else{
                navigation.navigate('subsCartPage')
            }
           
        }


        return (
            // <View style={{ padding: SIZES.padding * 2, }}>
            <View style={{ flex: 1, alignItems: 'center', }}>

                <View style={[styles.floatContainer2, styles.floatContainerBottom2]}>

                    <TouchableWithoutFeedback onPress={CartBtn}>
                        <Animated.View style={[styles.button, styles.menu2]}  >
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
                <SafeAreaView style={styles.container}>
                    <View style={{ marginBottom:100}}>
                        {renderRestaurantList()}
                    </View>

                    <View>
                        {floationgButton2()}
                    </View>
                </SafeAreaView>

            )

            }
        </InternetConnectionAlert>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F6'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },

    floatContainer: {
        alignItems: 'center',
        position: 'absolute',
    },
    floatContainerBottom: {
        bottom: 200,
        right: 60
    },
    floatContainer2: {
        alignItems: 'center',
        position: 'absolute',
    },
    floatContainerBottom2: {
        bottom: 350,
        right: 60
    },
    secondary: {
        width: 45,
        height: 45,
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

})




export default SelectedStore;
