import Link from "next/link";
import styles from "./styles.module.scss";
import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Image from "next/image";
import logoImg from "../../../public/logo.svg";

export function Header() {

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

        <nav className={styles.menuNav}>
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
          <Link href="/conta">
            <a>MEUS DADOS</a>
          </Link>

          <button onClick={signOut}>
            <FiLogOut color="#232323" size={22} />
          </button>
        </nav>
      </div>
    </header>
  );
}