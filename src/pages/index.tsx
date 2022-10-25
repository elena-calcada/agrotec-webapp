import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import styles from "../../styles/home.module.scss";
import logoImg from "../../public/logo.svg";
import Image from "next/image";
import { Input } from "../componentes/ui/Input";
import { Button } from "../componentes/ui/Button";
import { AuthContext } from "../contexts/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    await signIn({ email, password });

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Agro Tec - Faça seu login</title>
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
          <h1>Faça o login</h1>

          <form onSubmit={handleLogin}>
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
              Acessar
            </Button>
          </form>

          <Link href="/cadastro">
            <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
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
});
