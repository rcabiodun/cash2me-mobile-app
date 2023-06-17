import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../setup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatBoxMessages(props) {
    const scale = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [username, setUsername] = useState("")

    function generateColor() {
        console.log(props.v.owner)
        if (props.v.owner == username) {
            return colorSchema.brown
        } else if (props.v.user == "admin") {
            return colorSchema.white
        } else {
            return colorSchema.yellow
        }
    }


    //pull to refresh function
    useEffect(() => {
        //console.log(props)
        AsyncStorage.getItem('username').then(result => setUsername(result))
        Animated.sequence([
            Animated.delay(280 * props.i),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, bounciness: 10 })
        ]).start()
    }, [])





    return (
        <View>

            {
                props.v.owner == username ?

                    < Animated.View key={props.i} style={{
                        transform: [{
                            translateX: opacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [65, 0],
                            }),

                        }],
                        opacity
                    }
                    }>
                        <TouchableOpacity style={[styles.messages, { borderBottomColor: generateColor() }]}>
                            <Text style={[commonstyles.txt, { fontSize: 16, fontFamily: 'reg', marginLeft: 18, color: '#110000B2' }]}>{props.v.load}</Text>
                        </TouchableOpacity>
                    </Animated.View > :
                    < Animated.View key={props.i} style={{
                        transform: [{
                            translateX: opacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-65, 0],
                            }),

                        }],
                        opacity
                    }
                    }>
                        <TouchableOpacity style={[styles.messages, { borderBottomColor: generateColor() }]}>
                            <View></View>
                            <Text style={[commonstyles.txt, { fontSize: 16, fontFamily: 'reg', marginLeft: 18, color: '#110000B2' }]}>{props.v.load}</Text>
                        </TouchableOpacity>
                    </Animated.View >

            }
        </View>

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
    messages: {
        height: 40,
        borderRadius: 15,
        flexDirection: 'row',
        marginBottom: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: colorSchema.padding + 4,
        borderBottomWidth: 1,

    }


})
