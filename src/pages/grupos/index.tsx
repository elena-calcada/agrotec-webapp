import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import Modal from "react-modal";
import { ModalGroup } from "../../componentes/ModalGroup";
import { toast } from "react-toastify";
import { SectionHeader } from "../../componentes/SectionHeader";
import { SectionItem } from "../../componentes/SectionItem";

export type GroupProps = {
  id: string;
  name: string;
  description: string | null;
}

interface ListGroupProps {
  listGroups: GroupProps[];
}

export default function Groups({ listGroups }: ListGroupProps) {
  const [groups, setGroups] = useState(listGroups || []);
  const [modalItem, setModalItem] = useState<GroupProps>();
  const [modalVisible, setModalVisible] = useState(false);

  Modal.setAppElement("#__next");

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/categories/group/detail", {
      params: {
        id
      }
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleDeleteGroup(id: string) {
    try {

      const apiClient = setupAPIClient();

      await apiClient.delete("/categories/group", {
        params: {
          id
        }
      });

      const response = await apiClient.get("/categories/group");

      setGroups(response.data);
      setModalVisible(false);

    } catch (err) {
      toast.error("Não é possível excluir esse grupo!");
    }
  }

  async function handleRefreshListGroups() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/categories/group");

    setGroups(response.data);
  }

  return (
    <>
      <Head>
        <title>Grupos de Categorias - Agro Tec</title>
      </Head>

      <div>
        <Header />
        <main className={styles.container}>

          <SectionHeader
            type="button"
            onClick={handleRefreshListGroups}
            path="/grupos/cadastrar"
            name="Novo grupo"
            title="Grupos"
          />

          <article className={styles.list}>
            {groups.map(group => (
              <SectionItem
                key={group.id}
                name={group.name}
                onClick={() => handleOpenModalView(group.id)}
              />
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalGroup
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            group={modalItem}
            removeGroup={handleDeleteGroup}
          />
        )}

      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/categories/group");

    return {
      props: {
        listGroups: response.data
      }
    }

  } catch (err) {
    console.log(err.response.data);

    return {
      redirect: {
        destination: "/acesso-bloqueado",
        permanent: false
      }
    }
  }
})