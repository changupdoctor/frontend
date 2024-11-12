import axios from 'axios';

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: `http://18.143.101.136:8080`,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  },
  xhrFields: {
    withCredentials: false,
  },
});