import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated ,SafeAreaView} from 'react-native';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import MoreInfoList from '../../components/MoreInfoList';
import AsyncStorage from '@react-native-async-storage/async-storage';
//add message toast to display messages
export default function MoreInfoscreen(props) {
    const opacity = useRef(new Animated.Value(0)).current

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }


    async function removeToken() {
        try {
            addMessage("Logging out")
            await AsyncStorage.removeItem('token')
            props.navigation.replace('RegistrationStack')
            console.log("removed token")
        } catch (err) {
            console.error(err)
        }
    }

    const [messages, setmessages] = useState([])
    let pages = [
        { icon: 'user', name: "Profile", page: "ProfilePage" },
        { icon: "log-out", name: "Logout", page: removeToken },
        { icon: "message-square", name: "Messages", page: "MsgsRequests" },
    ]
    let counter = 0

    function err(err) {
        console.log(err)
    }



    useEffect(() => {
        //if('username' in props.route.params){
        //addMessage(`${props.route.params.username} created`)
        Animated.sequence([
            Animated.delay(50),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, })
        ]).start()
        //}
    }, [])




    async function removeToken() {
        try {
            addMessage("Logging out")
            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('username')
            props.navigation.replace('RegistrationStack')
            console.log("removed token")
        } catch (err) {
            console.error(err)
        }
    }



    //for skipping to homepage when logged in 

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
                {messages.map(m => {
                    return (
                        <Message
                            //sending a message 
                            key={counter + 1}
                            message={m}
                            onHide={() => {
                                setmessages((messages) => messages.filter((currentMessage) => {
                                    currentMessage !== m

                                }
                                ))
                            }}
                        />

                    )
                })}
            </View>
            <View style={[styles.header, { paddingHorizontal: colorSchema.padding }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity style={styles.goBackbtn} onPress={() => {
                        props.navigation.goBack()
                    }}>
                        <AntDesign name="back" size={20} color={colorSchema.yellow} />

                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 20, marginLeft: 10, marginTop: 17 }]}> More</Text>
                </View>


            </View>
            <View style={{ height: 30 }}></View>
            <View style={{paddingHorizontal:20}}>

                {
                    pages.map((v, i) => {
                        return (
                            <MoreInfoList removeToken={removeToken} v={v} i={i} navigation={props.navigation} />
                        )
                    })
                }

            </View>
            <Animated.View style={{


                transform: [{
                    translateY: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [65, 0],
                    }),

                }],



                opacity,
                position: 'absolute',
                bottom: 0
            }}>
                <Text style={[commonstyles.txt, styles.DescriptionTxt]}>
                    <Feather name="info" size={16} color={colorSchema.grey} />  Tips: Kindly contact us through our email,for any errors encountered. Your feedback is appreciated.
                </Text>
            </Animated.View>


        </SafeAreaView>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 20,


    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    DescriptionTxt: {
        fontFamily: 'reg',
        fontWeight: "500",
        fontSize: 12,
        color: colorSchema.grey,
        textAlign: 'center',
        paddingHorizontal: 40,

    }, goBackbtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colorSchema.brown,
        alignItems: 'center',
        marginTop: 20




    }

});
