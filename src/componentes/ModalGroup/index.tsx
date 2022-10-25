import styles from "../../../styles/modal.module.scss";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { GroupProps } from "../../pages/grupos";

interface ModalSupplierProps {
  isOpen: boolean;
  onRequestClose: () => void;
  group: GroupProps;
  removeGroup: (id: string) => void;
}

export function ModalGroup({
  isOpen,
  onRequestClose,
  group,
  removeGroup
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
            <strong>Nome:</strong> {group.name}
          </span>

          {group.description && (
            <span>
              <strong>Descrição:</strong> {group.description}
            </span>
          )}

          {!group.description && (
            <span>
              <strong>Descrição:</strong> Não informada
            </span>
          )}
        </section>

        <div className={styles.buttons}>
          <Link href={`/grupos/${group.id}`}>
            <a>Editar</a>
          </Link>

          <button
            type="button"
            onClick={() => removeGroup(group.id)}
          >
            Excluir
          </button>

        </div>
      </div>

    </Modal>
  )
}