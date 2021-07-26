import React, { Component, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, AcitivityIndicator, Image, TouchableOpacity } from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import preloader from '../assets/images/preloader.gif';
import RNSimData from 'react-native-sim-data'
import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
const CustomerDetails = ({ navigation }) => {

    const [loading, setLoading] = React.useState(true);
    const [uname, setUname] = React.useState('');
    const [uContact , seUContact] = React.useState('')
    const [uEmail, seEmail] = React.useState('');
    const [simData , setSimData] = React.useState([])

    // useEffect(() =>{
    //     // let simInfo = RNSimData.getSimInfo();
    //     // // setSimData(simInfo.phoneNumber0);
    //     // console.log(simInfo)

    //     DeviceInfo.getPhoneNumber().then((phoneNumber) => {
    //         // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
    //      const SIM = [{
    //          phonesim : phoneNumber
    //      }]

    //      setSimData(SIM)


        
    //     });


        
    // })

  
    
   

    useEffect(() => {
        
        setTimeout(async () => {
            
            
            setLoading(false)

        }, 500);

      },[])



    const { CustDetail } = React.useContext(AuthContext);
    // alert(JSON.stringify(dataDummy))

    const BasicData = [{ 
        cust_data : 'true',
        cust_name : uname,
        cust_contact : uContact,
        cust_email : uEmail
       
    }]

    const GotoDashboard = () => {

        if (!uname) {
            alert('Please fill all fields');
            return;
        }
        if (!uContact) {
            alert('Please fill all fields');
            return;
        }
        if (!uEmail) {
            alert('Please fill all fields');
            return;
        }

        

         CustDetail(BasicData)
       
        
    }

    return (
        <View  style={{flex: 1, padding: SIZES.padding * 2, justifyContent: 'center' }}>
            {/* <Text> {dataDummy[0].fb} </Text>
            <Text> {dataDummy[0].ads} </Text> */}

         
                <View>
                <Text style={{margin:10, fontSize:20, fontFamily: 'Satisfy-Regular'}}>You need to log few more details</Text>

<View>
<TextInput style = {styles.input}
   underlineColorAndroid = "transparent"
   placeholder = "Your Name*" 
   autoCapitalize = "none"
   onChangeText={(text) => setUname(text)} 
   value={uname}
   keyboardType='default'
   />
<TextInput style = {styles.input}
   underlineColorAndroid = "transparent"
   placeholder = "Mobile*"
   value={uContact}
   keyboardType='number-pad'
  
   onChangeText={(text) => seUContact(text)} 
// onChangeText = {this.handleEmail}
// value={simData}

   />
<TextInput style = {styles.input}
   underlineColorAndroid = "transparent"
   placeholder = "Email*"
   keyboardType='email-address'
   onChangeText={(text) => seEmail(text)} 
   value={uEmail}

   
//    onChangeText = {this.handleEmail}

   />
  
</View>

<View style = {{margin:20}}>
           
            <TouchableOpacity onPress={() => GotoDashboard()}style={{ padding: 15, backgroundColor: '#EE1D52', justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginBottom: 15 }}>
                <Text style={{ color: '#fff', fontSize: 20 }}> Get Started 🚀 </Text>
            </TouchableOpacity>
            
        </View>

</View>
            

         

            




        </View>
    );
}
const styles = StyleSheet.create({
    
    input: {
       margin: 15,
       height: 40,
       borderColor: '#55CCAB',
       borderBottomWidth: 1
    },

 })


export default CustomerDetails;
