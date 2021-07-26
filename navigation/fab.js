import React, { Component } from 'react';
import { View, Text, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const fabs = () =>  {
    state = {
        animation: new Animated.Value(0),
    };

    toggleOpen = () => {

        const toValue = this._open ? 0 : 1;

        Animated.timing(this.state.animation, {
            toValue,
            friction: 10,
            useNativeDriver: true,
        }).start();

        this._open = !this._open

    };

   

        const myOrdersInterpolate = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -70],
        });

        const saveStyle = {
            transform: [
                {
                    translateY: myOrdersInterpolate,
                },
            ],
        };

        return (
            <View style={{ flex: 1, alignItems: 'center' }}>

                <View style={[styles.floatContainer, styles.floatContainerBottom]}>

                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.button, styles.secondary, styles.menu]}>
                            <Text style={{ color: 'white', fontSize: 25 }}>/</Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.button, styles.secondary, styles.menu, saveStyle]}>
                            <Text style={{ color: 'white', fontSize: 25 }}>-</Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>



                    <TouchableWithoutFeedback onPress={this.toggleOpen}>
                        <Animated.View style={[styles.button, styles.menu]}  >
                            <Text style={{ color: 'white', fontSize: 25 }}>O</Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
        );
    }


const styles = StyleSheet.create({
    floatContainer: {
        alignItems: 'center', 
        position: 'absolute',
    },
    floatContainerBottom:{
         bottom: 80,
    },
    secondary:{
        width: 48,
        height: 48,
        borderRadius: 48  /2 ,

    },
    button: {
        position: 'absolute',
         width:60,
         height:60,
         alignItems: 'center', 
         justifyContent:'center',
         borderRadius: 60 / 2,
         shadowRadius:10,
         shadowColor:'#F02A45',
         shadowOpacity:0.3,
         shadowOffset: {height: 10 }

    },
    menu :{
        backgroundColor: 'green'
    }

})

export default fabs;