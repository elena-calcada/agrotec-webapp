import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { useState } from "react";
import { Header } from "../../componentes/Header";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Modal from "react-modal";
import { ModalSupplier } from "../../componentes/ModallSupplier";
import { toast } from "react-toastify";
import { SectionHeader } from "../../componentes/SectionHeader";
import { SectionItem } from "../../componentes/SectionItem";

export type SupplierProps = {
  id: string;
  name: string;
  description: string | null;
}

interface ListSuppliersProps {
  listSuppliers: SupplierProps[];
}

export default function Fornecedores({ listSuppliers }: ListSuppliersProps) {

  const [suppliers, setSuppliers] = useState(listSuppliers || []);
  const [modalItem, setModalItem] = useState<SupplierProps>();
  const [modalVisible, setModalViseble] = useState(false);

  Modal.setAppElement("#__next");

  function handleCloseModal() {
    setModalViseble(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/suppliers/detail", {
      params: {
        id
      }
    });

    setModalItem(response.data);
    setModalViseble(true);
  }

  async function handleDeleteSupplier(id: string) {

    try {
      const apiClient = setupAPIClient();

      await apiClient.delete("/suppliers", {
        params: {
          id
        }
      });

      const response = await apiClient.get("/suppliers");
      setSuppliers(response.data);
      setModalViseble(false);

    } catch (err) {
      toast.error("Não é possível excluir esse fornecedor!");
    }

  }

  async function handleRefreshListSuppliers() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/suppliers");
    setSuppliers(response.data);
  }

  return (
    <>
      <Head>
        <title>
          Fornecedores - Agro Tec
        </title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>

          <SectionHeader
            type="button"
            title="Fornecedores"
            name="Novo fornecedor"
            path="/fornecedores/cadastrar"
            onClick={handleRefreshListSuppliers}
          />

          <article className={styles.list}>
            {suppliers.map(supplier => (
              <SectionItem
                key={supplier.id}
                name={supplier.name}
                onClick={() => handleOpenModalView(supplier.id)}
              />
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalSupplier
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            supplier={modalItem}
            removeSupplier={handleDeleteSupplier}
          />
        )}

      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/suppliers");

    return {
      props: {
        listSuppliers: response.data
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