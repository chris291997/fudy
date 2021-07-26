import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet,  } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import {
  Address,
  Login,
  CustomerDetails,
  AllStore,
  Register, 
  SelectedStore, 
  ProductDetails, 
  CartPage, 
  Checkout, 
  OrderSummary,
  AddAddress,
  UpdateAddress,
  SplashScreen,
  SubsSelectedStore,
  subsCartPage

 
 } from './screens'
 import OrderHistory from './screens/OrderHistory';
 import OrderStatus from './screens/OrderStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './components/context';
import { useEffect, useState } from "react";

import { createDrawerNavigator } from '@react-navigation/drawer';
import Sidebar from './screens/Sidebar'

const App = () => {

  const initialLoginState = {
    isLoading: true,
    storeCode: null,
    userDevice: null,
    isCustDone: null,
    storecodeSubs:null,

  };


  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          storeCode: action.token,
          isLoading: false,
        };
        case 'RETRIEVE_USER':
          return {
            ...prevState,
            isCustDone: action.userD,
            isLoading: false,
          };
          case 'RETRIEVE_SUBS':
            return {
              ...prevState,
              storecodeSubs: action.subsS,
              isLoading: false,
            };
      case 'LOGIN':
        return {
          ...prevState,
          storeCode: action.token,
          userDevice: action.id,
          isLoading: false,
        };

        case 'DONE':
        return {
          ...prevState,
          isCustDone: action.token,
          isLoading: false,
        };

        case 'Subscribed':
          return {
            ...prevState,
            storecodeSubs: action.storecode,
            isLoading: false,
          };

    }
  };


  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (DeviceData) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const storeCode = String(DeviceData[0].store_code);
      const userDevice = DeviceData[0].customer_device_id;

      try {
        await AsyncStorage.setItem('userToken', storeCode);
        await AsyncStorage.setItem('userPhoto', userDevice);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', storeCode);
      dispatch({ type: 'LOGIN', id: userDevice, token: storeCode });
    },

    CustDetail: async (BasicData) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const custdata = String(BasicData[0].cust_data);
      const custname = String(BasicData[0].cust_name);
      const custcontact = String(BasicData[0].cust_contact);
      const custemail = String(BasicData[0].cust_email);

      try {
        await AsyncStorage.setItem('userData', custdata);
        await AsyncStorage.setItem('cust_name', custname);
        await AsyncStorage.setItem('cust_contact', custcontact);
        await AsyncStorage.setItem('cust_email', custemail);

      } catch (e) {
        console.log(e);
      }
       console.log('Customer Name: ', custname);
      dispatch({ type: 'DONE',  token: custdata });
    },

    SubsStore: async (SubsstoreCode) => {
      // setUserToken('fgkj');
      // setIsLoading(false);

    
      const storeStoreCode = String(SubsstoreCode[0].store_code);
    
      try {
        await AsyncStorage.setItem('SubscribeStore', storeStoreCode);
      
      } catch (e) {
        console.log(e);
      }
      console.log('Customer Name: ', storeStoreCode);
      dispatch({ type: 'Subscribed',  storecode: storeStoreCode });
    },






  }), []);

  useEffect(() => {

    setTimeout(async () => {
      // setIsLoading(false);
      let storeCode;
      let user;
      storeCode = null;
      user = null;
      let storeSubs;
      storeSubs = null;
      try {
        storeCode = await AsyncStorage.getItem('userToken');
        user = await AsyncStorage.getItem('userData');
        storeSubs = await AsyncStorage.getItem('SubscribeStore');
      } catch (e) {
        console.log(e);
      }
      console.log('TOKEN: ', storeCode);
      console.log('USER: ', user);
      console.log('STORE SUBS: ', storeSubs);
      dispatch({ type: 'RETRIEVE_TOKEN', token: storeCode });
      dispatch({ type: 'RETRIEVE_USER', userD: user });
      dispatch({ type: 'RETRIEVE_SUBS', subsS: storeSubs });

     



    }, 500);



  }, []);


  const AuthStack = createStackNavigator();
  const AuthStackScreen = () => (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false
      }}
      // initialRouteName={'AllStore'}
    >
      <AuthStack.Screen name="Address" component={Address} />
      <AuthStack.Screen name="Login" component={Login} />
     
    
    
    </AuthStack.Navigator>
  );


  const Stack = createStackNavigator();
  const CustomerContentScreen = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      //  initialRouteName={'CustomerDetails'}
      >
      <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
      
      
    </Stack.Navigator>
  );
  const Drawer = createDrawerNavigator();
  function DrawerRoutes() {
    return (
  
      <Drawer.Navigator drawerContent={props => <Sidebar {...props} /> } >
          <Drawer.Screen name="AllStore" component={AllStore} />
        
          
      </Drawer.Navigator>
  
    );
  }


  // const DrawerNav = createDrawerNavigator();

  

  const MainStack = createStackNavigator();
  const MainContentScreen = () => (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false
      }}

        initialRouteName={'Register'}
      >
      <MainStack.Screen name="Register" component={Register} />
      <MainStack.Screen name="AllStore" component={DrawerRoutes} />
      <MainStack.Screen name="SelectedStore" component={SelectedStore} />
      <MainStack.Screen name="ProductDetails" component={ProductDetails} />
      <MainStack.Screen name="CartPage" component={CartPage} />
      <MainStack.Screen name="Checkout" component={Checkout} />
      <MainStack.Screen name="OrderSummary" component={OrderSummary} />
      <MainStack.Screen name="OrderHistory" component={OrderHistory} />
      <MainStack.Screen name="OrderStatus" component={OrderStatus} />
      <MainStack.Screen name="AddAddress" component={AddAddress} />
      <MainStack.Screen name="UpdateAddress" component={UpdateAddress} />
 
      
      
    </MainStack.Navigator>
  );


  const SubscribeStack = createStackNavigator();
  const SubscribeContentScreen = () => (
    <SubscribeStack.Navigator
   screenOptions={{
        headerShown: false
      }}
      >
        <SubscribeStack.Screen name="SplashScreen" component={SplashScreen} />
        <SubscribeStack.Screen name="SubsSelectedStore" component={SubsSelectedStore} />
        <SubscribeStack.Screen name="AllStore" component={DrawerRoutes} />
        <SubscribeStack.Screen name="SelectedStore" component={SelectedStore} />
        <SubscribeStack.Screen name="subsCartPage" component={subsCartPage} />
        <SubscribeStack.Screen name="ProductDetails" component={ProductDetails} />
      <SubscribeStack.Screen name="Checkout" component={Checkout} />
      <SubscribeStack.Screen name="OrderSummary" component={OrderSummary} />
      <SubscribeStack.Screen name="OrderHistory" component={OrderHistory} />
      <SubscribeStack.Screen name="OrderStatus" component={OrderStatus} />
      <SubscribeStack.Screen name="AddAddress" component={AddAddress} />
      <SubscribeStack.Screen name="UpdateAddress" component={UpdateAddress} />
 
  
    </SubscribeStack.Navigator>
  );


  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large"  color="#0000ff"/>
      </View>
    );
  }

    return (
      <AuthContext.Provider value={authContext}>
      <NavigationContainer>

        {loginState.storeCode == null ?  AuthStackScreen() 
        : loginState.isCustDone == null ?  CustomerContentScreen() 
        : loginState.storecodeSubs == null ?  MainContentScreen() : SubscribeContentScreen()}
       

      </NavigationContainer>
     </AuthContext.Provider>
    );
  
}

export default App;
