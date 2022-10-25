import Link from "next/link";
import { ButtonHTMLAttributes } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import styles from "./styles.module.scss";

interface LinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  path: string;
  name: string;
  title: string;
}

export function SectionHeader({ path, name, title, ...rest }: LinkProps) {
  return (
    <div className={styles.containerHeader}>
      <div className={styles.title}>
        <h1>{title}</h1>
        <button
          className={styles.buttonRefresh}
          {...rest}
        >
          <FiRefreshCcw size={25} color="#29A055" />
        </button>
      </div>
      <Link href={path}>
        <a>{name}</a>
      </Link>
    </div>
  )
}