import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/Main/Home';
import MoreInfoscreen from '../screens/Main/More';
import ProfilePagescreen from '../screens/Main/Profile';
import Chatscreen from '../screens/Chatting/Chat'
import MessagesFeedScreen from '../screens/Chatting/MessageFeed';

const Stack = createNativeStackNavigator();

export default function RegistrationStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false}} name='Home' component={HomeScreen}/> 
            <Stack.Screen options={{headerShown:false}} name='MoreInfo' component={MoreInfoscreen}/> 
            <Stack.Screen options={{headerShown:false}} name='ProfilePage' component={ProfilePagescreen}/> 
            <Stack.Screen options={{headerShown:false}} name='ChatBox' component={Chatscreen}/> 
            <Stack.Screen options={{headerShown:false}} name='MsgsRequests' component={MessagesFeedScreen}/> 
        </Stack.Navigator>
    )

}