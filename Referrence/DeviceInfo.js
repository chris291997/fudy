import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNSimData from 'react-native-sim-data'

export default function Info (){
  let [phoneID , setPhoneID] = useState('');
  DeviceInfo.getAndroidId().then((androidId) => {
    setPhoneID(androidId);
    console.log(androidId);
  });
  DeviceInfo.getIpAddress().then((ip) => {
    // "92.168.32.44"
    console.log(ip);
  });
  DeviceInfo.getBaseOs().then((baseOs) => {
    // "Windows", "Android" etc
    console.log(baseOs);
  });

  DeviceInfo.getDeviceName().then((deviceName) => {
    // iOS: "Becca's iPhone 6"
    // Android: ?
    // Windows: ?
    console.log(deviceName);
  });

  DeviceInfo.getDeviceToken().then((deviceToken) => {
    // iOS: "a2Jqsd0kanz..."
    //console.log(deviceToken);
  });

  DeviceInfo.getPhoneNumber().then((phoneNumber) => {
    console.log(phoneNumber);
    setDevicePhoneNumber(phoneNumber);
    // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
  });
  DeviceInfo.getMacAddress().then((mac) => {
    // "E5:12:D8:E5:69:97"
    console.log(mac)
  });

  

  console.log(JSON.stringify(RNSimData.getSimInfo()));


  let deviceId = DeviceInfo.getDeviceId();
  let [DeviceID , setDeviceIDNO] = useState(deviceId);
  
  let [DevicePhoneNumber , setDevicePhoneNumber] = useState('');

  // let appName = DeviceInfo.getApplicationName();

    return (
      <View>
        <Text>Phone ID : {phoneID} and {DevicePhoneNumber}</Text>
        <Text >
          {JSON.stringify(RNSimData.getSimInfo())}
        </Text>
      </View>
    );
  
}
