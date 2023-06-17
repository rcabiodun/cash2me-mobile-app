import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableWithoutFeedback, FlatList,ActivityIndicator, TextInput, SafeAreaView,Animated, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, EvilIcons, } from '@expo/vector-icons';
import { colorSchema, styles as commonstyles } from '../../setup';
import Message from '../../components/messagetoast';
import { hideAsync } from 'expo-splash-screen';

import AnimatedAgentList from '../../components/animatedAgentList';
import moment from 'moment/moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendConnector } from '../../backend';

let counter = 1

export default function Homescreen({ navigation }) {
    const positioning = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(0)).current
    const [isrefreshing, setrefresh] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState({})
    const [agents, setAgents] = useState([])
    const connector = new backendConnector()
    const [messages, setmessages] = useState([])
    const [agents_ordering, setAgents_orderding] = useState("ascending")
    const [ordering, setOrderding] = useState(0)
    const [greeting, setGreeting] = useState(0)
    const [search, setSearching] = useState("")
    const [username, setUsername] = useState("")
    const [searchResults, setSearchingResults] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [indicatorVisible, setIndicatorVisible] = useState(false)

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



    useEffect(() => {
        async function Checkingtoken() {
            let username = await AsyncStorage.getItem('username')
            setrefresh(true)
            setIndicatorVisible(true)
            await connector.getAgents(setAgents, "Get", addMessage,navigation)
            setrefresh(false)
            setIndicatorVisible(false)
            await connector.saveUsername(null, "Get", addMessage)


            //setAgents(users.sort((a, b) => a.rate - b.rate))
            generateGreetings()
            Animated.sequence([
                //animate blue button at the end
                Animated.spring(opacity, { toValue: 1, useNativeDriver: true, delay: 800 })
            ]).start()

            setUsername(username)
        }
        Checkingtoken()
    }, [])

    useEffect(() => {
        let sR = agents.filter((v, i) => {
            let lowerCase = v.hostel.toLowerCase()
            if (lowerCase.includes(search.toLowerCase())) {
                return v
            }
        })
        setSearchingResults(sR)


    }, [search])

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }


    function set_ordering() {
        //Arranges search results and main data in ascending and descending order 
        setAgents_orderding((prevstate) => {
            if (prevstate == "ascending") {
                if (search.length > 0) {
                    setSearchingResults((prevAgents) => {
                        return prevAgents.sort((a, b) => b.rate - a.rate)
                    })
                } else {
                    setAgents((prevAgents) => {
                        return prevAgents.sort((a, b) => b.rate - a.rate)
                    })
                }

                return "descending"

            } else {
                if (search.length > 0) {
                    setSearchingResults((prevAgents) => {
                        return prevAgents.sort((a, b) => a.rate - b.rate)
                    })
                } else {
                    setAgents((prevAgents) => {
                        return prevAgents.sort((a, b) => a.rate - b.rate)
                    })
                }
                return "ascending"
            }
        })
    }

    function generateGreetings() {
        var currentHour = moment().format("HH");
        console.log(currentHour)
        if (currentHour >= 3 && currentHour < 12) {
            setGreeting("Good Morning");
        } else if (currentHour >= 12 && currentHour < 15) {
            setGreeting("Good Afternoon");
        } else if (currentHour >= 15 && currentHour < 20) {
            setGreeting("Good Evening");
        } else if (currentHour >= 20 && currentHour < 23) {
            setGreeting("Good Night");
        } else {
            setGreeting("Hello")
        }
    }

    function generateDataToGiveFlatlist() {
        if (search.length > 0) {
            return searchResults
        } else {
            return agents
        }

    }
    //conneting to my api


    //for skipping to homepage when logged in 



    return (
        <TouchableWithoutFeedback  >
            <View style={styles.container} onLayout={async () => { await hideAsync() }}>
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.modalcontainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}> <Feather name="smartphone" size={24} color={colorSchema.yellow} /> {selectedAgent.phone_number}</Text>
                            <Text style={styles.modalText}>or</Text>
                            <TouchableOpacity style={[styles.continue2, {
                                backgroundColor: colorSchema.white,
                                borderColor: colorSchema.brown,
                            }]}

                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.push('ChatBox', { receiver_id: selectedAgent._id ,receiver_name:selectedAgent.user.username})
                                }} >

                                <Text style={[commonstyles.txt, { color: colorSchema.brown, fontSize: 16, fontFamily: 'reg' }]}
                                >Live chat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(false)}>
                                <EvilIcons name="close" size={22} color={colorSchema.yellow} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.Header}>
                    <Text style={[commonstyles.txt, { fontSize: 25, }]}>{greeting}, {username}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                    <Animated.View style={{
                        transform: [{
                            translateY: positioning.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -10],
                            }),

                        }],

                    }}>
                        <TextInput
                            placeholder={"Search by hall"}
                            style={styles.textinp}
                            onChangeText={(txt) => (setSearching(txt))}
                            onFocus={() => { AnimateInput() }}
                            onBlur={() => { deAnimateInput() }} />
                    </Animated.View>
                    <TouchableOpacity onPress={() => { set_ordering(); setOrderding((prev) => prev + 1); console.log(search) }}>
                        {agents_ordering == "ascending" ?
                            <MaterialCommunityIcons name="order-numeric-ascending" size={26} color={colorSchema.yellow} /> :
                            <MaterialCommunityIcons name="order-numeric-descending" size={26} color={colorSchema.yellow} />
                        }
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30 }}>
                    {indicatorVisible ?
                        <ActivityIndicator size={"large"} color={colorSchema.brown} />
                        : null
                    }
                </View>
                <FlatList
                    data={generateDataToGiveFlatlist()}
                    onRefresh={async () => console.log("hey bitch")}
                    refreshing={isrefreshing}
                    contentContainerStyle={{ paddingHorizontal: 27, marginTop: 10 }}
                    renderItem={({ item, index }) => {
                        return (<AnimatedAgentList v={item} key={index} i={index} ordering={ordering} setModalVisibility={setModalVisible} highlightedAgent={setSelectedAgent} />)
                    }}
                />
                <Animated.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{
                        translateY: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [65, 0],
                        }),

                    }],



                    opacity,

                }}>
                    <TouchableOpacity style={styles.moreBtn} onPress={() => { navigation.navigate("MoreInfo") }}>
                        <Feather name="more-horizontal" size={24} color={colorSchema.white} />
                    </TouchableOpacity>
                </Animated.View>

            </View>
        </TouchableWithoutFeedback>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 13,


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
        width: 270,
        padding: 30,
        justifyContent: 'center',
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
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        marginTop: 20,
        borderWidth: 1,
        borderColor: colorSchema.yellow
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 10,
        fontFamily: "reg",
        fontSize: 18,
        color: colorSchema.black
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
    },
    Header: {
        paddingHorizontal: 15,
        paddingVertical: 30
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
        height: 30,
        backgroundColor: colorSchema.brown,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1
    },
    moreBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: colorSchema.brown
    }
});
