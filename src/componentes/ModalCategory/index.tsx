import styles from "../../../styles/modal.module.scss";
import { CategoriesProps } from "../../pages/categorias";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import Link from "next/link";

interface ModalCategory {
  isOpen: boolean;
  onRequestClose: () => void;
  category: CategoriesProps;
  removeCategory: (id: string) => void;
}

export function ModalCategory({
  isOpen,
  onRequestClose,
  category,
  removeCategory
}: ModalCategory) {

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      padding: "32px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#F2F6F3"
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >

      <button
        type="button"
        onClick={onRequestClose}
        className={styles.buttonClose}
        style={{ background: "transparent", border: 0 }}
      >
        <FiX size={36} color="#FC5050" />
      </button>

      <div className={styles.container}>
        <h2>Detalhes da categoria</h2>

        <section className={styles.infoContainer}>
          <span>
            <strong>Nome:</strong> {category.name}
          </span>

          {category.description && (
            <span>
              <strong>Descrição:</strong> {category.description}
            </span>
          )}

          {!category.description && (
            <span>
              <strong>Descrição:</strong> Não informada
            </span>
          )}

          <span>
            <strong>Pertence ao grupo:</strong> {category.group.name}
          </span>
        </section>

        <div className={styles.buttons}>
          <Link href={`/categorias/${category.id}`}>
            <a>Editar</a>
          </Link>

          <button
            type="button"
            onClick={() => removeCategory(category.id)}
          >
            Excluir
          </button>

        </div>
      </div>
    </Modal>
  )
}