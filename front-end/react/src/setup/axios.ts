import axios from "axios";

const { REACT_APP_API_URL } = process.env;

axios.defaults.baseURL = REACT_APP_API_URL;
axios.defaults.withCredentials = true;
