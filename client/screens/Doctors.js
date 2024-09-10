import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, KeyboardAvoidingView, View } from 'react-native';
import { ListItem, Text, Avatar, SearchBar } from 'react-native-elements';
import { transformName } from '../config/helpers'
import { DOCTORS_URL } from '../config/urls';
import styles from '../styles/doctorsStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axios'
import Loader from '../components/Loader'
import TouchableScale from 'react-native-touchable-scale';
import DoctorDetails from './DoctorDetails';
export default function DoctorsScreen() {
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [value, setValue] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  useEffect(() => {
    const timerId = setTimeout(() => {
      _getDoctors(value)
    }, 1000)
    return () => clearTimeout(timerId)
  }, [value])

  const _getDoctors = async (query) => {
    setLoading(true)

    try{
      const token = await AsyncStorage.getItem("accessToken");
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      const response = await axios.get(DOCTORS_URL, {
        params: {q: query ? query : ''}
      })

      setDoctors(response.data)
      setLoading(false)
    }catch(e){
      console.log(e)
      setLoading(false)
    }
  }
  const itemPressHandler = (itemId) => {
    setSelectedDoctor(doctors.find(doctor => doctor.id === itemId))
  }
  return (
    <View style={styles.container}>
      <Loader loading={loading} title="جاري تسجيل دخول" />
      <ScrollView>
        <DoctorDetails selectedDoctor={selectedDoctor} closeModal={() => setSelectedDoctor(null)}/>
        <KeyboardAvoidingView behavior='padding' enabled>
          <SearchBar 
          placeholder='إبحث هنا...'
          containerStyle={{backgroundColor:'#FBFBFB'}}
          inputContainerStyle={{backgroundColor:'#E5E4EA'}}
          style={{direction: 'rtl'}}
          value={value}
          onChangeText={Text => setValue(Text)}
          lightTheme
          round/>
        <SafeAreaView>
          {doctors.length !== 0 ? 
          (doctors.map((l, i) => {
            return <ListItem key={i} Component={TouchableScale} friction={90} tension={100} activeScale={0.95} onPress={() => itemPressHandler(l.id)}>
              <Avatar size={40} rounded title={transformName(l.name)} containerStyle={{backgroundColor: '#3d4db7'}} />
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
                <ListItem.Subtitle>{l.profile.specialization}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          }
        ))
        : <Text style={styles.noDoctorsText}>لا يوجد لدينا أطباء</Text>
        }
        </SafeAreaView>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
