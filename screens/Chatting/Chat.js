import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated, TextInput, FlatList,SafeAreaView } from 'react-native';
import { AntDesign, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import io from 'socket.io-client';
import ChatBoxMessages from '../../components/messagesList';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Chatscreen(props) {
    const flatlistRef = useRef()
    const positioning = useRef(new Animated.Value(0)).current
    const socket = useRef(io.connect('https://cash2me.onrender.com')).current
    const opacity = useRef(new Animated.Value(0)).current
    const [roomMessages, setRoomMessages] = useState([])
    const [msg, setMsg] = useState({})
    const [userMsg, setUserMsg] = useState("")


    const AutoscrollDown = () => {
        flatlistRef.current.scrollToEnd();
    };
    useEffect(() => {
        async function Checkingtoken() {
            let token = await AsyncStorage.getItem('token')
            socket.emit("join-room", { senderToken: token, receiver_id: props.route.params.receiver_id })
            socket.on("receive-message", (data) => {
                console.log(`receiving ${data}`)
                setMsg(data)
            })
            socket.on("allMessages", (data) => {
                setRoomMessages(data)
            })
            socket.on("User-joined", (data) => {
                console.log(data)
                setMsg(data)
            })
        }
        Checkingtoken()



    }, [])


    useEffect(() => {
        setRoomMessages(prev => [...prev, msg])
    }, [msg])


    function AnimateInput() {
        Animated.sequence([
            Animated.spring(positioning, { toValue: 1, useNativeDriver: false })
        ]).start()
    }

    function deAnimateInput() {
        Animated.sequence([
            Animated.delay(100),
            Animated.spring(positioning, { toValue: 0, useNativeDriver: false })
        ]).start()
    }

    const [messages, setmessages] = useState([])

    let counter = 0

    async function HandleMessageDelivery() {
        console.log(userMsg)
        let username = await AsyncStorage.getItem('username')

        socket.emit("send-message", { owner: username, load: userMsg })
    }



    useEffect(() => {
        Animated.sequence([
            Animated.delay(50),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, })
        ]).start()
        //}
    }, [])

    useEffect(() => {
        //Auto scroll to end of list
        flatlistRef.current.scrollToEnd({ animated: true })
    }, [roomMessages])








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
                    <Text style={[commonstyles.txt, { fontSize: 20, marginLeft: 10, marginTop: 17 }]}> {props.route.params.receiver_name}</Text>
                </View>


            </View>


            <View style={{ height: 30 }}></View>
            <FlatList
                ref={flatlistRef}
                data={roomMessages}
                onEndReached={() => { console.log("Thats the end") }}
                onEndReachedThreshold={2}
                contentContainerStyle={{ paddingHorizontal: 27, marginTop: 10 }}
                renderItem={({ item, index }) => {
                    return (<ChatBoxMessages v={item} i={index} />)
                }}


            />
            <View style={styles.textArea}>
                <Animated.View style={{
                    transform: [{
                        translateY: positioning.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -10],
                        }),

                    }],

                }}>
                    <TextInput
                        placeholder={"type a message"}
                        style={styles.textinp}
                        onChangeText={(txt) => { setUserMsg(txt) }}
                        onFocus={() => { AnimateInput() }}
                        onBlur={() => { deAnimateInput() }} />
                </Animated.View>
                <TouchableOpacity style={styles.sendBtn} onPress={() => { HandleMessageDelivery() }}>
                    <Feather name="send" size={21} color={colorSchema.white} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    DescriptionTxt: {
        fontFamily: 'reg',
        fontWeight: "500",
        fontSize: 10,
        color: colorSchema.grey,
        textAlign: 'center',
        paddingHorizontal: 40,

    },
    textinp: {
        width: 280,
        backgroundColor: '#fff',
        paddingVertical: 9,
        paddingHorizontal: 9,
        borderRadius: 15,
        elevation: 1,
        borderColor: colorSchema.brown,
        borderWidth: 0.5,
        fontFamily: 'reg'
    },
    textArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: "absolute",
        bottom: 10,
        paddingHorizontal: 25,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor: colorSchema.brown,
        marginLeft: 15
    },
    goBackbtn: {
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
