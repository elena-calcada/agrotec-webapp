import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Blocked() {
  return (
    <>
      <Head>
        <title> Sistema Agro Tec - Bem Vindo</title>
      </Head>

      <Header />

      <div className={styles.container}>
        <h1>Bem vindo(a) ao Sistema de Gerenciamento do site da Agro Tec!</h1>

        <div className={styles.guidelinesContainer}>
          <h3>Passo a passo para cadastrar um produto:</h3>

          <ul className={styles.list}>
            <li> <span>1.</span> Cadastrar o fornecedor do produto (ignorar esse passo caso o fornecedor já esteja cadastrado);</li>
            <li><span>2.</span> Cadastrar o grupo de categorias a qual esse produto pertence (ignorar esse passo caso o grupo já esteja cadastrado);</li>
            <li><span>3.</span> Cadastrar a categoria que esse produto pertence (ignorar esse passo caso a categoria já esteja cadastrada);</li>
            <li><span>4.</span> Cadastrar o produto.</li>
          </ul>
        </div>

      </div>

    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
});