import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Modal, Keyboard, ActivityIndicator, ScrollView, Animated,SafeAreaView } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import { colorSchema, styles as commonstyles } from '../../setup';
import { FontAwesome, Ionicons, EvilIcons, Feather, AntDesign } from '@expo/vector-icons';
import AnimatedTextInput from '../../components/animatedTextinput';
import Message from '../../components/messagetoast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendConnector } from '../../backend';

export default function Loginscreen({ navigation }) {
    const opacity = useRef(new Animated.Value(0)).current
    
    const [username, setusername] = useState('')
    const connector=new backendConnector()
    const [emptyFields, setEmptyFields] = useState([])
    const [visible, setvisible] = useState(false)
    const [showBtn, setShowBtn] = useState(false)
    const [indicatorVisible, setIndicatorVisible] = useState(false)
    const [password, setpassword] = useState('')
    const [messages, setmessages] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)


    let counter = 0
    let states = [

        { pl: 'Username', setter: setusername, st: username },
        { pl: 'Password', setter: setpassword, st: password },


    ]



    useEffect(() => {
        if ((username.length >= 5 && password.length > 7)) {
            Animated.sequence([
                Animated.delay(50),
                Animated.spring(opacity, { toValue: 1, useNativeDriver:false})
            ]).start()
        } else {
            Animated.sequence([
                Animated.delay(50),
                Animated.spring(opacity, { toValue: 0,useNativeDriver:false })
            ]).start()
        }

    }, [username, password])

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }

   




    //conneting to my api
    async function loginapi() {
        setIndicatorVisible(true)
        await connector.Login(null,"Post",addMessage,{username,password},navigation)
        setIndicatorVisible(false)
        

    }



    return (

            <View style={styles.container} onLayout={async () => { await hideAsync() }}>
                <TouchableOpacity style={styles.goBackbtn} onPress={() => { navigation.goBack() }}>
                    <AntDesign name="back" size={21} color={colorSchema.yellow} />

                </TouchableOpacity>

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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                >
                    <View style={styles.modalcontainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{messages}</Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setvisible(!visible)}>
                                <Text style={styles.textStyle}>close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <ScrollView>

                    <View style={styles.vhead}>
                        <Text style={[commonstyles.txt, { fontSize: 24 }]}>Log into</Text>
                        <Text style={[commonstyles.txt, { fontSize: 24 }]}>your account</Text>
                    </View>

                    <View style={styles.vinput}>
                        {indicatorVisible ?
                            <View style={styles.indicator}>
                                <ActivityIndicator size={"large"} color={colorSchema.brown} />
                            </View> : null}

                        {states.map((v, i) => {
                            if ((v.pl == "Password" && v.st.length < 8) || (v.pl == "Username" && v.st.length < 5) || (v.st.length < 5)) {
                                if (emptyFields.includes(v.pl)) {
                                } else {
                                    setEmptyFields(flds => [...flds, v.pl])
                                }
                            } else {
                                const index = emptyFields.indexOf(v.pl)
                                if (index > -1) {
                                    emptyFields.splice(index, 1)
                                }
                            }

                            return (
                                <AnimatedTextInput v={v} key={i}/>
                            )

                        })

                        }

                        <Animated.View style={{
                            

                            transform: [{
                                translateX: opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [65, 0],
                                }),

                            }],
                            opacity


                        }}>
                            <TouchableOpacity style={[styles.continue, {
                                marginTop: 10,


                            }]} onPress={async () => { await loginapi() }} >

                                <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                                >Login</Text>
                            </TouchableOpacity>
                        </Animated.View>



                        <View style={styles.FG}>





                        </View>

                    </View>
                </ScrollView>

            </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 5,


    },
    arrow: {
        paddingHorizontal: 30,
        paddingVertical: 5,
    },
    arrowbutton: {
        width: 80,
        paddingHorizontal: 20,
        paddingVertical: 13,
        borderRadius: 10,
        backgroundColor: '#ff7f50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'red',
        elevation: 5,

    },
    vhead: {
        paddingHorizontal: 21,
        paddingVertical: 30,
        marginTop: 65,

    },
    vtext: {
        fontWeight: 'bold',
        fontSize: 25,

    },
    vinput: {
        alignItems: 'center',
        paddingHorizontal: colorSchema.padding
    },
    textinp: {
        width: 250,
        backgroundColor: '#fff',
        paddingVertical: 9,
        paddingHorizontal: 9,
        borderRadius: 15,
        elevation: 1,
        marginTop: 5,
        borderColor: colorSchema.brown,
        borderWidth: 0.5,
        marginBottom: 12,
        fontFamily: 'reg'
    },
    continue2: {
        width: 100,
        height: 50,
        backgroundColor: colorSchema.brown,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1
    },
    continue: {
        width: 100,
        height: 50,
        backgroundColor: colorSchema.brown,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },

    btn: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff'
    },

    FG: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 7,
    },
    auth: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 45,
        elevation: 5
    },
    tauth: {
        fontWeight: 'bold',
        color: '#fff'

    },

    indicator: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    modalcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'


    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: 200,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
        
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#ff7f50',
        padding: 15,
        marginTop: 8,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 15,
    },
    ball: {
        width: 10,
        height: 10,
        backgroundColor: colorSchema.yellow,
        borderRadius: 8,
        marginLeft: 10
    },
    goBackbtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colorSchema.brown,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop:20




    }
});
