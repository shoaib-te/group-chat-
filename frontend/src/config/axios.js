import axios from "axios";

 const APIaxiosinstinse = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true,
});

export default APIaxiosinstinse;