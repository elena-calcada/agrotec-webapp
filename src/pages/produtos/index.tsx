import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SectionHeader } from "../../componentes/SectionHeader";
import { useState } from "react";
import { SectionItem } from "../../componentes/SectionItem";
import Modal from "react-modal";
import { ModalProduct } from "../../componentes/ModalProduct";
import { Input } from "../../componentes/ui/Input";
import { Select } from "../../componentes/ui/Select";

export type ProductProps = {
  id: string;
  image: string;
  name: string;
  technical_description: string;
  supplier_id: string;
  category_id: string;
  category: {
    id: string;
    name: string;
    description: string;
    group_id: string;
  }
  supplier: {
    id: string;
    name: string;
    description: string;
  }
}

type SupllierProps = {
  id: string;
  name: string;
  description: string;
}

type GroupProps = {
  id: string;
  name: string;
  description: string;
}

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

interface RequestProps {
  listProducts: ProductProps[];
  listSuppliers: SupllierProps[];
  listGroups: GroupProps[];
  listCategories: CategoriesProps[];
}

export default function Products({ listProducts, listSuppliers, listGroups, listCategories }: RequestProps) {
  const [products, setProducts] = useState(listProducts || []);

  const [suppliers, setSuppliers] = useState(listSuppliers || []);
  const [supplierSelected, setSupplierSelected] = useState("");
  const [groups, setGroups] = useState(listGroups || []);
  const [groupSelected, setGroupSelected] = useState("");
  const [categories, setCategories] = useState(listCategories || []);
  const [categorySelected, setCategorySelected] = useState("");

  const [modalItem, setModalItem] = useState<ProductProps>();
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");

  Modal.setAppElement("#__next");

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const respoonse = await apiClient.get("/products/detail", {
      params: {
        id
      }
    });

    setModalItem(respoonse.data);
    setModalVisible(true);
  }

  async function handleDeleteProduct() {

  }

  async function handleFilterProduct() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/products/filter", {
      params: {
        name: name,
        group_id: groupSelected ? groups[groupSelected].id : "",
        category_id: categorySelected ? categories[categorySelected].id : "",
        supplier_id: supplierSelected ? suppliers[supplierSelected].id : ""
      }
    })

    setProducts(response.data);
  }

  async function handleChangeGroup(e) {
    setGroupSelected(e.target.value);

    if (!e.target.value) {
      setCategories(listCategories);
      console.log(groups[groupSelected])
    }

    if (e.target.value) {
      const apiClient = setupAPIClient();

      const response = await apiClient.get("/categories/by-group", {
        params: {
          group_id: groups[e.target.value].id
        }
      })
      setCategories(response.data);
    }
  }

  async function handleRefreshListProducts() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/products");
    setProducts(response.data);
  }

  return (
    <>
      <Head>
        <title>Produtos - Agrotec</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <SectionHeader
            type="button"
            path="/produtos/cadastrar"
            name="Novo produto"
            title="Produtos"
            onClick={handleRefreshListProducts}
          />

          <div className={styles.filters}>
            <Input
              type="text"
              placeholder="Filtrar pelo nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Select
              value={supplierSelected}
              onChange={(e) => setSupplierSelected(e.target.value)}
              expression="Filtrar por fornecedor..."
            >
              {suppliers.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                )
              })}
            </Select>

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

            <Select
              value={categorySelected}
              onChange={(e) => setCategorySelected(e.target.value)}
              expression="Filtrar por categoria..."
            >
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                )
              })}
            </Select>


          </div>
          <button
            className={styles.buttonFilter}
            onClick={handleFilterProduct}
            type="button"
          >
            Filtrar
          </button>

          <article className={styles.list}>
            {products.map(product => (
              <SectionItem
                key={product.id}
                name={product.name}
                onClick={() => handleOpenModalView(product.id)}
              />
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalProduct
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            product={modalItem}
            removeProduct={handleDeleteProduct}
          />
        )}
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const responseListProducts = await apiClient.get("/products");
    const responseListSuppliers = await apiClient.get("/suppliers");
    const responseListGroups = await apiClient.get("/categories/group");
    const responseListCategories = await apiClient.get("/categories");

    return {
      props: {
        listProducts: responseListProducts.data,
        listSuppliers: responseListSuppliers.data,
        listGroups: responseListGroups.data,
        listCategories: responseListCategories.data
      }
    }
  } catch (err) {
    return {
      redirect: {
        destination: "/acesso-bloqueado",
        permanent: false
      }
    }
  }
})