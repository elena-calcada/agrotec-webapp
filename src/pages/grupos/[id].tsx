import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import Router from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Header } from "../../componentes/Header";
import { Button } from "../../componentes/ui/Button";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Form } from "../../componentes/ui/Form";
import { Input, TextArea } from "../../componentes/ui/Input";

interface GroupProps {
  detailGroup: {
    id: string;
    name: string;
    description: string;
  }
}

export default function EditGroup({ detailGroup }: GroupProps) {

  const [name, setName] = useState(detailGroup.name);
  const [description, setDescription] = useState(detailGroup?.description);
  const [loading, setLoading] = useState(false);

  async function handleEditSupplier(e: FormEvent) {
    e.preventDefault();

    try {

      const apiClient = setupAPIClient();

      await apiClient.put("/categories/group", {
        id: detailGroup.id,
        name: detailGroup.name,
        description: description
      });

      toast.success("Editado com sucesso!");
      setLoading(false);

      Router.push("/grupos");

    } catch (err) {

      toast.error("Erro ao Editar!");
      setLoading(false);
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Sistema Agro Tec - Editar Fornecedor</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Editar grupo</h1>

          <Form onSubmit={handleEditSupplier}>

            <Input
              type="text"
              placeholder="Digite o nome do fornecedor"
              value={name}
              disabled={true}
            />

            <TextArea
              placeholder="(opicional) Descreva alguma observação sobre o fornecedor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
              className={styles.buttonForm}
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

  const response = await apiClient.get("/categories/group/detail", {
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
      detailGroup: response.data
    }
  }
})