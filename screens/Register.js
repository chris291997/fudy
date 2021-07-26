import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Image,Alert, ActivityIndicator } from 'react-native';

import Logo from '../constant/img/logo.png';
import Regbtn from '../assets/images/register.png';
import DeviceInfo from 'react-native-device-info';
// import RNSimData from 'react-native-sim-data'
import { AuthContext } from '../components/context';
import InternetConnectionAlert from "react-native-internet-connection-alert";

import { openDatabase } from 'react-native-sqlite-storage';
import URL from './UrlBased'
var db = openDatabase({ name: 'ordering.db' });

const Register = ({ navigation }) => {

    DeviceInfo.getMacAddress().then((mac) => {
        // "E5:12:D8:E5:69:97"
        setDeviceMac(mac)
        console.log(mac)
      });


    //   DeviceInfo.getDeviceName().then((deviceName) => {
        
    //     console.log(deviceName);
    //   });

    //   useEffect(() => {
    //     let simInfo = RNSimData.getSimInfo();
    //     setSimData(simInfo);
    //     console.log(simInfo)
    //   }, []);

     

      // Save sa Async Storage
      let [storeCode , setStoreCode] = useState('');
      let [deviceMac , setDeviceMac] = useState('');

    //   //Para naman sa Marketing
    //   let [simData, setSimData] = useState([])

    //   console.log(simData)

    let [loading, setIsLoading] = useState(false);

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM subs_tbl', [], (tx, results) => {
      
              var len = results.rows.length;
      
      
              if (len > 0) {
      
                console.log(len)
                // setDataRow(1);
      
                // setDataRow(1);
              } else {
                console.log('Pede na mag insert ')
                // setDataRow(0);
              }
      
          
      
            });
          });

    }, []);

    const [localsave, setlocalsave] = useState(0);
    const [checkInternet, setcheckInternet] = useState(false);
   

    const { SubsStore } = React.useContext(AuthContext);
    const DeviceData = [{ 
        store_code : storeCode,
        customer_device_id : deviceMac
    }]

    const SubsstoreCode = [{ 
        store_code : storeCode,
    }]

   



 const InsertDatabase = () => {
    if (!storeCode) {
        alert('Please fill Store Code');
        return;
    }


    fetch(URL + 'index.php/store_management/loadSubscriptionRequest', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         subscription_details: DeviceData
        })
      }).then((response) => response.json())
      .then((json) => {
        // console.log(json);
        // closeEvent();
        let msg = json.msg2;
        console.log(msg)

        if (msg == 0) {
            alert('Store Code Does not Exist... Please check your inputs')
        }

        if (msg == 1) {
            setlocalsave(1)
        }

        

      
        

      }).catch((error) => {
        console.error(error);
      });


  if (localsave == 1){
    SubsStore(SubsstoreCode)
  }
     
 }

 const GotoAllStore = () => {
    navigation.navigate('AllStore');
 }

 const Bodycontent = () => {
     return(
        <View style={styles.content}>
        {loading ? (<View
                 style={{
                     ...StyleSheet.absoluteFill,
                     alignItems: 'center',
                     justifyContent: 'center'
                 }}
             >
                 <ActivityIndicator size="large" color="#bad555" />
             </View>) : null}
         <View>
             <Text style={{ fontSize: 40, fontWeight: 'bold', paddingVertical: 10 }}>Hello, Nice to Meet You! </Text>
             <Text style={{ width: 300, fontSize: 15, }}>Our goal is to find the Best Kept Secret in Bicol Cusine.  </Text>
         </View>
         <View style={{}}>
             <View style={{ width: 350, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', }}>
             <TextInput style={{width: 250, fontSize:18, borderBottomWidth:1,paddingBottom:18}} placeholder="Store Code" value={storeCode}  onChangeText={(text) => setStoreCode(text)} ></TextInput>
                 <TouchableOpacity
                     style={{ width: 100, }}
                        onPress={InsertDatabase}
                 >
                 <Image source={Regbtn} style={{ width: 80, height: 80, }} />
                 </TouchableOpacity>
             </View>
             <View style={{ paddingTop: 20, alignItems: 'center', }}>
                 <Text style={{ paddingVertical: 30, fontSize: 15 }}>
                     OR
                     </Text>
                 <TouchableOpacity onPress={()=> GotoAllStore()}>
                     <Text style={{ fontSize: 18 }}>Skip for Now</Text>
                 </TouchableOpacity>
             </View>

         </View>
         <View style={{ width: 450, alignItems: 'center' }}>
             <Image source={Logo} style={{ width: 148, height: 55, }} />
         </View>
     </View>
     )
 }


    return (
        <InternetConnectionAlert
        onChange={(connectionState) => {

            console.log("Connection State: ", connectionState);


             if (connectionState.isConnected == true && connectionState.isInternetReachable == true) {

                setcheckInternet(true)

            }else{
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
            </View>) : (
                Bodycontent()
            )

}



        </InternetConnectionAlert>
    );


}


const styles = StyleSheet.create({

    content: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
       
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
    }
})

export default Register;