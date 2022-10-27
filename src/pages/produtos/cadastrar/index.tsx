import styles from "../../../../styles/container.module.scss";
import Head from "next/head";
import { Header } from "../../../componentes/Header";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { Form } from "../../../componentes/ui/Form";
import { ChangeEvent, FormEvent, useState } from "react";
import { Select } from "../../../componentes/ui/Select";
import { Input, TextArea } from "../../../componentes/ui/Input";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "../../../componentes/ui/Button";

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

type SupllierProps = {
  id: string;
  name: string;
  description: string;
}

interface RequestProps {
  listSuppliers: SupllierProps[];
  listGroups: GroupProps[];
  listCategories: CategoriesProps[];
}

export default function RegistarProduct({ listSuppliers, listGroups, listCategories }: RequestProps) {
  const [suppliers, setSuppliers] = useState(listSuppliers || []);
  const [supplierSelected, setSupplierSelected] = useState("");
  const [groups, setGroups] = useState(listGroups || []);
  const [groupSelected, setGroupSelected] = useState("");
  const [categories, setCategories] = useState(listCategories || []);
  const [categorySelected, setCategorySelected] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [avatarUrl, setAvatarURL] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

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

  async function handleRegisterProduct(e: FormEvent) {
    e.preventDefault();

    try {

      const data = new FormData();

      if (!name || !description || !imageAvatar) {
        toast.error("Preencha todos os campos!");
        return;
      }

      data.append("name", name);
      data.append("technical_description", description);
      data.append("file", imageAvatar);
      data.append("category_id", categorySelected ? categories[categorySelected].id : "");
      data.append("supplier_id", supplierSelected ? suppliers[supplierSelected].id : "");

      const apiClient = setupAPIClient();

      await apiClient.post("/products", data);

      toast.success("Produto cadastrado com sucesso!");

    } catch (err) {
      toast.error("Erro ao cadastrar produto!");
    }

    setName("");
    setDescription("");
    setAvatarURL("");
    setImageAvatar(null);
    setGroupSelected("");
    setCategorySelected("");
    setSupplierSelected("");

  }

  return (
    <>
      <Head>
        <title>Sistema Agrotec - Novo Produto</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo produto</h1>

          <Form onSubmit={handleRegisterProduct}>

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
              onChange={(e) => setCategorySelected(e.target.value)}
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
              onChange={(e) => setSupplierSelected(e.target.value)}
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
              className={styles.buttonForm}
              type="submit"
              loading={loading}
            >
              Cadastrar
            </Button>
          </Form>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

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
      listCategories: responseListCategories.data
    }
  }
})