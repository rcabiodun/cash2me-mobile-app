import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../setup';

export default function MessageRecieverList(props) {
    const opacity = useRef(new Animated.Value(0)).current



    //pull to refresh function
    useEffect(() => {
        console.log()
        
        Animated.sequence([
            Animated.delay( 280 *props.i  ),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true,bounciness:10 })
          ]).start()
    }, [])





    return (
        <Animated.View key={props.i} style={{

            

            transform: [{
                translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [65, 0],
                }),
                
            }],
          
          

            opacity
        }}>

            <TouchableOpacity onPress={async () => {
                
                props.navigation.push('ChatBox',{receiver_id:props.v._id,receiver_name:props.v.user.username})
            }} style={{ height: 80, borderRadius: 15, flexDirection: 'row', marginBottom: 25, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: colorSchema.padding + 4,borderBottomWidth:1,borderBottomColor:colorSchema.brown }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: 53, height: 53, borderRadius: 30, backgroundColor: colorSchema.lightgray, justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name="user" size={24} color={colorSchema.yellow} />

                    </View>
                    <Text style={[commonstyles.txt, { fontSize: 16, fontFamily: 'reg', marginLeft: 18, color: '#110000B2' }]}>{props.v.user.username}</Text>
                </View>

                <Feather name='send' size={25} color={colorSchema.yellow} />


            </TouchableOpacity>
        </Animated.View>

    )
}







const styles = StyleSheet.create({
    root: {
        flex: 1,

        paddingTop: StatusBar.currentHeight + 10,
        backgroundColor: colorSchema.white
    },
    banner: {
        width: 235,
        height: 111,
        borderRadius: 11,
        resizeMode: 'cover'
    },


})
