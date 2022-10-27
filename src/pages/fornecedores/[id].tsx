import styles from "../../../styles/container.module.scss";
import Head from "next/head";
import { Header } from "../../componentes/Header";
import { setupAPIClient } from "../../services/api"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { Button } from "../../componentes/ui/Button";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Router from "next/router";
import { Form } from "../../componentes/ui/Form";
import { Input, TextArea } from "../../componentes/ui/Input";

interface SupplierProps {
  detailSupplier: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }
}

export default function EditSupplier({ detailSupplier }: SupplierProps) {

  const [name, setName] = useState(detailSupplier.name);
  const [description, setDescription] = useState(detailSupplier?.description);
  const [loading, setLoading] = useState(false);

  async function handleEditSupplier(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {

      const apiClient = setupAPIClient();

      await apiClient.put("/suppliers", {
        id: detailSupplier.id,
        name: detailSupplier.name,
        description: description
      });

      toast.success("Editado com sucesso!");
      setLoading(false);

      Router.push("/fornecedores");

    } catch (err) {

      toast.error("Erro ao Editar!");
      setLoading(false);
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Sistema Agrotec - Editar Fornecedor</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Editar fornecedor</h1>

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

  const response = await apiClient.get("/suppliers/detail", {
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
      detailSupplier: response.data
    }
  }
})
