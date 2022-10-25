import Head from "next/head";
import styles from "../../../styles/home.module.scss";
import logoImg from "../../../public/logo.svg";
import Image from "next/image";
import { Input } from "../../componentes/ui/Input";
import { Button } from "../../componentes/ui/Button";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { canSSRGuest } from "../../utils/canSSRGuest";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    await signUp({ name, email, password });

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Agro Tec - Faça seu cadastro</title>
      </Head>
      <div className={styles.containerCenter}>
        <div className={styles.logoImage}>
          <Image
            src={logoImg}
            alt="Logo Agro Tec"
            width={430}
            height={107}
          />
        </div>

        <div className={styles.login}>

          <h1>Cadastre-se</h1>
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Digite seu e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Cadastrar
            </Button>
          </form>

          <Link href="/">
            <a className={styles.text}>Já possui uma conta? Faça o login</a>
          </Link>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})