import Link from "next/link";
import styles from "./styles.module.scss";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Image from "next/image";
import logoImg from "../../../public/logo.svg";


export function Header() {
  const [menu, setMenu] = useState(false);

  const handleClick = () => setMenu(!menu);

  const { signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/bem-vindo">
          <Image
            src={logoImg}
            alt="Logo Agro Tec"
            width={200}
            height={59}
          />
        </Link>

        <div onClick={handleClick} className={styles.iconMenu}>
          {menu === false ?
            <i><FiMenu size={32} /></i> :
            <i><FiX size={32} />
            </i>}
        </div>

        <nav className={styles.menuNavDesktop}>
          <Link href="/bem-vindo">
            <a>INÍCIO</a>
          </Link>
          <Link href="/usuarios">
            <a>USUÁRIOS</a>
          </Link>
          <Link href="/fornecedores">
            <a>FORNECEDORES</a>
          </Link>
          <Link href="/grupos">
            <a>GRUPOS</a>
          </Link>
          <Link href="/categorias">
            <a>CATEGORIAS</a>
          </Link>
          <Link href="/produtos">
            <a>PRODUTOS</a>
          </Link>
          <Link href="/me">
            <a>MEUS DADOS</a>
          </Link>

          <button onClick={signOut}>
            <FiLogOut color="#232323" size={22} />
          </button>
        </nav>

        {/* {menu && (
          <nav className={styles.menuNavMobile}>
            <div className={styles.contentMenuMobile}>
              <Link href="/bem-vindo">
                <a>Início</a>
              </Link>
              <Link href="/usuarios">
                <a>Usuários</a>
              </Link>
              <Link href="/fornecedores">
                <a>Fornecedores</a>
              </Link>
              <Link href="/grupos">
                <a>Grupos</a>
              </Link>
              <Link href="/categorias">
                <a>Categorias</a>
              </Link>
              <Link href="/produtos">
                <a>Produtos</a>
              </Link>
              <Link href="/me">
                <a>Meus dados</a>
              </Link>

              <button onClick={signOut}>
                Sair
                <FiLogOut color="#232323" size={32} />
              </button>
            </div>
          </nav>
        )} */}

        {menu && (
          <nav className={styles.menuNavMobile}>
            <div className={styles.contentMenuMobile}>
              <Link href="/bem-vindo">
                <a>Início</a>
              </Link>
              <Link href="/usuarios">
                <a>Usuários</a>
              </Link>
              <Link href="/fornecedores">
                <a>Fornecedores</a>
              </Link>
              <Link href="/grupos">
                <a>Grupos</a>
              </Link>
              <Link href="/categorias">
                <a>Categorias</a>
              </Link>
              <Link href="/produtos">
                <a>Produtos</a>
              </Link>
              <Link href="/me">
                <a>Meus dados</a>
              </Link>

              <button onClick={signOut}>
                Sair
                <FiLogOut color="#232323" size={32} />
              </button>
            </div>
          </nav>
        )}


      </div>
    </header>
  );
}