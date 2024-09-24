import { defineStore } from "pinia";
import axios from 'axios'
import { authStore } from "./auth.js";

export const stockStore = defineStore("stock", {
    state: () => ({
        _warehouses: [],
        _parts: []
    }),
    actions: {
        async getWarehouses() {
            try {
                const response = await axios.get('https://192.168.0.154:4000/warehouses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.$patch({ _warehouses: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        await authStore().renewToken()
                        // this.getOrderData(ordNr)
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getParts(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4000/stock/parts', {
                    params: {
                        warehouse: payload
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.$patch({ _parts: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        await authStore().renewToken()
                        // this.getOrderData(ordNr)
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        }
    }}
)