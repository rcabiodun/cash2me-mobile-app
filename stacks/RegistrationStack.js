import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Loginscreen from '../screens/Registration/Login';
import Profilescreen from '../screens/Registration/Profile';
import RegistrationScreeen from '../screens/Registration/Registration';
//import Loginscreen from '../screens/Registration/login';
const Stack = createNativeStackNavigator();

export default function RegistrationStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false}} name='Registration' component={RegistrationScreeen}/> 
            <Stack.Screen options={{headerShown:false}} name='Profile' component={Profilescreen}/> 
            <Stack.Screen options={{headerShown:false}} name='Login' component={Loginscreen}/> 
        </Stack.Navigator>
    )

}