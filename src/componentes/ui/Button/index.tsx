import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.scss";
import { FaSpinner } from "react-icons/fa";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean,
  children: ReactNode,
}

export function Button({ loading, children, ...rest }: ButtonProps) {
  return (
    <button
      className={styles.button}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <FaSpinner color="#232323" size={20} />
      ) : (
        <a className={styles.buttonText}>
          {children}
        </a>
      )}
    </button>
  )
}