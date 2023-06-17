import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Keyboard, ActivityIndicator, Switch, SafeAreaView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import { backendConnector } from '../../backend';
//add message toast to display messages
export default function ProfilePagescreen(props) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [username, setUsername] = useState("")
    const [phone_number, setPhonenumber] = useState("")
    const [user_type, setUserType] = useState("")
    const [rate, setRate] = useState("")
    const [hostel, Hostel] = useState("")
    const [school, setSchool] = useState("")
    const toggleSwitch = (isAvailable) => {
        if (isAvailable) {
            setIsEnabled(true)
        } else {
            setIsEnabled(false)
        }
    }
    const [edit, setEdit] = useState(false)
    const connector = new backendConnector()
    const [messages, setmessages] = useState([])
    const [indicatorVisible, setIndicatorVisible] = useState(false)
    const [profile, setProfile] = useState({})
    const [extradetails, setExtraDetails] = useState({})
    let pages = [
        { icon: 'dollar-sign', name: "Username", value: extradetails.username, st: setUsername },
        { icon: 'First ', name: "Phone number", value: profile.phone_number, st: setPhonenumber },
        { icon: 'eye-off', name: "User category", value: profile.user_type, st: setUserType },
        { icon: "log-out", name: "Rate", value: profile.rate, st: setRate },
        { icon: 'shopping-bag', name: "Hostel", value: profile.hostel, st: Hostel },
        { icon: 'info', name: "School", value: profile.school, st: setSchool },
    ]
    let counter = 0

    async function saveProfile(err) {
        let fields = [username, phone_number, rate, hostel]
        let keys = ["username", "phone_number", "rate", "hostel"]

        let payload = { "is_available": isEnabled }
        fields.filter((v, i) => {
            if (v.length > 1) {
                payload[`${keys[i]}`] = v
            }

        })
        setIndicatorVisible(true)
        await connector.updateProfile(setProfile, "Put", addMessage, payload, setExtraDetails, toggleSwitch)
        setIndicatorVisible(false)

    }

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }


    useEffect(() => {
        async function viewProfile() {
            setIndicatorVisible(true)
            await connector.getProfile(setProfile, "Get", addMessage, setExtraDetails, toggleSwitch)
            setIndicatorVisible(false)

        }
        viewProfile()
    }, [])








    //for skipping to homepage when logged in 

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingHorizontal: colorSchema.padding }]}>
                <View style={{ position: 'absolute', top: 25, left: 0, elevation: 5, right: 0, paddingHorizontal: 20 }}>
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
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => { props.navigation.goBack() }}>

                        <AntDesign name="back" size={21} color={colorSchema.yellow} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.txt, { fontSize: 22, marginLeft: 32, marginTop: 5 }]}>Profile</Text>

                </View>
                <TouchableOpacity>

                </TouchableOpacity>

            </View>
            <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                    setEdit(!edit)
                    console.log(isEnabled)
                    console.log(profile)
                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Feather name="edit" size={15} color={colorSchema.yellow} />
                    <Text style={[commonstyles.txt, { fontSize: 11, marginLeft: 4, fontFamily: 'reg', color: colorSchema.yellow, borderBottomWidth: 1, borderBottomColor: colorSchema.pink }]}>Edit profile</Text>
                </TouchableOpacity>

                <Text style={[commonstyles.txt, { fontSize: 20 }]}>Hi {extradetails.username}</Text>
            </View>
            {
                pages.map((v, i) => {
                    return (
                        <View key={i} style={{ height: 56, borderRadius: 20, marginBottom: 10, justifyContent: 'center', paddingHorizontal: colorSchema.padding }}>
                            <Text style={[commonstyles.txt, { fontSize: 14, fontFamily: 'reg', marginLeft: 16, color: '#4A4B4D' }]}>{v.name}</Text>
                            <TextInput
                                editable={["Phone number", "Rate", "Hostel"].includes(v.name) ? true : false}
                                placeholderTextColor={colorSchema.black}
                                style={{ fontFamily: 'reg', fontSize: 16, marginLeft: 20, color: '#4A4B4D' }}
                                placeholder={v.value}
                                onChangeText={(txt) => {
                                    v.st(txt)
                                }}></TextInput>

                        </View>
                    )
                })

            }

            {
                profile.user_type == "Cash Agent" ?
                    <View style={{ height: 56, borderRadius: 20, marginBottom: 10, justifyContent: 'center', paddingHorizontal: colorSchema.padding }}>
                        <Text style={[commonstyles.txt, { fontSize: 14, fontFamily: 'reg', marginLeft: 16, color: '#4A4B4D' }]}>Available</Text>

                        <Switch
                            trackColor={{ false: colorSchema.yellow, true: '#81b0ff' }}
                            thumbColor={isEnabled ? colorSchema.brown : '#81b0ff'}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                            style={{ marginLeft: 15 }}
                        />
                    </View>
                    : null
            }


            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                {edit ? <TouchableOpacity style={styles.continue} onPress={async () => { saveProfile() }} >

                    <Text style={[commonstyles.txt, { color: colorSchema.white, fontSize: 16, fontFamily: 'reg' }]}
                    >Save</Text>
                </TouchableOpacity> : null}
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {indicatorVisible ?
                    <ActivityIndicator size={"large"} color={colorSchema.brown} />
                    : null
                }
            </View>


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
    continue: {
        width: 130,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colorSchema.brown,
        marginTop: 35,
        alignItems: 'center',
        elevation: 2,
        borderRadius: 100
    },

});
