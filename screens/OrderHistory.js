import React, { Component, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import DeviceInfo from 'react-native-device-info';
import URL from './UrlBased'
import AsyncStorage from '@react-native-async-storage/async-storage';



// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';


const { width } = Dimensions.get("screen");
const cardWidth = width / 2;

const screenWidth = width;


const OrderHistory = ({ navigation }) => {

    const [Latest, setLatest] = useState([]);
    const [prevOrder, setprevOrder] = useState([]);
    const [deviceId, setdeviceId] = React.useState('')
    const [selectedTab, setselectedTab] = React.useState(0)


    useEffect(() => {
        DeviceInfo.getMacAddress().then((mac) => {
            setdeviceId(mac)


            fetch(URL + 'index.php/store_management/loadBasicActiveOrders?customer_device_id=' + mac)
                .then((response) => response.json())
                .then((json) => {
                    // console.log(json.store_info[0].store_name);
                    console.log(json.basic_order_info);
                    setLatest(json.basic_order_info);
                })
                .catch((error) => {
                    console.error(error);
                });





        });


    }, [])



    const FetchLatestOrder = () => {

        const renderItem = ({ item, i }) => {

            return (
                <View style={{ marginHorizontal: 5, width: screenWidth - 20 }}>
                    <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 5, marginTop: 10 }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.store_name}</Text>
                                    <Text style={{ fontStyle: 'italic', fontSize: 12 }}>Preparing your food. Your driver will pick it up...</Text>
                                </View>

                                <View>

                                    <Text style={{ fontStyle: 'italic', fontSize: 12, color: '#55CCAB' }}>#{item.track_code}</Text>

                                </View>

                            </View>
                            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end' }}>

                                <TouchableOpacity style={{ padding: 15, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#55CCAB', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 0, width: '30%' }} onPress={() => navigation.navigate('OrderStatus')}>
                                    <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>View Order </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View>
                <View style={{flexDirection: 'row',justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}> Active Orders </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{Latest.length}</Text>
                </View>
                <FlatList
                    data={Latest}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.track_code}`}
                    renderItem={renderItem}

                />

            </View>
        )

    }
    const ReorderItem = () => {

        navigation.navigate('CartPage')
    }


    const selectThis = (data) => {
        // alert(data)
        setselectedTab(data);
    }

    const ViewOrderDetails = (data) => {
       

         navigation.navigate('OrderStatus', data)


      
     } 
    const FetchprevOrder = () => {



        return (
            <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}> Previous Order </Text>

                <View style={{ padding: SIZES.padding * 1, backgroundColor: 'white', borderRadius: 5, elevation: 10, width: '100%', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>




                        <View style={{ flexDirection: 'row', }}>
                            <View>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: 'http://192.168.1.4/dev_tech/admin/resources/store_logo/2021-03-14240.jpeg' }}
                                    style={{

                                        borderRadius: 10,
                                        width: 77,
                                        height: 77
                                    }}>

                                </Image>

                            </View>

                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text>Lumpiang Shanghai</Text>
                                <Text>Seller: BreakFast Republik</Text>
                            </View>

                        </View>

                        <View>
                            <Text>₱ 150.00</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{ padding: 15, marginHorizontal: 10, backgroundColor: '#55CCAB', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 0, width: '30%' }} onPress={() => ReorderItem()}>
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>ORDER AGAIN </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 15, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#55CCAB', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 0, width: '30%' }}>
                            <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>RATE </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }

    function CustomTabs() {
        return(
            <>
                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => selectThis(0)} style={{
                        marginHorizontal:20,
                        padding:10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: (selectedTab == 0) ? COLORS.primary : COLORS.white,
                         }}>
                        <Text style={{
                             color: (selectedTab == 0) ? COLORS.white : COLORS.black,
                        }}> Active Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectThis(1)} style={{
                         padding:10,
                         borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                         backgroundColor: (selectedTab == 1) ? COLORS.primary : COLORS.white,
                    }}>
                        <Text
                        style={{
                            color: (selectedTab == 1) ? COLORS.white : COLORS.black,
                        }}> Previous Orders</Text>
                    </TouchableOpacity>
                </View>

            </>
        )
    }


    function ActiveOrders() {
        const renderItem = ({ item, i }) => {

            return (
                <View style={{ marginHorizontal: 5, width: screenWidth - 20 }}>
                    <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 5, marginTop: 10 }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.store_name}</Text>
                                    <Text style={{ fontStyle: 'italic', fontSize: 12 }}>Preparing your food. Your driver will pick it up...</Text>
                                </View>

                                <View>

                                    <Text style={{ fontStyle: 'italic', fontSize: 12, color: '#55CCAB' }}>#{item.track_code}</Text>

                                </View>

                            </View>
                            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end' }}>

                                <TouchableOpacity style={{ padding: 15, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#55CCAB', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 0, width: '30%' }} 
                                 onPress={() => ViewOrderDetails(item)}>
                                    <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>View Order </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <>
                <FlatList
                    data={Latest}
                    vertical
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => `${item.track_code}`}
                    renderItem={renderItem}

                />
            </>
        )
    }



    return (
        <View style={{ flex: 1, padding: 10, }}>
           <SafeAreaView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, }}>
                                <IconAnt name="arrowleft" size={20} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', left: 10 }}>
                                <Text>YOUR ORDERS</Text>
                            </View>

                            <TouchableOpacity  style={{ padding: 5, }}>
                               {/* <Text style={{ color: '#EE1D52' }}>EMPTY CART</Text> */}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
            {CustomTabs()}

            {selectedTab == 0 ? ActiveOrders() : null}

        </View>
    );

}

export default OrderHistory;
