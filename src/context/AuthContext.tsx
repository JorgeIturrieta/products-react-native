import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, LoginResponse, SignInCredential, SignUpCredential } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from "./authReducer";
import cafeApi from '../api/cafeApi';
import axios, { AxiosError } from 'axios';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (obj: SignUpCredential) => Promise<void>;
    signIn: ({ correo, password }: SignInCredential) => Promise<void>;
    logOut: () => void;
    removeError: () => void;
}
const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, authInitialState);
    useEffect(() => {
        checkToken();
    }, []);
    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        // No hay token
        if (!token) {
            return dispatch({
                type: 'notAuthenticated'
            })
        }
        // Hay token renovar o validar
        const resp = await cafeApi.get<LoginResponse>('/auth');
        if (resp.status !== 200) {
            return dispatch({ type: 'notAuthenticated' });
        }
        await AsyncStorage.setItem('token', resp.data.token);
        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario,
            }
        })

    }
    const signIn = async ({ correo, password }: SignInCredential) => {
        try {
            const resp = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });            
            dispatch({
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data.usuario,
                }
            })
            await AsyncStorage.setItem('token', resp.data.token);
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data.msg);
                dispatch({
                    type: 'addError',
                    payload: err.response?.data.msg || 'Información incorrecta'
                })
            } else {
                console.log(err);
            }
        }
    };
    const signUp = async ({ nombre,correo, password }: SignUpCredential) => {

        try {
            
            const resp = await cafeApi.post<LoginResponse>('/usuarios', { nombre,correo, password });            
           
            dispatch({
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data.usuario,
                }
            })
            await AsyncStorage.setItem('token', resp.data.token);
        } catch (err: any | AxiosError) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data.msg);
                dispatch({
                    type: 'addError',
                    payload: err.response?.data.errors[0].msg || 'Datos incorrectos'
                })
            } else {
                console.log(err);
            }
        }

    };
    const logOut = () => {
        dispatch({ type: 'logout' });

    };
    const removeError = async () => {
        dispatch({ type: 'removeError' });
        await AsyncStorage.removeItem('token');
    };
    return (
        <AuthContext.Provider value={{
            signUp,
            signIn,
            logOut,
            removeError,
            ...state,
        }}>
            {children}
        </AuthContext.Provider>
    )
}