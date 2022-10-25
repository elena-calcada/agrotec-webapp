import styles from "../../../styles/modal.module.scss";
import { ProductProps } from "../../pages/produtos";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import Link from "next/link";

interface ModalProduct {
  isOpen: boolean;
  onRequestClose: () => void;
  product: ProductProps;
  removeProduct: (id: string) => void;
}

export function ModalProduct({
  isOpen,
  onRequestClose,
  product,
  removeProduct
}: ModalProduct) {

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
            <strong>Nome:</strong> {product.name}
          </span>

          {product.technical_description && (
            <span>
              <strong>Descrição:</strong> {product.technical_description}
            </span>
          )}

          {!product.technical_description && (
            <span>
              <strong>Descrição:</strong> Não informada
            </span>
          )}

          <span>
            <strong>Categoria:</strong> {product.category.name}
          </span>
          <span>
            <strong>Fornecedor:</strong> {product.supplier.name}
          </span>
        </section>

        <div className={styles.buttons}>
          <Link href={`/categorias/${product.id}`}>
            <a>Editar</a>
          </Link>

          <button
            type="button"
            onClick={() => removeProduct(product.id)}
          >
            Excluir
          </button>

        </div>
      </div>
    </Modal>
  )
}