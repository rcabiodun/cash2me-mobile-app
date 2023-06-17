import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, } from 'react-native';
import { FontAwesome, } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../setup';

export default function AnimatedAgentList(props) {
    const opacity = useRef(new Animated.Value(0)).current
    const positioning = useRef(new Animated.Value(0)).current

    let availability_color = ["#2D7BD8", "#FEB561"]

    function genColor(isAvailable) {

        if (isAvailable) {
            return availability_color[0]
        } else {
            return availability_color[1]
        }
    }
    //pull to refresh function
    useEffect(() => {
        //console.log(props)
        Animated.sequence([
            Animated.delay(280 * props.i),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, bounciness: 10 })
        ]).start()

        Animated.loop(
            Animated.sequence([
                Animated.delay(280 * props.i),

                Animated.spring(positioning, { toValue: 1, useNativeDriver: true, duration: 1100, }),
                Animated.spring(positioning, { toValue: 0, useNativeDriver: true, duration: 1100, })]
            )
        ).start()

    }, [])

    useEffect(() => {
        if (props.ordering >= 1) {
            Animated.sequence([
                Animated.delay(280 * props.i),
                Animated.spring(opacity, { toValue: 0, useNativeDriver: true, bounciness: 10 }),

                Animated.delay(280 * props.i),
                Animated.spring(opacity, { toValue: 1, useNativeDriver: true, bounciness: 10 })
            ]).start()



        }





    }, [props.ordering])





    return (
        <Animated.View key={props.i} style={{

            transform: [{
                translateY: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                }),

            }],

            transform: [{
                translateX: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [65, 0],
                }),

            }],



            opacity
        }}>

            <TouchableOpacity
                style={styles.agentCard}
                onLongPress={() => {

                    props.highlightedAgent(props.v)
                    props.setModalVisibility((prev) => {
                        if (prev == true) {
                            return false
                        } else {
                            return true
                        }
                    })
                }}

                onPress={() => {

                    props.highlightedAgent(props.v)
                    props.setModalVisibility((prev) => {
                        if (prev == true) {
                            return false
                        } else {
                            return true
                        }
                    })
                }}



            >
                <Animated.View style={[styles.availabilityIndicator, {
                    backgroundColor: genColor(props.v.is_available),
                    transform: [{
                        translateX: positioning.interpolate({
                            inputRange: [0, 1],
                            outputRange: [4, 0],
                        }),
                    }]
                }]}>

                </Animated.View>
                <Text style={[commonstyles.txt, { fontSize: 21, fontFamily: 'bold', color: colorSchema.black }]}>{props.v.user.username}</Text>
                <Text style={[commonstyles.txt, { fontSize: 17, fontFamily: 'bold', color: colorSchema.black, marginTop: 2 }]}><FontAwesome name="building" size={20} color={colorSchema.yellow} /> {props.v.hostel}</Text>
                <Text style={[commonstyles.txt, { fontSize: 17, fontFamily: 'reg', color: colorSchema.black, marginTop: 2 }]}>
                    ₦ 1000 / {props.v.rate}
                </Text>
            </TouchableOpacity>
        </Animated.View >

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
    agentCard: {
        height: 180,
        borderRadius: 20,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colorSchema.lightgray,

    },
    availabilityIndicator: {
        width: 15,
        height: 15,
        borderRadius: 7,
        backgroundColor: 'black',
        position: 'absolute',
        top: 10,
        right: 10,


    }


})
