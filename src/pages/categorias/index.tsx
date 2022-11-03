import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { setupAPIClient } from "../../services/api"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { useState } from "react";
import { SectionHeader } from "../../componentes/SectionHeader";
import { SectionItem } from "../../componentes/SectionItem";
import Modal from "react-modal";
import { ModalCategory } from "../../componentes/ModalCategory";
import { toast } from "react-toastify";
import { Select } from "../../componentes/ui/Select";

export type CategoriesProps = {
  id: string;
  name: string;
  description: string | null;
  group: {
    id: string;
    name: string;
    description: string | null;
  }
}

type GroupProps = {
  id: string;
  name: string;
  description: string;
}

interface RequestProps {
  listCategories: CategoriesProps[];
  listGroups: GroupProps[];
}

export default function Categorias({ listCategories, listGroups }: RequestProps) {

  const [categories, setCategories] = useState(listCategories || []);
  const [modalItem, setModalItem] = useState<CategoriesProps>();
  const [modalVisible, setModalVisible] = useState(false);

  const [groups, setGroups] = useState(listGroups || []);
  const [groupSelected, setGroupSelected] = useState(undefined);

  Modal.setAppElement("#__next");

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/categories/detail", {
      params: {
        id
      }
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  async function handleDeleteCategory(id: string) {
    try {

      const apiClient = setupAPIClient();

      await apiClient.delete("/categories", {
        params: {
          id
        }
      });

      const response = await apiClient.get("/categories");
      setCategories(response.data);
      setModalVisible(false);

    } catch (err) {

      toast.error("Não é possível excluir essa categoria");
    }
  }

  async function handleChangeGroup(e) {
    setGroupSelected(e.target.value);

    if (!e.target.value) {
      setCategories(listCategories)
    }

    if (e.target.value) {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/categories/by-group", {
        params: {
          group_id: groups[e.target.value].id
        }
      })
      setCategories(response.data)
    }
  }

  async function handleRefreshListCategories() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/categories");

    setCategories(response.data);
  }

  return (
    <>
      <Head>
        <title>Categorias - Agro Tec</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>

          <SectionHeader
            type="button"
            path="/categorias/cadastrar"
            name="Novo"
            title="Categorias"
            onClick={handleRefreshListCategories}
          />

          <Select
            value={groupSelected}
            onChange={handleChangeGroup}
            expression="Filtrar por grupo..."
          >
            {groups.map((item, index) => {
              return (
                <option key={item.id} value={index}>
                  {item.name}
                </option>
              )
            })}
          </Select>

          <article className={styles.list}>
            {categories.map(category => (
              <SectionItem
                key={category.id}
                name={category.name}
                onClick={() => handleOpenModalView(category.id)}
              />
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalCategory
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            category={modalItem}
            removeCategory={handleDeleteCategory}
          />
        )}

      </div>
    </>

  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/categories");


    const responseListGroups = await apiClient.get("/categories/group");

    return {
      props: {
        listCategories: response.data,
        listGroups: responseListGroups.data
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