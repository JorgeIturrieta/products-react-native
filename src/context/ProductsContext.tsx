import React, { createContext, useEffect, useState } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import cafeApi from '../api/cafeApi';
import { Producto, ProductsResponse } from '../interfaces/productsInterfaces';

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto> ;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    loadProductById: (productId: string) => Promise<Producto>;
    uploadImage: (data: ImagePickerResponse, productId: string) => Promise<void> // Todo: cambiar any
}
export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) =>  {
    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);
    const loadProducts = async () => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        setProducts([...resp.data.productos]);
    };
    const addProduct = async (categoryId: string, productName: string):Promise<Producto> => {
       
            const resp = await cafeApi.post<Producto>('/productos', {
                nombre: productName,
                categoria: categoryId,
            });
            setProducts([...products, resp.data]);
            return resp.data ;
        };
    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        try {
            console.log({ productName, productId });
            const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
                nombre: productName,
                categoria: categoryId,
            });
            setProducts(products.map(p => {
                return (p._id === productId) ? resp.data : p
            }));

        } catch (error) {
            console.log(error);
        }

    };
    const deleteProduct = async (productId: string) => { };
    const loadProductById = async (productId: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${productId}`);
        return (resp.data);
    };
    const uploadImage = async (data: ImagePickerResponse, productId: string) => {
         const fileToUpload = {
             uri: data.assets[0].uri,
             type: data.assets[0].type,
             name: data.assets[0].fileName ,
         }
         
         const formData = new FormData();
         formData.append('archivo',fileToUpload);

         // Realizar petición al backend

         try {
             const resp = await cafeApi.put<Producto>(`/uploads/productos/${productId}`,formData);
            console.log(resp.data);
             
         } catch (error) {
             console.log(error);
         }

     } // Todo: cambiar any
    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}>
            {children}
        </ProductsContext.Provider>
    )
}