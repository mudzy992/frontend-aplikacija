import axios, { AxiosResponse } from 'axios'
import { ApiConfig } from '../config/api.config'

export default function api(
    path: string, 
    method: 'get' | 'post' | 'patch' | 'delete',
    body: string | undefined,
    ){
        return new Promise((resolve, reject) =>{
         axios({
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            }
        }).then(res => responseHandler(res, resolve, reject)) 
        .catch(err => reject(err)) 
    })    
}

function getToken(): string {
    const token = localStorage.getItem('api_token');

    return 'Berer ' + token
}

function saveToken(token: string){
    localStorage.setItem('api_token', token)
}

function responseHandler(
    res: AxiosResponse<any>,
    resolve:(value?:unknown) => void, 
    reject: (reason?:any)=>void
    ){
        if(res.status < 200 || res.status >= 300){
            return reject(res.data)
        }
        if(res.data.statusCode < 0){
            return reject(res.data)
        }
        resolve(res.data)
    }