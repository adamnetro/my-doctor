import { useEffect, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/authStyles";
import ProfileForm from "../components/ProfileForm";
import axios from "../config/axios";
import { SIGNUP_URL } from "../config/urls";
import * as Location from "expo-location";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

export default function SignUpScreen(props) {
  const {navigation} = props
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    type: "",
  });
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const _signUp = async (values) => {
    setLoading(true);
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType ? "doctor" : "normal",
      specialization: values.specialization,
      workingHours: values.workingHours,
      address: values.address,
      phone: values.phone,
      location: {
        latitude: location ? location.latitude : null,
        longitude: location ? location.longitude : null,
      },
    };
    try {
      const response = await axios.post(SIGNUP_URL, body).then((res) => console.log(res));
      setLoading(false);
      setAlert({
        title:'تسجيل ناجح',
        message: 'تم تسجيل حساب بنجاح و يمكنك انتقال الى صفحة تسجيل الدخول هل تريد الانتقال الى صفحة تسجيل الدخول',
        type:'question'
      })
      setVisible(true)
    } catch (e) {
      console.log(e.response);
      setLoading(false);
      setAlert({
        title:'تنبيه',
        message: e.response.data.errors[0].message,
        type:'alert'
      })
      setVisible(true)
    }
  };

  return (
    <ScrollView>
      <Loader title="جاري إنشاء حساب جديد" loading={loading} />
      <Alert visible={visible} title={alert.title} message={alert.message} type={alert.type} onClose={() => setVisible(false)} onClick={() => {navigation.navigate("SignIn"); setVisible(false)}}/>
      <View style={styles.container}>
        <Icon raised name="user" type="font-awesome" color="#f50" size={50} />
        <Text h4>تسجيل حساب جديد</Text>
      </View>
      <KeyboardAvoidingView behavior="padding" enabled>
        <View container={styles.container}>
          <ProfileForm submit={(values) => _signUp(values)} user={null} disabled={false} buttonTitle="تسجيل حساب" checkBox={true}/>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
