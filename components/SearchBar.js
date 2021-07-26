import React, {useState} from 'react';
import {Image, StyleSheet, Text, View,TextInput, TouchableOpacity,} from 'react-native';
import { icons, images, SIZES, COLORS, FONTS } from '../constants'
// import Icon from 'react-native-vector-icons/MaterialIcons';

import SearchFoods from '../assets/images/searchFood.png';
const SearchBar = () => {

    let [foodQuery,setfoodQuery] = useState('');

    function SearchFood () {
        setfoodQuery('');
        alert(foodQuery)
        

    }

  return (
    <View
    style={{
      marginTop: 40,
      flexDirection: 'row',
      paddingHorizontal: 0,
    }}>
    <View style={style.inputContainer}>
    <Image
                            source={icons.search}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: COLORS.secondary
                            }}
                        />
      <TextInput
      value={foodQuery}
        style={{flex: 1, fontSize: 18}}
        placeholder="Search Here"
        onChangeText={text => setfoodQuery(text)}
      />
    </View>
    <TouchableOpacity onPress={SearchFood} >
    <View style={style.sortBtn}>
    <Image source={SearchFoods} style={{ width: 75, height: 75, }} />
    </View>
    </TouchableOpacity>
  </View>
  );
};

export default SearchBar;

const style = StyleSheet.create({
  
    inputContainer: {
      flex: 1,
      height: 50,
      borderRadius: 10,
      flexDirection: 'row',
      backgroundColor: COLORS.light,
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
  });