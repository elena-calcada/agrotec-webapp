import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { Header } from "../../componentes/Header";
import { Form } from "../../componentes/ui/Form";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Select } from "../../componentes/ui/Select";
import { Input, TextArea } from "../../componentes/ui/Input";
import { Button } from "../../componentes/ui/Button";
import { toast } from "react-toastify";
import Link from "next/link";

type ProductProps = {
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

type GroupProps = {
  id: string;
  name: string;
  description: string;
}

type CategoriesProps = {
  id: string;
  name: string;
  description: string | null;
  group: {
    id: string;
    name: string;
    description: string | null;
  }
}

type SupllierProps = {
  id: string;
  name: string;
  description: string;
}

interface RequestProps {
  listSuppliers: SupllierProps[];
  listGroups: GroupProps[];
  listCategories: CategoriesProps[];
  detailProduct: ProductProps;
}

export default function EditProduct({ listSuppliers, listGroups, listCategories, detailProduct }: RequestProps) {

  //FORNECEDORES
  const [suppliers, setSuppliers] = useState(listSuppliers || []);

  const indexSupplier = suppliers.findIndex(supplier => supplier.id === detailProduct.supplier_id);

  const [supplierSelected, setSupplierSelected] = useState(indexSupplier);

  //GRUPOS
  const [groups, setGroups] = useState(listGroups || []);

  const indexGroup = groups.findIndex(group => group.id === detailProduct.category.group_id);

  const [groupSelected, setGroupSelected] = useState(indexGroup);

  //CATEGORIAS
  const [categories, setCategories] = useState(listCategories || []);

  const indexCategory = categories.findIndex(category => category.id === detailProduct.category_id);

  const [categorySelected, setCategorySelected] = useState(indexCategory);

  //TOOGLES
  const [loading, setLoading] = useState(false);
  const [toggleEditImage, setToggleEditImage] = useState(false);

  //OUTRAS INFORMAÇÕES
  const [name, setName] = useState(detailProduct.name);
  const [description, setDescription] = useState(detailProduct.technical_description);

  //IMAGEM
  const [avatarUrl, setAvatarURL] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nameImage, setNameImage] = useState(detailProduct.image)

  function handleChangeSupplier(e) {
    setSupplierSelected(e.target.value);
  }

  function handleChangeCategory(e) {
    setCategorySelected(e.target.value);
  }

  function handleEditImage() {
    setToggleEditImage(true);
  }

  function handleNotEditImage() {
    setToggleEditImage(false);
    setAvatarURL("");

  }

  async function handleChangeGroup(e) {
    setGroupSelected(e.target.value);

    const apiClient = setupAPIClient();

    const response = await apiClient.get("/categories/by-group", {
      params: {
        group_id: e.target.value ? groups[e.target.value].id : ""
      }
    })
    setCategories(response.data);

  }

  async function handleUpdateInfoProduct(e: FormEvent) {
    e.preventDefault();

    if (!name || !description || !categorySelected || !supplierSelected) {
      toast.error("Nome e grupo são de preenchimento obrigatório!");
    }

    setLoading(true);

    try {
      const apiClient = setupAPIClient();

      await apiClient.put("/products/info", {
        id: detailProduct.id,
        name: name,
        technical_description: description,
        category_id: categories[categorySelected].id,
        supplier_id: suppliers[supplierSelected].id
      });

      const updatedDetailProduct = await apiClient.get("/products/detail", {
        params: {
          id: detailProduct.id
        }
      });

      const updatedIndexGroup = groups.findIndex(group => group.id === updatedDetailProduct.data.category.group_id);
      setGroupSelected(updatedIndexGroup);

      const updatedIndexCategory = categories.findIndex(category => category.id === updatedDetailProduct.data.category_id);
      setCategorySelected(updatedIndexCategory);

      const updatedIndexSupplier = suppliers.findIndex(supplier => supplier.id === updatedDetailProduct.data.supplier_id);
      setSupplierSelected(updatedIndexSupplier);

      setName(updatedDetailProduct.data.name);
      setDescription(updatedDetailProduct.data.description);

      toast.success("Editado com sucesso!");
      setLoading(false);

    } catch (err) {
      console.log(err);
      toast.error("Erro ao Editar!");

      const indexGroup = groups.findIndex(group => group.id === detailProduct.category.group_id);
      setGroupSelected(indexGroup);

      const indexCategory = categories.findIndex(category => category.id === detailProduct.category_id);
      setCategorySelected(indexCategory);

      const indexSupplier = suppliers.findIndex(supplier => supplier.id === detailProduct.supplier_id);
      setSupplierSelected(indexSupplier);

      setName(detailProduct.name);
      setDescription(detailProduct.technical_description);

      setLoading(false);

      return;
    }
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/png" || image.type === "image/jpeg") {
      setImageAvatar(image);
      setAvatarURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function handleSaveNewImage(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();

      if (!imageAvatar) {
        toast.error("Imagem não encontrada!");
      }

      data.append("file", imageAvatar);
      data.append("id", detailProduct.id);

      const apiClient = setupAPIClient();

      const product = await apiClient.put("/products/image", data);

      setNameImage(product.data.image);

      setAvatarURL("");
      setToggleEditImage(false);

      toast.success("Imagem alterada com sucesso!")

    } catch (err) {
      toast.error("Erro ao alterar imagem!");
    }
  }

  return (
    <>
      <Head>
        <title>Sistema Agrotec - Editar produto</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Novo produto</h1>
            <Link href="/produtos">Voltar</Link>
          </div>


          {!toggleEditImage && (
            <div className={styles.image}>
              <img src={`http://localhost:3333/images/${nameImage}`} alt="produto" />

              <Button
                type="button"
                onClick={handleEditImage}
              >
                Alterar imagem
              </Button>
            </div>
          )}

          {toggleEditImage && (
            <Form onSubmit={handleSaveNewImage}>
              <label className={styles.labelImage}>
                <span>
                  <FiUpload size={32} color="#232323" />
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFile}
                />

                {avatarUrl && (
                  <img
                    className={styles.preview}
                    src={avatarUrl}
                    alt="Foto do produto"
                    width={250}
                    height={250}
                  />
                )}
              </label>

              <div className={styles.toggleButtons}>
                <Button
                  className={styles.buttonForm}
                  type="submit"
                  onClick={handleEditImage}
                >
                  Salvar nova imagem
                </Button>

                <Button
                  className={styles.buttonToggle}
                  type="button"
                  onClick={handleNotEditImage}
                >
                  Voltar
                </Button>
              </div>
            </Form>
          )}


          <Form onSubmit={handleUpdateInfoProduct}>

            <Select
              value={groupSelected}
              onChange={handleChangeGroup}
              expression="Filtrar categoria por grupo..."
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
              onChange={handleChangeCategory}
              expression="Selecione a categoria..."
            >
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                )
              })}
            </Select>

            <Select
              value={supplierSelected}
              onChange={handleChangeSupplier}
              expression="Selicione o fornecedor..."
            >
              {suppliers.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                )
              })}
            </Select>

            <Input
              type="text"
              placeholder="Informe o nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextArea
              placeholder="Informe a descrição técnica do produto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.technicalDescription}
            />

            <Button
              type="submit"
              loading={loading}
              className={styles.buttonForm}
            >
              Alterar Informações
            </Button>
          </Form>
        </main>
      </div>
    </>
  )

}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const { id } = ctx.params;

  const responseProductDetail = await apiClient.get("/products/detail", {
    params: {
      id
    }
  });

  const responseUser = await apiClient.get("/users/detail");
  const responseListSuppliers = await apiClient.get("/suppliers");
  const responseListGroups = await apiClient.get("/categories/group");
  const responseListCategories = await apiClient.get("/categories");

  if (!responseUser.data.is_executor) {
    return {
      redirect: {
        destination: "/acesso-bloqueado",
        permanent: false
      }
    }
  }

  return {
    props: {
      listSuppliers: responseListSuppliers.data,
      listGroups: responseListGroups.data,
      listCategories: responseListCategories.data,
      detailProduct: responseProductDetail.data
    }
  }
})