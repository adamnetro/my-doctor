import { Formik } from "formik";
import * as yup from "yup";
import { Button, Input, Text, CheckBox } from "react-native-elements";
import styles from "../styles/authStyles";
import MapViewContainer from "./MapViewComponent";

export default function ProfileForm(props) {
    const validationSchema = yup.object().shape({
        name: yup.string().required('إسم مستخدم مطلوب'),
        email: yup.string().email('يجب ادخال بريد الكتروني بشكل صحيح').required('البريد الالكتروني مطلوب'),
        password: yup.string().required('يجب ادخال كلمة مرور صالحة').min(5, 'يجب ان تكون كلمة مرور اكثر من خمسة احرف'),
        userType: yup.boolean(),
        specialization: yup.string().when('userType', {
            is:true,
            then: (schema) => schema.required('يجب عليك ادخال تخصص')
        }),
        workingHours: yup.string().when('userType', {
            is:true,
            then: (schema) => schema.required('يجب عليك ادخال ساعات العمل')
        }),
        address: yup.string().when('userType', {
            is:true,
            then: (schema) => schema.required('يجب عليك ادخال العنوان')
        }),
        phone: yup.string().when('userType', {
            is:true,
            then: (schema) => schema.required('يجب عليك ادخال رقم الهاتف')
        })
    })
    
  return (
    <Formik
      initialValues={{
        name: props.user?.name || "",
        email: props.user?.email || "",
        password: props.user?.password || "",
        userType: props.user?.userType == "doctor",
        specialization: props.user?.profile?.specialization || "",
        workingHours: props.user?.profile?.workingHours || "",
        address: props.user?.profile?.address || "",
        phone: props.user?.profile?.phone || "",
        latitude: props.user?.latitude || null,
        longitude: props.user?.longitude || null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => props.submit(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, values, setFieldValue, isValid}) => (
        <>
          <Input name="name" placeholder="الإسم" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} style={[styles.textInput, errors.name && styles.errorInput]}/>
          {errors.name && <Text p style={styles.textError}>{errors.name}</Text>}
          <Input name="email" placeholder="بريد الإلكتروني" value={values.email} keyboardType="email-address" disabled={props.disabled} onChangeText={handleChange('email')} onBlur={handleBlur('email')} style={[styles.textInput, errors.email && styles.errorInput]}/>
          {errors.email && <Text p style={styles.textError}>{errors.email}</Text>}
          <Input name="password" secureTextEntry placeholder="كلمة المرور" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} style={[styles.textInput, errors.password && styles.errorInput]}/>
          {errors.password && <Text p style={styles.textError}>{errors.password}</Text>}
          {props.checkBox &&
          <CheckBox checked={values.userType} name="userType" title="أنا طبيب" onPress={() => setFieldValue('userType', !values.userType)}/>
}
          {values.userType && (
            <>
          <Input name="specialization" placeholder="التخصص" value={values.specialization} onChangeText={handleChange('specialization')} onBlur={handleBlur('specialization')} style={[styles.textInput, errors.specialization && styles.errorInput]}/>
          {errors.specialization && <Text p style={styles.textError}>{errors.specialization}</Text>}
          <Input name="workingHours" placeholder="ساعات العمل" value={values.workingHours} onChangeText={handleChange('workingHours')} onBlur={handleBlur('workingHours')} style={[styles.textInput, errors.workingHours && styles.errorInput]}/>
          {errors.workingHours && <Text p style={styles.textError}>{errors.workingHours}</Text>}
          <Input name="address" placeholder="العنوان" value={values.address} onChangeText={handleChange('address')} onBlur={handleBlur('address')} style={[styles.textInput, errors.address && styles.errorInput]}/>
          {errors.address && <Text p style={styles.textError}>{errors.address}</Text>}
          <Input name="phone" placeholder="رقم الهاتف" value={values.phone} onChangeText={handleChange('phone')} onBlur={handleBlur('phone')} style={[styles.textInput, errors.phone && styles.errorInput]}/>
          {errors.phone && <Text p style={styles.textError}>{errors.phone}</Text>}
          {values.latitude && 
              <MapViewContainer location={{
                latitude: values.latitude,
                longitude: values.longitude
              }}
              lat={(value) => setFieldValue('latitude', value)}
              lng={(value) => setFieldValue('longitude', value)}
              />
          }
          </>
          )}
          <Button title={props.buttonTitle} style={{marginTop: '20px'}} onPress={handleSubmit} disabled={!isValid}/>
        </>
      )}
    </Formik>
  );
}
