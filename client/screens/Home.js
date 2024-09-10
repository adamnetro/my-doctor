import { useEffect, useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/homeStyles'


export default function HomeScreen(props) {
    const {navigation} = props
    const [token, setToken] = useState('')

    useEffect(() => {
      const refreshToken = navigation.addListener('focus', () => {
        _checkToken()
      })
      return refreshToken
    }, [navigation])
    const _checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setToken(token)
    }
  return (
    <ImageBackground source={require('../assets/doc-bg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>أهلا بك في تطبيق طبيبي</Text>
        <Text style={styles.text}>التطبيق الاول لربط بين اطباء و المرضى</Text>
        {token ? 
        <>
        <Button title="استعراض قائمة الأطباء" onPress={() => navigation.navigate('Doctors')} />
        <Button type="clear" title="صفحة الشخصية" onPress={() => navigation.navigate('Profile')}>
          <Text styles={styles.labelButton}>استعراص ملف الشخصي</Text>
        </Button>
        </>
        :
        <>
        <Button title="تسجيل دخول" onPress={() => navigation.navigate('SignIn')} />
        <Button type="clear" title="تسجيل مستخدم جديد" onPress={() => navigation.navigate('SignUp')}>
          <Text styles={styles.labelButton}>انشاء حساب جديد</Text>
        </Button>
        </>
      }
      </View>
    </ImageBackground>
  );
}
