import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import Modal from "react-modal";
import { ModalUser } from "../../componentes/ModalUser";


export type UserProps = {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_executor: boolean;
}

interface UsersProps {
  allUsers: UserProps[];
}

export default function Usuarios({ allUsers }: UsersProps) {

  const [usersList, setUsersList] = useState(allUsers || []);

  const [modalItem, setModalItem] = useState<UserProps>();
  const [modalVisible, setModalVisible] = useState(false);

  Modal.setAppElement("#__next");

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/users/detail/id", {
      params: {
        id
      }
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  async function handleTurnUserExecutor(id: string) {

    const apiClient = setupAPIClient();

    await apiClient.put("/users/executor", {
      id: id
    });

    const response = await apiClient.get("/users");

    setUsersList(response.data);

    setModalVisible(false);
  }

  async function handleRemoveUserAccess(id: string) {

    const apiClient = setupAPIClient();

    await apiClient.put("users/remove-access", {
      id: id
    });

    const response = await apiClient.get("/users");

    setUsersList(response.data);

    setModalVisible(false);
  }

  async function handleTurnUserAdmin(id: string) {

    const apiClient = setupAPIClient();

    await apiClient.put("/users/admin", {
      id: id
    });

    const response = await apiClient.get("/users");

    setUsersList(response.data);

    setModalVisible(false);
  }

  async function handleDeleteUser(id: string) {

    const apiClient = setupAPIClient();

    await apiClient.delete("/users", {
      params: {
        id
      }
    });

    const response = await apiClient.get("/users");

    setUsersList(response.data);

    setModalVisible(false);
  }

  async function handleRefreshListUsers() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/users");

    setUsersList(response.data);
  }

  return (
    <>
      <Head>
        <title>Usuários - Agro Tec</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Usuários</h1>
            <button onClick={handleRefreshListUsers}>
              <FiRefreshCcw size={25} color="#29A055" />
            </button>
          </div>

          <article className={styles.listUsers}>

            {usersList.map(user => (
              <section key={user.id} className={styles.user}>
                <button onClick={() => handleOpenModalView(user.id)}>
                  <div className={styles.tag}></div>
                  <span>{user.name}</span>
                  {user.is_admin && (
                    <span className={styles.accessAdmin}>ADMIN</span>
                  )}
                  {!user.is_admin && user.is_executor && (
                    <span className={styles.accessExecutor}>EXECUTOR</span>
                  )}
                  {!user.is_executor && (
                    <span className={styles.accessNew}>NOVO</span>
                  )}
                </button>


              </section>
            ))}

          </article>
        </main>

        {modalVisible && (
          <ModalUser
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            user={modalItem}
            turnExecutor={handleTurnUserExecutor}
            turnAdmin={handleTurnUserAdmin}
            removeAccess={handleRemoveUserAccess}
            deleteUser={handleDeleteUser}
          />
        )}

      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/users");

    return {
      props: {
        allUsers: response.data,
      }
    }

  } catch (err) {
    console.log(err.response.data)
    return {
      redirect: {
        destination: "/acesso-bloqueado",
        permanent: false
      }
    }
  }
});