import axios from 'axios'

axios.defaults.baseURL = ''
axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest"
};
axios.defaults.withCredentials = true

axios.interceptors.response.use(response => {
    return response.data
})
