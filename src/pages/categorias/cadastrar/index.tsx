import styles from "../../../../styles/container.module.scss";
import Head from "next/head";
import { Header } from "../../../componentes/Header";
import { Form } from "../../../componentes/ui/Form";
import { Input, TextArea } from "../../../componentes/ui/Input";
import { Button } from "../../../componentes/ui/Button";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { FormEvent, useState } from "react";
import { Select } from "../../../componentes/ui/Select";
import { toast } from "react-toastify";

type GroupProps = {
  id: string;
  name: string;
  description: string;
}

interface ListGroupProps {
  listGroup: GroupProps[];
}

export default function RegisterCategory({ listGroup }: ListGroupProps) {
  const [groups, setGroups] = useState(listGroup || []);
  const [groupSelected, setGroupSelected] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChangeGroup(e) {
    console.log(groups[e.target.value])
    setGroupSelected(e.target.value);
  }

  async function handleRegisterCategory(e: FormEvent) {
    e.preventDefault();

    if (!name || !groupSelected) {
      toast.error("Nome e grupo são de preenchimento obrigatório!");
    }

    setLoading(true);

    try {

      const apiClient = setupAPIClient();

      await apiClient.post("/categories", {
        name,
        categoryGroup_id: groups[groupSelected].id,
        description
      });

      toast.success("Categoria cadastrada com sucesso!");
      setName("");
      setGroupSelected("");
      setDescription("")
      setLoading(false);

    } catch (err) {

      toast.error("Erro ao cadastrar!");
      toast.warn("Verifique se essa categoria já não está no sistema...");

      setName("");
      setGroupSelected("");
      setDescription("")
      setLoading(false);

      return;
    }
  }

  return (
    <>
      <Head>
        <title>Sistema Agrotec - Nova Categoria</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Nova Categoria</h1>

          <Form onSubmit={handleRegisterCategory}>
            <Input
              type="text"
              placeholder="Digite o nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Select
              value={groupSelected}
              onChange={handleChangeGroup}
              expression="Selecione um grupo..."
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
              placeholder="(opicional) Descreva alguma observação sobre a categoria"
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

  const responseUser = await apiClient.get("/users/detail");
  const responseListGroups = await apiClient.get("/categories/group");

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
      listGroup: responseListGroups.data
    }
  }
})