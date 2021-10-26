import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react'
import { Alert, Keyboard } from 'react-native';
import { View, Text, TextInput, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import Background from '../components/Background';
import WhiteLogo from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> { }
const LoginScreen = ({ navigation }: Props) => {
    const {signIn,errorMessage,removeError} = useContext(AuthContext);
    const { email, password, onChange } = useForm({
        email: '',
        password: '',
    });
    useEffect(() => {
        if(errorMessage.length === 0)
            return;
            Alert.alert(
                'Login Incorrecto',
                errorMessage ,
                [
                    {
                        text:'Ok',
                        onPress: removeError
                    }
                ]
                );
    }, [errorMessage])
    const onLogin = () => {  
        Keyboard.dismiss();
        signIn({correo:email,password});
    }
    return (
        <>
            {/* Background */}
            <Background />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            >
                <View style={loginStyles.formContainer}>
                    {/* Keyboard avoid view */}
                    <WhiteLogo />
                    <Text style={loginStyles.title}>Login</Text>
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
                        onSubmitEditing={onLogin}
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
                        onSubmitEditing={onLogin}
                        value={password}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                    />

                    {/* Boton login */}

                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onLogin}
                        >
                            <Text style={loginStyles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Crear una nueva cuenta */}

                    <TouchableOpacity
                        onPress={() => navigation.replace('RegisterScreen')}
                        activeOpacity={0.8}
                        style={loginStyles.buttonReturn}
                    >
                        <Text style={loginStyles.buttonText}>Crear Cuenta</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default LoginScreen
