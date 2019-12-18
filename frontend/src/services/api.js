import axios from 'axios'
import config from '../../bin/config'

axios.defaults.baseURL = config.server.apiUrl;
axios.defaults.withCredentials = false;
axios.defaults.Accept = 'application/json';
axios.defaults['Content-Type'] = 'application/json';

export const api = axios;

export const apiToken = (token) => {
    axios.defaults.headers.common['Authorization'] = token;
};