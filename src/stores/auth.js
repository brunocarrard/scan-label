import { defineStore } from "pinia";
import axios from "axios";
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
import router from "../router"; 

export const authStore = defineStore("auth", {
  actions: {
    async auth(payload) {
        try {
            // console.log(import.meta.env.API_ADDRESS)
            const response = await axios.post('http://127.0.0.1:5000/login', payload)
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('user', response.data.isah_user)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            return response
        } catch(error) {
            throw error
        }
    },
    async renewToken() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/refresh', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
          }
        })
        localStorage.setItem('token', response.data.access_token)
        toastify('warning', 'Your session was restored, please try again.')
        return response
      } catch(error) {
        toastify('error', 'Your session was expired, please login again.')
        localStorage.clear()
        router.push('/login')
        throw error
      }
    }
  },
});
