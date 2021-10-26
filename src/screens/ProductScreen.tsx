import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Image } from 'react-native';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { Picker } from '@react-native-picker/picker';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { useContext } from 'react';
import { ProductsContext } from '../context/ProductsContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useState } from 'react';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { };
const ProductScreen = ({ navigation, route }: Props) => {
    const { id = '', name = '' } = route.params;
    const [tempUri, setTempUri] = useState<string>('')
    const { categories, isLoading } = useCategories();
    const { loadProductById,addProduct,updateProduct,uploadImage } = useContext(ProductsContext);

    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: '',
    });

    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Sin Nombre del Producto'
        })
    }, [nombre]);

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        if (id.length === 0) return;
        const product = await loadProductById(id);
        setFormValue({
            ...form,
            categoriaId: product.categoria._id,
            img: product.img || ''
        })
    }

    const saveOrUpdate = async() => {
        if (id.length > 0) {
            //actualizando
            await updateProduct(categoriaId,nombre,id);
        } else {
            //new product
            const tempCategoriaId = categoriaId || categories[0]._id
           const newProduct =  await addProduct(tempCategoriaId,nombre);
           onChange(newProduct._id,"_id");
        }

    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5 ,
        },(resp)=> {
            if(resp.didCancel) return;  
            if(resp.assets[0].uri) {
                setTempUri(resp.assets[0].uri); 
                console.log(resp.assets[0].uri);
                uploadImage(resp,_id);               
            } else {
                return ;
            }          
        })
    }

    const takePhotoFromGalery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5 ,
        },(resp)=> {
            if(resp.didCancel) return;  
            if(resp.assets[0].uri) {
                setTempUri(resp.assets[0].uri); 
                console.log(resp.assets[0].uri);
                uploadImage(resp,_id);               
            } else {
                return ;
            }          
        })
    }
        
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del producto</Text>
                <TextInput
                    placeholder="Producto"
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, "nombre")}
                />
                {/* Picker  o Selector xD  */}
                <Text style={styles.label}>Categoria</Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, "categoriaId")}>
                    {
                        categories.map(c => (
                            <Picker.Item
                                label={c.nombre}
                                value={c._id}
                                key={c._id}
                            />
                        ))
                    }
                </Picker>
                <Button
                    title="Guardar"
                    // TODO: Por hacer
                    onPress={saveOrUpdate}
                    color="#5856D6"
                />

                {
                    (_id.length > 0) &&

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        <Button
                            title="Cámara"
                            // TODO: Por hacer
                            onPress={takePhoto}
                            color="#5856D6"
                        />
                        <View style={{ width: 10 }} />
                        <Button
                            title="Galería"
                            // TODO: Por hacer
                            onPress={takePhotoFromGalery}
                            color="#5856D6"
                        />
                    </View>
                }

                {
                    (img.length > 0 && tempUri==='') &&
                    <Image
                        source={{ uri: img }}
                        style={{
                            width: '100%',
                            height: 300,
                            marginTop: 20,
                        }}
                    />
                }
                {/* Mostrar imagen temporal */}

                {
                    (tempUri!== '') &&
                    <Image
                        source={{ uri: tempUri }}
                        style={{
                            width: '100%',
                            height: 300,
                            marginTop: 20,
                        }}
                    />
                }
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
    },
    label: {
        fontSize: 20,
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 10,
    }
});
export default ProductScreen
