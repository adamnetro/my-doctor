import { useState } from "react";
import { Formik } from "formik";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Button, Text, Input, Icon } from "react-native-elements";
import * as yup from "yup";
import styles from "../styles/authStyles";
import axios from "../config/axios";
import { SIGNIN_URL } from "../config/urls";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen(props) {
  const {navigation} = props
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [alert, setAlert] = useState({
    title: "",
    message: "",
    type: "",
  });

  const signInvalidationSchema = yup.object().shape({
      email: yup.string().email('يجب ادخال بريد الكتروني صحيح').required('البريد الالكتروني مطلوب'),
      password: yup.string().required('يجب عليك ادخال كلمة مرور')
  })

    const _signIn = async (values) => {
      setLoading(true)
      const body = {
        email:values.email,
        password:values.password,
      }
      try{
        const response = await axios.post(SIGNIN_URL, body).then(res => AsyncStorage.setItem('accessToken', res.data.accessToken))
        setLoading(false)
        navigation.navigate('Home')
      }catch(e){
        console.log(e)
        setLoading(false)
        setAlert({
          title:"تنبيه",
          message:e.response.data.message,
          type:"alert"
        })
        setVisible(true)
      }

    }
  return (
    <ScrollView>
      <Loader loading={loading} title="جاري تسجيل دخول" />
      <Alert visible={visible} title={alert.title} message={alert.message} type={alert.type} onClose={() => setVisible(false)} />
      <View style={styles.container}>
        <Icon raised name="user" type="font-awesome" color="#f50" size={50} />
        <Text h4>تسجيل الدخول</Text>
      </View>
      <KeyboardAvoidingView behavior="padding" enabled>
      <View style={styles.container}>
        <Formik 
        initialValues={{email:'',password:''}}
        validationSchema={signInvalidationSchema}
        onSubmit={values => _signIn(values)}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
                <>
                <Input name="email" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} placeholder="البريد الالكتروني" styles={[styles.textInput, errors.email && styles.textError]} keyboardType="email-address" />
                {errors.email && <Text p style={styles.textError}>{errors.email}</Text>}
                <Input name="password" secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} placeholder="كلمة المرور" styles={[styles.textInput, errors.password && styles.textError]} />
                {errors.password && <Text p style={styles.textError}>{errors.password}</Text>}
                <Button title="دخول" style={{marginTop: '20px'}} onPress={handleSubmit} disabled={!isValid}/>
                </>
            )}
        </Formik>
      </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
