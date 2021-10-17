import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "https://sit313-khanhdo-iservice.herokuapp.com/",
})

export default axiosInstance