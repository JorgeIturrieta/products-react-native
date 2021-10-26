import React,{ useContext ,useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native'
import { loginStyles } from '../theme/loginTheme'
import WhiteLogo from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any,any>{}

const RegisterScreen = ({navigation}:Props) => {

    const { email, password,name, onChange } = useForm({
        name: '',
        email: '',
        password: '',

    });
    const  { signUp,errorMessage,removeError} = useContext(AuthContext);

    useEffect(() => {
        if(errorMessage.length === 0)
            return;
            Alert.alert(
                'Creación de Usuario Incorrecta',
                errorMessage ,
                [
                    {
                        text:'Ok',
                        onPress: removeError
                    }
                ]
                );
    }, [errorMessage])

    const onRegister = () => {
        console.log({email,password,name})
        Keyboard.dismiss();

        signUp({
            correo:email,
            nombre:name,
            password
        });

    }
    return (
        <>
            {/* Background */}

            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#5856D6' }}
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            >
                <View style={loginStyles.formContainer}>
                    {/* Keyboard avoid view */}
                    <WhiteLogo />
                    <Text style={loginStyles.title}>Registro</Text>
                    <Text style={loginStyles.label}>Nombre:</Text>
                    <TextInput
                        placeholder="Ingrese su nombre"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        onChangeText={(value) => onChange(value, 'name')}
                        onSubmitEditing={onRegister}
                        value={name}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                    <Text style={loginStyles.label}>Email:</Text>
                    <TextInput
                        placeholder="Ingrese su correo"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        onChangeText={(value) => onChange(value, 'email')}
                        onSubmitEditing={onRegister}
                        value={email}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Text style={loginStyles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder="Ingrese su contraseña"
                        placeholderTextColor="rgba(255,255,255,0.4)"

                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        onChangeText={(value) => onChange(value, 'password')}
                        onSubmitEditing={onRegister}
                        value={password}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                    />
                    {/* Boton signUp */}
                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onRegister}
                        >
                            <Text style={loginStyles.buttonText}>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Ir al login*/}
                        <TouchableOpacity
                            onPress={()=>navigation.replace('LoginScreen')}
                            activeOpacity={0.8}
                            style={ loginStyles.buttonReturn }
                        >
                            <Text style={loginStyles.buttonText}>Ir al login</Text>
                        </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default RegisterScreen
