import { StyleSheet, View,Text,SafeAreaView, TouchableOpacity, Animated,ScrollView,Image, TextInput, FlatList} from 'react-native';

let colorSchema={
    black:'#100F1F',
    brown:'#2D7BD8',
    yellow:'#FEB561',
    grey:'#B0B0B0',
    lightgray:'#E5E4E2',

    search:'#6C6C6C',
    white:'#FFFFFF',
    font:'poppins',
    padding:21
}

const styles=StyleSheet.create({
    root:{
      flex:1,
      
    },header:{
      marginTop:15,
      paddingHorizontal:colorSchema.padding,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      fontFamily:'bold'
    },subHeader:{
      flexDirection:'row',
      justifyContent:'space-between',
  
    }, txt:{
      fontFamily:'bold',
      fontSize:24,
      fontWeight:'500',
      color:colorSchema.black
    },
  
  
  })
  


export {colorSchema,styles}