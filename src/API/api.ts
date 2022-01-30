import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiConfig } from '../config/api.config'

export default function api(
    path: string, 
    method: 'get' | 'post' | 'patch' | 'delete',
    body: string | undefined,
    role: 'user' | 'administrator' = 'user',
    ){
        return new Promise<ApiResponse>((resolve) =>{
         const requestData = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(role)
            }
        }
        axios(requestData)
        .then(res => responseHandler(res, resolve, requestData)) 
        .catch(err => {
            const response: ApiResponse = {
                status: 'error',
                data: err
            }
            resolve(response)
        })
    })    
}

interface ApiResponse{
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function responseHandler(
    res: AxiosResponse<any>,
    resolve:(value?: ApiResponse) => void,
    requestData: { /* AxiosRequestConfig: any, */
        
        method: "get" | "post" | "patch" | "delete";
        url: string;
        baseUrl: string;
        data: string;
        headers: {
            'Content-Type': string;
            Authorization: string;
        }
    }
    ){
        if(res.status < 200 || res.status >= 300){

            if(res.status ===  401){
                const newToken = await refreshToken(requestData)

                if(!newToken){
                    const response: ApiResponse = {
                        status: 'login',
                        data: null,
                    }
                    return resolve(response)
                }

                saveToken(newToken)

                requestData.headers['Authorization'] = getToken();

                return await repeatRequest(requestData, resolve);
            }

            const response: ApiResponse ={
                status: 'error',
                data: res.data,
            }
            return resolve(response)
        }

        let response: ApiResponse;
        if(res.data.statusCode < 0){
            response = {
                status: 'login',
                data: null,
            }
            } else {
                response = {
                    status: 'ok',
                    data: res.data,
                }
            }

            resolve(response)
        }


    function getToken(role: 'user' | 'administrator'): string {
        const token = localStorage.getItem('api_token' + role);
        return 'Berer ' + token;
    }
    
    
    function saveToken(token: string){
        localStorage.setItem('api_token', token)
    }

    function getRefreshToken(role: 'user' | 'administrator'): string {
        const token = localStorage.getItem('api_refresh_token' + role);
        return token + '';
    }

    function saveRefreshToken(token: string){
        localStorage.setItem('api_refresh_token', token)
    }

    async function refreshToken(role: 'user' | 'administrator'): Promise<string | null> {
        const path = 'auth/' + role + '/refresh';
        const data = {
            token: getRefreshToken(role),
        }
    
        const refreshTokenRequestData: AxiosRequestConfig = {
            method: 'post',
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        const rtr: { data: { token: string | undefined } } = await axios(refreshTokenRequestData);
    
        if (!rtr.data.token) {
            return null;
        }
    
        return rtr.data.token;
    }
    async function repeatRequest(requestData: AxiosRequestConfig, resolve: (value?: ApiResponse)=> void){
        axios(requestData)
        .then(res => {
            let response: ApiResponse;
            if(res.status === 401){
                response = {
                    status: 'login',
                    data: null,
                }
            } else {
                response = {
                    status: 'ok',
                    data: res,
                }
            }

            return resolve(response)
        })
        .catch(err => {
            const response: ApiResponse = {
                status: 'error',
                data: err
            }
            return resolve(response)
        })
    }