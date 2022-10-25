import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Blocked() {
  return (
    <>
      <Head>
        <title> Sistema Agro Tec - Acesso Bloqueado</title>
      </Head>

      <Header />

      <div className={styles.container}>
        <h1>Ops... Seu acesso está Bloqueado para estas funções... :(</h1>
        <h2>Entre em contato com o administrador.</h2>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
});