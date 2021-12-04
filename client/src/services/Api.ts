import axios from 'axios'
import { setupInterceptorsTo } from './CustomApi'

const Axios = axios.create({
  baseURL: `http://localhost:8080`,
})

export const Api = setupInterceptorsTo(Axios)

const Authentication = (username: string, password: string) => {
  const payload = {
    username,
    password,
  }

  return Api.post('/login', payload)
}

const UploadAttachement = (form: FormData) => {
  return Api.post(`/api/files/upload`, form)
}

const ClearImage = () => {
  return Api.post('/api/files/empty')
}

export { Authentication, UploadAttachement, ClearImage }
