import styles from "./styles.module.scss";
import { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  expression: string,
  children: ReactNode
}

export function Select({ expression, children, ...rest }: SelectProps) {
  return (
    <select
      required
      className={styles.select}
      {...rest}
    >
      <option value="" selected>{expression}</option>
      {children}
    </select>
  )
}