import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies['@agrotec.token']}`
    }
  });

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      // 401: Não autorizado -> deslogar o usuário
      if (typeof window !== undefined) {
        //Chamar a função para deslogar o usuário
        signOut();
      } else {
        return Promise.reject(new AuthTokenError());
      }
    }

    return Promise.reject(error);
  });

  return api;
}