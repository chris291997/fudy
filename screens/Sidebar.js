import React, { Component, useEffect } from 'react';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, Image } from 'react-native'
import Chriz from '../assets/images/profile.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useTheme,

    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';

function Sidebar({ navigation,...props }) {
const [subsName, setsubsName] =  React.useState('');
const [subsMobile, setsubsMobile] =  React.useState('');
const [subsphoto, setsubsphoto] = React.useState(null)

    useEffect(() => {
        setTimeout(async () => {
            let custname;
            let custcontact;
            let photo;
            custname = null;
            custcontact = null;
            photo = null;
            try {

                photo =  await AsyncStorage.getItem('userPhoto');
                custname = await AsyncStorage.getItem('cust_name');
                custcontact = await AsyncStorage.getItem('cust_contact');
            } catch (e) {
                console.log(e);
            }

            setsubsName(custname);
            setsubsMobile(custcontact);
            setsubsphoto(photo)
            // console.log(custname)


        }, 500);
    }, []);
    return (
        <DrawerContentScrollView  {...props}>
            {/* <DrawerItemList {...props}/> */}
            <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Image source={{ uri: subsphoto }} style={{ borderRadius: 50, width: 70, height: 70, }} />
                        <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                            <Title style={styles.title}>{subsName}</Title>
                            <Caption style={styles.caption}>{subsMobile}</Caption>
                        </View>
                    </View>
                </View>


            </View>




            <Drawer.Section style={styles.drawerSection}>

                <DrawerItem
                    label="Orders"
                    icon={({ color, size }) => <Icon color={'#60D0A4'} size={size} name={'shopping-bag'} />}
                    onPress={() => navigation.navigate('OrderHistory')}

                />
            </Drawer.Section>

            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem
                    label="Profile"
                    icon={({ color, size }) => <Icon color={'#60D0A4'} size={size} name={'user-circle'} />}
                />

            </Drawer.Section>
            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem
                    label="Addresses"
                    icon={({ color, size }) => <Icon color={'#60D0A4'} size={size} name={'map-marker'} />}
                />

            </Drawer.Section>

            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem
                    label="Coupons"
                    icon={({ color, size }) => <Icon color={'#60D0A4'} size={size} name={'ticket'} />}
                />

            </Drawer.Section>

            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem
                    label="Notifications"
                    icon={({ color, size }) => <Icon color={'#60D0A4'} size={size} name={'bell-o'} />}
                />

            </Drawer.Section>


        </DrawerContentScrollView>
    );
}


const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 14,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 10,
        lineHeight: 10,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});



export default Sidebar;
