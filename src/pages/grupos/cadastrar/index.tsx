import styles from "../../../../styles/container.module.scss";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Header } from "../../../componentes/Header";
import { Button } from "../../../componentes/ui/Button";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { Input, TextArea } from "../../../componentes/ui/Input";
import { Form } from "../../../componentes/ui/Form";

export default function RegisterGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegisterGroup(e: FormEvent) {
    e.preventDefault();

    if (!name) {
      toast.error("Nome do grupo é de preenchimento obrigatório!");
      return;
    }

    setLoading(true);

    try {

      const apiClient = setupAPIClient();

      await apiClient.post("/categories/group", {
        name: name,
        description: description
      });

      toast.success("Grupo cadastrado com sucesso!");
      setName("");
      setDescription("");
      setLoading(false);

    } catch (err) {

      toast.error("Erro ao cadastrar!");
      toast.warn("Verifique se esse grupo já não está no sistema...");
      setName("");
      setDescription("");
      setLoading(false);
      return;
    }
  }

  return (
    <>
      <Head>
        <title> Sistema Agro Tec - Novo Grupo</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo Grupo</h1>
          <Form onSubmit={handleRegisterGroup}>
            <Input
              type="text"
              placeholder="Digite o nome do grupo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextArea
              placeholder="(opicional) Descreva alguma observação sobre o grupo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
              className={styles.buttonForm}
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

  const response = await apiClient.get("/users/detail");

  if (!response.data.is_executor) {
    return {
      redirect: {
        destination: "/acesso-bloqueado",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
})