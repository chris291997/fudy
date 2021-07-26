import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions,ScrollView } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import Back from '../assets/images/backBtn.png';
import Icon from 'react-native-vector-icons/AntDesign';
import preparing from '../assets/images/Food_Preparing.gif';
import Pending from '../assets/images/Food_pending.gif';
import Ondeliver from '../assets/images/ondeliver.gif';
import Delivered from '../assets/images/Delivered.gif';
import DeviceInfo from 'react-native-device-info';
import URL from './UrlBased'

import Icons from 'react-native-vector-icons/FontAwesome5';
const OrderStatus = ({ navigation, route }) => {
    function RefreshStatus() {
        const Orders = [{
            status: 3
        }]

        setOrderStatus(Orders[0].status);
    }


    const data = route.params;
    const [orderStatus, setOrderStatus] = React.useState([]);
    const [orderData, setorderData] = React.useState([])

    React.useEffect(() => {
        DeviceInfo.getMacAddress().then((mac) => {
            // setdeviceId(mac)

            fetch(URL + 'index.php/store_management/loadActiveOrders?customer_device_id=' + mac + '&store_code=' + data.store_code + '&track_code=' + data.track_code)
                .then((response) => response.json())
                .then((json) => {
                    // console.log(json.store_info[0].store_name);
                    // console.log(json.basic_order_info);
                    // setLatest(json.basic_order_info);

                     console.log(json);
                    setorderData(json.orders)
                })
                .catch((error) => {
                    console.error(error);
                });

        })
    }, []);


    function onLoadTotal() {
        var total = 0;
    
        const cart = orderData;
    
        for (var i = 0; i < cart.length; i++) {
          total = total + cart[i].product_price * cart[i].order_qty;
        }
    
        let totalWdc = total.toFixed(2);
    
    
        return totalWdc
      }



    console.log(orderData);
    function ContentDetails() {
        return (
            <>
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>10 - 15 mins</Text>
                        <Text style={{ fontSize: 12, color: '#dddddd', fontWeight: 'bold' }}>Estimated Delivery</Text>
                    </View>

                    <View>

                        <View style={{ marginTop: 10, flexDirection: 'column', alignItems: 'center' }}>

                            {/* order confirmed */}
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    // resizeMode="cover"
                                    source={orderStatus == 1 ? Pending : orderStatus == 2 ? preparing : orderStatus == 3 ? Ondeliver : orderStatus == 4 ? Delivered : null}
                                    style={{
                                        width: 200,
                                        height: 200
                                    }}></Image>

                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, width: 300, textAlign: 'center' }}>
                                        {orderStatus == 1 ? 'Order Pending' : orderStatus == 2 ? 'Preparing your Food.Your rider will pick it up once its ready.' :
                                            orderStatus == 3 ? 'Order On Deliver' : orderStatus == 4 ? 'Delivered' : ''}
                                    </Text>
                                </View>
                            </View>

                        </View>

                    </View>

                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Order Details</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Your tracking code:</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', backgroundColor: '#60D0A4', padding: 5, borderRadius: 10 }}>#{data.track_code}</Text>
                        </View>

                        <View style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Your order from:</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{data.store_name}</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Delivery address</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Purok. 2 Gogon Legazpi</Text>
                        </View> */}

                        <View style={{ padding: SIZES.padding * 1, backgroundColor: 'white', borderRadius: 5, elevation: 10, width: '100%', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icons color={'#60D0A4'} size={20} name={'receipt'} style={{ marginRight: 10 }} />
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Order summary</Text>
                                </View>

                            </View>
                            

   {/* Start Here */}
   { orderData.map((item, i) => {
            return (
                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 12 }}>{item.store_product_name}</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.order_qty} x {item.product_price}.00</Text>
                                </View>
            )
           })}




                            <View style={{ marginTop: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Total</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>₱ {onLoadTotal()}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Delivery Fee</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Free Delivery</Text>
                                </View>
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
                                        <Text style={{ fontWeight: 'bold', fontSize: 10 }}>₱ {onLoadTotal()}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>

                    </View>
                </View>
            </>
        )
    }

    return (
        <>
    <ScrollView   
            vertical
            showsVerticalScrollIndicator={false}
            >
        <View style={{ flex: 1, padding: SIZES.padding * 2, backgroundColor: 'white' }}>
           
            {/* {HeaderContent()} */}

          
                
            { ContentDetails()}

          
        </View>
          </ScrollView>
         </>
    );

}

export default OrderStatus;
