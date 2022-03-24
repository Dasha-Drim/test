import axios from 'axios';
import config from "../config/config.js";
export default axios.create({
  baseURL: config.backend+"/",
  responseType: "json",
  withCredentials: "true", 
  credentials: "include"
});