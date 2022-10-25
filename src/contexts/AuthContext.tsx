import { createContext, ReactNode, useEffect, useState } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps;
  isAutenticated: boolean;
  signIn: (credencials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credencials: SignUpProps) => Promise<void>;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
  executor: boolean;
  admin: boolean;
}

type SignInProps = {
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

type SignUpProps = {
  name: string;
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@agrotec.token");
    Router.push("/");
  } catch {
    console.log("Erro ao sair");
  }
}


export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const isAutenticated = !!user;

  useEffect(() => {
    const { "@agrotec.token": token } = parseCookies();

    if (token) {
      api.get("users/detail").then(response => {
        const { id, name, email, is_admin, is_executor } = response.data;

        setUser({
          id,
          name,
          email,
          executor: is_executor,
          admin: is_admin
        });
      }).catch(() => {
        signOut();
      });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/users/session", {
        email,
        password
      });
      //console.log(response.data);
      //console.log(response.data.user);
      const { token } = response.data;

      setCookie(undefined, "@agrotec.token", token, {
        maxAge: 60 * 60 * 24, //24 hour
        path: "/"
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success("Logado com sucesso!");

      Router.push("/bem-vindo");


    } catch (err) {
      toast.error("Erro ao acessar!");
      console.log("Erro ao acessar", err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password
      });

      toast.success("Cadastrado com sucesso!");

      Router.push("/");

    } catch (err) {
      toast.error("Erro ao cadastrar!");
      console.log("Erro ao cadastrar: ", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAutenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}