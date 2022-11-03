import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { Header } from "../../componentes/Header";
import { Form } from "../../componentes/ui/Form";
import { Input, TextArea } from "../../componentes/ui/Input";
import { Select } from "../../componentes/ui/Select";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Button } from "../../componentes/ui/Button";
import { toast } from "react-toastify";
import Router from "next/router";

type GroupProps = {
  id: string;
  name: string;
  description: string;
}

interface CategoryProps {
  id: string;
  name: string;
  description: string;
  group_id: string;
  group: {
    id: string;
    name: string;
    description: string;
  }
}

interface RequestProps {
  listGroup: GroupProps[];
  detailCategory: CategoryProps;
}

export default function EditCategory({ listGroup, detailCategory }: RequestProps) {

  const [name, setName] = useState(detailCategory.name);
  const [description, setDescription] = useState(detailCategory?.description);
  const [groups, setGroups] = useState(listGroup || []);

  const index = groups.findIndex(group => group.id === detailCategory.group_id)

  const [groupSelected, setGroupSelected] = useState(index);
  const [loading, setLoading] = useState(false);

  function handleChangeGroup(e) {
    //console.log(groups[e.target.value])
    setGroupSelected(e.target.value);
  }

  async function handleEditCategory(e: FormEvent) {
    e.preventDefault();

    if (!name || !groupSelected) {
      toast.error("Nome e grupo são de preenchimento obrigatório!");
    }

    setLoading(true);

    try {

      const apiClient = setupAPIClient();

      await apiClient.put("/categories", {
        id: detailCategory.id,
        name: detailCategory.name,
        categoryGroup_id: groups[groupSelected].id,
        description: description
      })

      toast.success("Editado com sucesso!");
      setLoading(false);

      Router.push("/categorias");

    } catch (err) {
      toast.error("Erro ao Editar!");
      setLoading(false);
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Sistema Agrotec - Editar Categoria</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Editar categoria</h1>

          <Form onSubmit={handleEditCategory}>
            <Input
              type="text"
              value={name}
              disabled={true}
            />

            <Select
              value={groupSelected}
              onChange={handleChangeGroup}
              expression="Selecione uma categoria..."
            >
              {groups.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                )
              })}
            </Select>

            <TextArea
              placeholder="(opicional) Descreva alguma observação sobre o fornecedor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
              className={styles.buttonGreen}
            >
              Editar
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

  const detailUser = await apiClient.get("/users/detail");

  const responseListGroups = await apiClient.get("/categories/group");

  const response = await apiClient.get("/categories/detail", {
    params: {
      id
    }
  })


  if (!detailUser.data.is_executor) {
    return {
      redirect: {
        destination: "/acesso-bloqueado",
        permanent: false
      }
    }
  }

  return {
    props: {
      detailCategory: response.data,
      listGroup: responseListGroups.data
    }
  }
})