const { default: AsyncStorage } = require("@react-native-async-storage/async-storage")
//const jwt = require('jsonwebtoken')

class backendConnector {

    constructor() {
        this.url = "https://cash2me.onrender.com/api"
    }
    async setRequestOptions(method) {
        this.token = await AsyncStorage.getItem("token")
        this.requestOptions = {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': this.token },
        }
    }

    async registration(st, method, addMessage, { username, password }, navigation) {
        await this.setRequestOptions(method)
        console.log(username)
        console.log(password)
        this.requestOptions.body = JSON.stringify({ username, password })
        try {
            let response = await fetch(`${this.url}/account/registration`, this.requestOptions)

            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                let token = result.auth_token
                console.log(result.auth_token)
                await AsyncStorage.setItem('token', token, (err) => { console.log(err) })
                // let decodedToken = jwt.decode(token)
                //await AsyncStorage.setItem("username", "sane", (err) => { console.log(err) })
                navigation.push('Profile')
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async CreateProfile(st, method, addMessage, payload, navigation) {
        await this.setRequestOptions(method)
        this.requestOptions.body = JSON.stringify(payload)
        try {
            let response = await fetch(`${this.url}/account/profile`, this.requestOptions)

            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                addMessage("Profile created")
                navigation.replace('HomeStack')
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async getAgents(st, method, addMessage, navigation) {
        await this.setRequestOptions(method)
        try {
            let response = await fetch(`${this.url}/home/home_page?page=1`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
                if (result.message == "Account has been deleted") {
                    await AsyncStorage.removeItem('token')
                    await AsyncStorage.setItem("msg", result.message, (err) => { console.log(err) })
                    navigation.replace('RegistrationStack')
                }
                if (result.message == "Profile not created") {
                    await AsyncStorage.setItem("msg", result.message, (err) => { console.log(err) })
                    navigation.replace('RegistrationStack', { screen: "Profile" })
                }
            } else {
                st(result.sort((a, b) => a.rate - b.rate))
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async getMessageRequests(st, method, addMessage, setExtraDetails) {
        await this.setRequestOptions(method)
        try {
            let response = await fetch(`${this.url}/home/friends`, this.requestOptions)
            let result = await response.json()
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                st(result)
                setExtraDetails(result.user)
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async getProfile(st, method, addMessage, setExtraDetails, toggleSwitch) {
        await this.setRequestOptions(method)
        try {
            let response = await fetch(`${this.url}/account/profile`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                console.log(result)
                toggleSwitch(result.is_available)
                setExtraDetails(result.user)
                st(result)
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async saveUsername(st, method, addMessage) {
        await this.setRequestOptions(method)
        try {
            let response = await fetch(`${this.url}/account/profile`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                await AsyncStorage.setItem("username", result.user.username, (err) => { console.log(err) })
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async Login(st, method, addMessage, payload, navigation) {
        await this.setRequestOptions(method)
        this.requestOptions.body = JSON.stringify(payload)
        try {
            let response = await fetch(`${this.url}/account/login`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                let token = result.auth_token
                console.log(result.auth_token)
                addMessage("Logging you in boss")
                await AsyncStorage.setItem('token', token, (err) => { console.log(err) })
                //let decodedToken = jwt.decode(token)

                setTimeout(() => {
                    navigation.replace('HomeStack')

                }, 100)
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }

    async updateProfile(st, method, addMessage, payload, setExtraDetails, toggleSwitch) {
        await this.setRequestOptions(method)
        this.requestOptions.body = JSON.stringify(payload)
        try {
            let response = await fetch(`${this.url}/account/profile`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message)
            } else {
                console.log(result)
                toggleSwitch(result.is_available)
                setExtraDetails(result.user)
                addMessage("Saved successfully")
                st(result)
            }
        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection")
        }
    }
}



module.exports.backendConnector = backendConnector