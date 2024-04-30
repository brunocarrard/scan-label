import { defineStore } from "pinia";
import { authStore } from "./auth.js";
import axios from 'axios'

export const shippingStore = defineStore("shipping", {
    state: () => ({
      _orderData: {},
    }),
    actions: {
      async getOrderData(ordNr) {
        try {
            const response = await axios.get('https://192.168.0.154:4000/', {
                                params: {
                                    value: ordNr,
                                },
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });
            let rearrangedArray = [];
            let data = response.data
            data.parts.forEach(obj => {
                if (!obj.ParentPart) {
                rearrangedArray.push(obj);
                const children = data.parts.filter(child => child.ParentPart === obj.PartCode);
                rearrangedArray.push(...children);
                }
            });
            data.parts = rearrangedArray
            this.$patch({ _orderData: data })
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
      async postScans(payload) {
        try {
            const response = await axios.post('https://192.168.0.154:4000/', payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response
        } catch(error) {
            if (error.response.status == '401') {
                try {
                    await authStore().renewToken()
                    // this.postScans(payload)
                    throw error
                } catch (error2) {
                    throw error2
                }
            } else {
                throw error
            }
        }
      }
    },
  });
  