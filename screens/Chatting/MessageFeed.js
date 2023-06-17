import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated, FlatList, ActivityIndicator, TextInput,SafeAreaView } from 'react-native';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import MessageRecieverList from '../../components/messageRecieverList';
import { backendConnector } from '../../backend';
//add message toast to display messages

export default function MessagesFeedScreen(props) {
    const opacity = useRef(new Animated.Value(0)).current
    const positioning = useRef(new Animated.Value(0)).current
    const connector = new backendConnector()
    const [extradetails, setExtraDetails] = useState({})
    const [indicatorVisible, setIndicatorVisible] = useState(false)
    const [messageRequests, setMessagesRequest] = useState([])
    const [search, setSearching] = useState("")
    const [searchResults, setSearchingResults] = useState([])

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }

    function AnimateInput() {
        //for animating search bar
        Animated.sequence([
            Animated.spring(positioning, { toValue: 1, useNativeDriver: false })
        ]).start()
    }

    function deAnimateInput() {
        //for animating search bar
        Animated.sequence([
            Animated.delay(100),
            Animated.spring(positioning, { toValue: 0, useNativeDriver: false })
        ]).start()
    }

    useEffect(() => {
        async function Checkingtoken() {
            setIndicatorVisible(true)
            await connector.getMessageRequests(setMessagesRequest, "Get", addMessage, setExtraDetails)
            setIndicatorVisible(false)


        }
        Checkingtoken()
    }, [])

    useEffect(() => {
        let ms = messageRequests.filter((v, i) => {
            let lowerCase = v.user.username.toLowerCase()
            if (lowerCase.includes(search.toLowerCase())) {
                return v
            }
        })

        setSearchingResults(ms)


    }, [search])

    function generateDataToGiveFlatlist() {
        if (search.length > 0) {
            return searchResults
        } else {
            return messageRequests
        }

    }



    const [messages, setmessages] = useState([])

    let counter = 0




    useEffect(() => {
        Animated.sequence([
            Animated.delay(50),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, })
        ]).start()
        //}
    }, [])









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
                    <Text style={[commonstyles.txt, { fontSize: 20, marginLeft: 10, marginTop: 17 }]}> Messages</Text>
                </View>


            </View>
            <Animated.View style={{
                transform: [{
                    translateY: positioning.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                    }),

                }],
                paddingHorizontal: 20,
                marginTop: 25

            }}>
                <TextInput
                    placeholder={"Search by name"}
                    style={styles.textinp}
                    onChangeText={(txt) => (setSearching(txt))}
                    onFocus={() => { AnimateInput() }}
                    onBlur={() => { deAnimateInput() }} />
            </Animated.View>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: 30 }}>
                {indicatorVisible ?
                    <ActivityIndicator size={"large"} color={colorSchema.brown} />
                    : null
                }
            </View>

            <FlatList
                data={generateDataToGiveFlatlist()}
                renderItem={({ item, index }) => {
                    return (
                        <MessageRecieverList v={item} i={index} navigation={props.navigation} extra={extradetails} />
                    )
                }}
            />

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
                    <Feather name="info" size={16} color={colorSchema.grey} />  Tips: A good internet connection is required to send messages and receive messages properly  
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
});
