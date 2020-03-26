import axios from 'axios';
import constants from '../Context/constants';

const environment = process.env.NODE_ENV;

export const baseUrl = environment === 'development' ? 'http://localhost:5000'
  :'';


export const api = {
  get: (url:string, config?: any) => {
    const apiKey = () => localStorage.getItem(constants.AUTH_KEY_TOKEN);
    const baseConfig = {headers: { authorization: apiKey() }};
    const extraConfig = {...config, ...baseConfig};
    return axios.get(`${baseUrl}/api${url}`, extraConfig);
  },
  post: (url:string, data:any, config?: any) => {
    const apiKey = () => localStorage.getItem(constants.AUTH_KEY_TOKEN);
    const baseConfig = {headers: { authorization: apiKey() }};
    const extraConfig = {...config, ...baseConfig};
    return axios.post(`${baseUrl}/api${url}`, data,  extraConfig);
  }, put: (url:string, data:any, config?: any) => {
    const apiKey = () => localStorage.getItem(constants.AUTH_KEY_TOKEN);
    const baseConfig = {headers: { authorization: apiKey() }};
    const extraConfig = {...config, ...baseConfig};
    return axios.put(`${baseUrl}/api${url}`, data,  extraConfig);
  },
};
