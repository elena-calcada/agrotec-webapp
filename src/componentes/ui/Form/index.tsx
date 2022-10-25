import styles from "./styles.module.scss";
import { FormHTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function Form({ children, ...rest }: FormProps) {
  return (
    <form className={styles.form} {...rest}>
      {children}
    </form>
  )
}