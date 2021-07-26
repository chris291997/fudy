import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, RefreshControl,SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import deleteBtn from '../assets/images/deletebtn.png'
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import URL from './UrlBased';
const { width } = Dimensions.get("screen");
const cardWidth = width / 1;
import preloader from '../assets/images/preloader.gif';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Icon Set
import IconION from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';



const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'ordering.db' });

const CartPage = ({ navigation }) => {

  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [checkInternet, setcheckInternet] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh()
    wait(2000).then(() => setRefreshing(false));
  }, []);



  let [flatListItems, setFlatListItems] = useState([]);
  let [totalAmount, setTotalAmount] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [dataRow, setDataRow] = useState(0);
  const [continueShopping , setContinueShopping] = useState('');
  const [StoreCode, setStoreCode] = useState('')

  useEffect(() => {


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


      // setCurrentTime(
      //     hours + ':' + min + ':' + sec
      // );

      let storeCode;
      storeCode = null;
      try {
          storeCode = await AsyncStorage.getItem('SubscribeStore');
      } catch (e) {
          console.log(e);
      }

      setStoreCode(storeCode)
    })();


    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM table_orders', [], (tx, results) => {

        var len = results.rows.length;

        // if (len > 0) {
        //   // setResultCount(len);
        //   //  let res = results.rows.item(0);
        //   //  console.log(res)
        //   setDataRow(1);
        // }
        if (len > 0) {
          // setResultCount(len);
          // let res = results.rows.item(0);
          // console.log(len)
          setDataRow(1);
          setLoading(false)

          // setDataRow(1);
        } else {
          // console.log(len)
          setDataRow(0);
          setLoading(false)
        }

        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));

        setFlatListItems(temp);

        // setTotalAmount(newTotal)




      });
    });


    db.transaction((tx) => {
      tx.executeSql('SELECT prodstore_code FROM table_orders GROUP BY prodstore_code', [], (tx, results) => {

        var len = results.rows.length;

      
        if (len > 0) {

          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //  console.log(temp[0].prodstore_code)
          console.log('With Store Code: ' + temp[0].prodstore_code)
          setContinueShopping(temp[0].prodstore_code);

          // setDataRow(1);
        } else {
          console.log('With out' + len)
        
        }
       
     




      });
    });












  }, []);

  function refresh() {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM table_orders', [], (tx, results) => {

        var len = results.rows.length;

        if (len > 0) {
          // setResultCount(len);
          // let res = results.rows.item(0);
          console.log(len)
          setDataRow(1);
        } else {
          console.log(len)
          setDataRow(0);
        }

        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);



        // console.log(temp)


      });
    });
  }

  function editqty(i, orderCode, price) {

    var dataCar = flatListItems;
    let cantd = dataCar[i].prod_qty;
    let resultQty = cantd - 1;

    let newPrice = price * resultQty
    console.log(resultQty);


    // dataCar[i].prod_qty = result;

    if (resultQty < 1) {
      db.transaction(function (tx) {
        tx.executeSql(
          'Delete from table_orders WHERE order_id =? ',
          [orderCode],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('oK')

              refresh();




            } else alert('Failed');
          },
        );
      });
    } else {
      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE table_orders SET prod_qty = ?, prod_total = ? WHERE order_id =? ',
          [resultQty, newPrice, orderCode],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('oK')

              refresh();




            } else alert('Failed');
          },
        );
      });
    }




  }

  function addQty(i, orderCode, price) {
    var dataCar = flatListItems;




    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE table_orders SET prod_qty = prod_qty + 1, prod_total = prod_total+prod_price WHERE order_id =? ',
        [orderCode],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('oK')

            refresh();

          } else alert('Failed');
        },
      );
    });


  }

  function removeItem(i, order_id) {
    // alert(order_id)

    db.transaction(function (tx) {
      tx.executeSql(
        'Delete from table_orders WHERE order_id =? ',
        [order_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('oK')

            refresh();




          } else alert('Failed');
        },
      );
    });

  }

  function onLoadTotal() {
    var total = 0;

    const cart = flatListItems;

    for (var i = 0; i < cart.length; i++) {
      total = total + cart[i].prod_price * cart[i].prod_qty;
    }

    let totalWdc = total.toFixed(2);


    return totalWdc
  }


const ViewStore = (data) => {
console.log(data + '!==' + StoreCode)

if (data !== StoreCode){

    navigation.navigate('SelectedStore')
}else{
    navigation.navigate('SubsSelectedStore')
}


}

  function onLoadCartItem() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {
          flatListItems.map((item, i) => {
            let prodSeller = item.prod_seller;
            let shortprodSeller = prodSeller.substring(0, 15) + '...'
            return (
              <View
                key={i}
                style={{
                  backgroundColor: 'white',
                  marginVertical: 10,
                  marginHorizontal: 5,
                  paddingHorizontal: 10,
                  height: 120,
                  elevation: 15,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                  <Image
                    resizeMode="cover"
                    source={{ uri: URL + item.prod_photo }}
                    style={{
                      right: 5,
                      borderRadius: 20,
                      width: 77,
                      height: 77
                    }}></Image>
                  <View style={{ flexDirection: 'column', justifyContent:'space-between' }}>
                    <View>
                      <Text style={{ fontWeight: 'bold', fontSize: 10, width: '100%' }}>{item.prod_name}</Text>
                      <Text style={{ color: '#025955',fontFamily: 'RalewayLight-m7nx', fontSize: 13 }}>{item.prod_price}.00</Text>
                      <Text style={{ color:'black',fontFamily: 'RalewayLight-m7nx',fontSize: 10 }}>Size: {item.prod_variant}</Text>
                    </View>
                    <View>
                    <Text style={{ top: 5, fontWeight: 'bold', fontSize: 10, width: '100%' }}>Seller: {prodSeller < 15 ? prodSeller : shortprodSeller}</Text>                    
                     </View>
                    {/* <Text>{item.prod_total}</Text> */}
                   
                  </View>


                  <View
                    style={{
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                  >

                    <TouchableOpacity
                      style={{
                        width: 40,
                        backgroundColor: '#67D19F',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 25,
                        borderBottomLeftRadius: 25
                      }}
                      onPress={() => editqty(i, item.order_id, item.prod_price)}
                    >
                      <Text style={{ ...FONTS.body2}}>-</Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: 40,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={{ ...FONTS.h5 }}>{item.prod_qty}</Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        width: 40,
                        backgroundColor: '#67D19F',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopRightRadius: 25,
                        borderBottomRightRadius: 25

                      }}
                      onPress={() => addQty(i, item.order_id, item.prod_price)}
                    >
                      <Text style={{ ...FONTS.body2 }}>+</Text>
                    </TouchableOpacity>
                  </View>




                </View>
                <TouchableOpacity style={{
                  alignItems: 'flex-end', top: 46,
                  right: 27,
                }} onPress={() => removeItem(i, item.order_id)}>
                  <View>
                    <Image
                      source={deleteBtn}

                      style={{

                        width: 40,
                        height: 40
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )
          })
        }
        <View>

          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'right' }}>Total: {onLoadTotal()}</Text>

        </View>

        <View style={{}}>

          <TouchableOpacity onPress={() => navigation.navigate('Checkout')} activeOpacity={0.8} >
            <View style={style.btnContainer}>
              <Text style={style.title}>CHECKOUT</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => ViewStore(continueShopping)} >
            <View style={style.btnContainer2}>
              <Text style={style.title2}>Continue Shopping </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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




        <View style={{ padding: SIZES.padding * 2, backgroundColor: 'white', flex: 1 }}>
        <SafeAreaView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, }}>
                                <IconAnt name="arrowleft" size={20} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', left: 10 }}>
                                <Text>YOUR BASKET</Text>
                            </View>

                            <TouchableOpacity  style={{ padding: 5, }}>
                               {/* <Text style={{ color: '#EE1D52' }}>EMPTY CART</Text> */}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
        
        
          {/* {renderCart()} */}
          {dataRow > 0 ?
            (onLoadCartItem())
            :
            (<ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}> Your Cart is Empty</Text>
                <TouchableOpacity style={{ marginTop: 20 }} activeOpacity={0.8} onPress={() => navigation.navigate('SubsSelectedStore')} >
                  <View style={style.btnContainer3}>
                    <Text style={style.title3}>Continue Shopping </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
            )
          }


        </View>
      )
      }

    </InternetConnectionAlert>
  );

}



const style = StyleSheet.create({
  title: { color: COLORS.white, fontWeight: 'bold', fontSize: 18 },
  title2: { color: 'black', fontSize: 18 },
  title3: { color: 'black', fontSize: 15 },
  btnContainer: {
    backgroundColor: COLORS.primary,
    borderColor: 'white',
    borderWidth: 3,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5
  },
  btnContainer2: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
    borderWidth: 1,
    height: 60,
    borderRadius: 10,
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


export default CartPage