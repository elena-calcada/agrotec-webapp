import Modal from "react-modal";
import styles from "./styles.module.scss";
import { FiX } from "react-icons/fi";
import { UserProps } from "../../pages/usuarios";
import { RiAdminLine } from "react-icons/ri";
import { BiUserCheck } from "react-icons/bi";
import { BiUserX } from "react-icons/bi";
import { BiTrashAlt } from "react-icons/bi";

interface ModalUserProps {
  isOpen: boolean;
  onRequestClose: () => void;
  user: UserProps;
  turnExecutor: (id: string) => void;
  turnAdmin: (id: string) => void;
  removeAccess: (id: string) => void;
  deleteUser: (id: string) => void;
}

export function ModalUser({
  isOpen,
  onRequestClose,
  user,
  turnExecutor,
  turnAdmin,
  removeAccess,
  deleteUser }: ModalUserProps) {

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
        <h2>Detalhes do usuário</h2>

        <section className={styles.infoContainer}>
          <span>
            <strong>Nome:</strong> {user.name}
          </span>
          <span>
            <strong>E-mail:</strong> {user.email}
          </span>

          {user.is_admin && (
            <span>
              <strong>Nível de acesso:</strong> Administrador
            </span>
          )}

          {!user.is_admin && user.is_executor && (
            <span>
              <strong>Nível de acesso:</strong> Executor
            </span>
          )}

          {!user.is_executor && (
            <span>
              <strong>Nível de acesso:</strong> Novo usuário
            </span>
          )}

        </section>

        <div className={styles.buttons}>
          <button
            type="button"
            title="Remover Acesso"
            style={{ background: "transparent", border: 0 }}
            onClick={() => removeAccess(user.id)}
          >
            <BiUserX size={32} color="#FC5050" />
          </button>

          <button
            type="button"
            title="Tornar Executor"
            style={{ background: "transparent", border: 0 }}
            onClick={() => turnExecutor(user.id)}
          >
            <BiUserCheck size={32} color="#29A055" />
          </button>

          <button
            type="button"
            title="Tornar Administrador"
            style={{ background: "transparent", border: 0 }}
            onClick={() => turnAdmin(user.id)}
          >
            <RiAdminLine size={24} color="#29A055" />
          </button>

          <button
            type="button"
            title="Deletar"
            style={{ background: "transparent", border: 0 }}
            onClick={() => deleteUser(user.id)}
          >
            <BiTrashAlt size={24} color="#FC5050" />
          </button>
        </div>

      </div>

    </Modal>
  )
}