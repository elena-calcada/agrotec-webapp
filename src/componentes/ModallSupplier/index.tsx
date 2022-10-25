import styles from "../../../styles/modal.module.scss";
import Modal from "react-modal";
import { SupplierProps } from "../../pages/fornecedores";
import { FiX } from "react-icons/fi";
import Link from "next/link";

interface ModalSupplierProps {
  isOpen: boolean;
  onRequestClose: () => void;
  supplier: SupplierProps;
  removeSupplier: (id: string) => void;
}

export function ModalSupplier({
  isOpen,
  onRequestClose,
  supplier,
  removeSupplier
}: ModalSupplierProps) {

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
        <h2>Detalhes do fornecedor</h2>

        <section className={styles.infoContainer}>
          <span>
            <strong>Nome:</strong> {supplier.name}
          </span>

          {supplier.description && (
            <span>
              <strong>Descrição:</strong> {supplier.description}
            </span>
          )}

          {!supplier.description && (
            <span>
              <strong>Descrição:</strong> Não informada
            </span>
          )}
        </section>

        <div className={styles.buttons}>
          <Link href={`/fornecedores/${supplier.id}`}>
            <a>Editar</a>
          </Link>

          <button
            type="button"
            onClick={() => removeSupplier(supplier.id)}
          >
            Excluir
          </button>

        </div>
      </div>

    </Modal>
  )
}