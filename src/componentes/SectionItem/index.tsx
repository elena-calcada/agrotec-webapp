import { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

export function SectionItem({ name, ...rest }: ItemProps) {
  return (
    <section className={styles.item}>
      <button
        {...rest}
      >
        <div className={styles.tag}></div>
        <span>{name}</span>
      </button>
    </section>
  )
}
