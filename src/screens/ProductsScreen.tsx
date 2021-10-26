import React, { useEffect, useState,useContext } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity,RefreshControl } from 'react-native';
import { ProductsContext } from '../context/ProductsContext';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackParams } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { };
export const ProductsScreen = ({ navigation }: Props) => {
    const { products, loadProducts } = useContext(ProductsContext);
    const [refreshing, setRefreshing] = useState(false);

    // Pull to refresh
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style= {{marginRight:20}}
                    onPress={()=> navigation.navigate('ProductScreen',{})}
                >
                   <Text>Agregar</Text> 
                </TouchableOpacity>
            )
        })
    }, [])
    const loadProductsFromBackend = async() => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    }
    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>
            <FlatList
                data={products}
                keyExtractor={(product) => product._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('ProductScreen', {
                            id: item._id,
                            name: item.nombre,
                        })}
                    >
                        <Text style={styles.productName}> {item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={loadProductsFromBackend}
                   
                    title="Cargando..." // ios
                    
                />
                }
            >
            </FlatList>
        </View>
    )
}
const styles = StyleSheet.create({
    productName: {
        fontSize: 20,
    },
    itemSeparator: {
        borderBottomWidth: 5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginVertical: 5,
    }
});
export default ProductsScreen
