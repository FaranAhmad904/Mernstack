// ==========================================
// IMPORTS
// ==========================================

import {
    createContext,
    useContext,
    useReducer,
    useEffect
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";


// ==========================================
// CREATE CART CONTEXT
// ==========================================

const CartContext = createContext();


// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
    cartItems: []
};


// ==========================================
// CART REDUCER
// ==========================================

const cartReducer = (state, action) => {

    switch (action.type) {

        // ==========================================
        // LOAD CART FROM DATABASE
        // ==========================================

        case "SET_CART":
            return {
                ...state,
                cartItems: action.payload.items.map(
                    (item) => ({
                        ...item.product,
                        quantity: item.quantity
                    })
                )
            };


        // ==========================================
        // ADD PRODUCT TO CART
        // ==========================================

        case "ADD_TO_CART": {

            const product = action.payload;

            const existingProduct = state.cartItems.find(
                (item) => item._id === product._id
            );

            if (existingProduct) {

                return {
                    ...state,

                    cartItems: state.cartItems.map(
                        (item) =>
                            item._id === product._id
                                ? {
                                      ...item,
                                      quantity:
                                          item.quantity + 1
                                  }
                                : item
                    )
                };
            }

            return {
                ...state,

                cartItems: [
                    ...state.cartItems,

                    {
                        ...product,
                        quantity: 1
                    }
                ]
            };
        }


        // ==========================================
        // REMOVE PRODUCT
        // ==========================================

        case "REMOVE_FROM_CART":

            return {
                ...state,

                cartItems: state.cartItems.filter(
                    (item) =>
                        item._id !== action.payload
                )
            };


        // ==========================================
        // INCREASE QUANTITY
        // ==========================================

        case "INCREASE_QUANTITY":

            return {
                ...state,

                cartItems: state.cartItems.map(
                    (item) =>
                        item._id === action.payload
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity + 1
                              }
                            : item
                )
            };


        // ==========================================
        // DECREASE QUANTITY
        // ==========================================

        case "DECREASE_QUANTITY":

            return {
                ...state,

                cartItems: state.cartItems
                    .map(
                        (item) =>
                            item._id === action.payload
                                ? {
                                      ...item,
                                      quantity:
                                          item.quantity - 1
                                  }
                                : item
                    )
                    .filter(
                        (item) =>
                            item.quantity > 0
                    )
            };


        // ==========================================
        // CLEAR CART
        // ==========================================

        case "CLEAR_CART":

            return {
                ...state,
                cartItems: []
            };


        // ==========================================
        // DEFAULT
        // ==========================================

        default:
            return state;
    }
};


// ==========================================
// CART PROVIDER
// ==========================================

export const CartProvider = ({ children }) => {

    const [state, dispatch] = useReducer(
        cartReducer,
        initialState
    );

    const { token } = useAuth();


    // ==========================================
    // LOAD USER CART FROM DATABASE
    // ==========================================

    useEffect(() => {

        const fetchCart = async () => {

            // No logged-in user
            if (!token) {
                dispatch({
                    type: "CLEAR_CART"
                });

                return;
            }

            try {

                const response = await api.get(
                    "/cart"
                );

                dispatch({
                    type: "SET_CART",
                    payload: response.data
                });

            } catch (error) {

                console.error(
                    "FETCH CART ERROR:",
                    error
                );

            }
        };

        fetchCart();

    }, [token]);


    //dcreasequantity

    const decreaseQuantity = async (productId) =>
    {
        try
        {
            const item = state.cartItems.find(
                (item)=> item._id === productId
            )

            if(!item)
            {
                return;
            }

            if(item.quantity === 1)
            {
                await removeFromCart(productId);

                return;
            }

            const response = await api.put(`/cart/${productId}`,
                {
                    quantity: item.quantity -1
                }
            )

            dispatch({
                type:"SET_CART",
                payload:response.data.cart
            })
        }catch(error)
        {
            console.log("Decrease Quantity Error:",error)
        }
    }


    //increase Quantity

    const increaseQuantity = async (productId) => {
        try{
            const item = state.cartItems.find(
                (item)=>item._id===productId
            )
            if(!item) return;

            const response = await api.put(
                `/cart/${productId}`,
                {
                    quantity: item.quantity+1
                }
            );

            dispatch({
                type:"SET_CART",
                payload:response.data.cart
            })
        }catch(error)
        {
            console.log("increase quantity",error)
        }
    }


    //removefromcart

    const removeFromCart = async (productId) =>
    {
        try
        {
            const response = await api.delete(`/cart/${productId}`);

            dispatch({
                type:"SET_CART",
                payload : response.data.cart
            })
        }catch(error)
        {
            console.log("Remove From Cart error",error)
        }
    }
    
    const clearCart = async () => {

    try {

        const response = await api.delete(
            "/cart"
        );


        // ==========================================
        // UPDATE LOCAL STATE
        // ==========================================

        dispatch({
            type: "SET_CART",
            payload: response.data.cart
        });

    } catch (error) {

        console.error(
            "CLEAR CART ERROR:",
            error
        );
    }
};

















    // ==========================================
    // PROVIDER
    // ==========================================

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                dispatch,
                increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};


// ==========================================
// CUSTOM HOOK
// ==========================================

export const useCart = () => {

    return useContext(CartContext);

};