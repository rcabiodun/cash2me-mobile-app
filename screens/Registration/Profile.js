import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Modal, Keyboard, ActivityIndicator, ScrollView, } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import { Picker } from '@react-native-picker/picker';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import { AntDesign } from '@expo/vector-icons';
import AnimatedTextInput from '../../components/animatedTextinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendConnector } from '../../backend';

const userTypes = [{ id: 1, name: "Cash Agent" }, { id: 2, name: "Regular User" }]
const schools = [{ id: 1, name: "Caleb" }, { id: 2, name: "Abuad" }, { id: 3, name: "Madonna" }]

export default function Profilescreen({ navigation }) {

    const connector = new backendConnector()
    const [hostel, setHostel] = useState('')
    const [school, setSchool] = useState('Caleb')
    const [phonenumber, setphonenumber] = useState('')
    const [user_type, setUserType] = useState('Cash Agent')
    const [rate, setRate] = useState("")
    const [emptyFields, setEmptyFields] = useState([])
    const [visible, setvisible] = useState(false)
    const [indicatorVisible, setIndicatorVisible] = useState(false)
    const [password, setpassword] = useState('')
    const [messages, setmessages] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)


    let counter = 0
    let states = [

        { pl: 'Hostel', setter: setHostel, st: hostel },
        { pl: 'Phone number', setter: setphonenumber, st: phonenumber },
        { pl: 'Rate', setter: setRate, st: rate },


    ]



    useEffect(() => {
        async function displayingName() {
            try {
                let msg = await AsyncStorage.getItem("msg")
                if (msg) {
                    addMessage(`Profile was not created`)
                } else {
                    addMessage(`Account,  created`)

                }
                await AsyncStorage.removeItem('msg')
            } catch (e) {
                console.log(e)
                // error reading value
            }
        }
        displayingName()
    }, [])


    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }





    //conneting to my api
    async function profileApi() {
        setIndicatorVisible(true)
        console.log(emptyFields)
        await connector.CreateProfile(null, "Post", addMessage, { hostel, school, rate, user_type, phone_number: phonenumber }, navigation)
        setIndicatorVisible(false)





    }

    //for skipping to homepage when logged in 
    if (loggedIn) {
        return null;
    }


    return (
        <TouchableWithoutFeedback  >

            <View style={styles.container} onLayout={async () => { await hideAsync() }}>
                <TouchableOpacity >

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
                        <Text style={[commonstyles.txt, { fontSize: 24 }]}>Almost</Text>
                        <Text style={[commonstyles.txt, { fontSize: 24 }]}>there...</Text>

                    </View>

                    <View style={styles.vinput}>


                        {states.map((v, i) => {
                            if ((v.pl == "Phone number" && v.st.length < 11) || (v.pl == "Rate" && v.st.length < 3) || (v.pl == "Hostel" && v.st.length < 2)) {
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
                                <AnimatedTextInput v={v} key={i} userType={user_type} />
                            )

                        })

                        }
                        <Picker
                            selectedValue={user_type}
                            style={{ marginHorizontal: 7, height: 50, width: 150, borderRadius: 20, borderColor: colorSchema.brown }}
                            onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
                        >
                            {userTypes.map((val, i) => {

                                return <Picker.Item key={val.id} label={val.name} value={val.name} />

                            })}

                        </Picker>

                        <Picker
                            selectedValue={school}
                            style={{ marginTop: 15, height: 50, width: 150, borderRadius: 20, borderColor: colorSchema.brown }}
                            onValueChange={(itemValue, itemIndex) => setSchool(itemValue)}
                        >
                            {schools.map((val, i) => {

                                return <Picker.Item key={val.id} label={val.name} value={val.name} />

                            })}

                        </Picker>

                        {((emptyFields.length == 1 && emptyFields.includes("Rate") && user_type == "Regular User") || (emptyFields.length < 1)) ?
                            <TouchableOpacity style={[styles.continue, { marginTop: 10 }]} onPress={async () => { await profileApi() }} >

                                <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                                >Continue </Text>
                            </TouchableOpacity> : null}

                        <View style={styles.FG}>
                            {indicatorVisible ?
                                <View style={styles.indicator}>
                                    <ActivityIndicator size={"large"} color={colorSchema.brown} />
                                </View> : null}




                        </View>

                    </View>
                </ScrollView>

            </View>
        </TouchableWithoutFeedback>

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
        marginTop: 20



    }
});
