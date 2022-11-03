import Head from "next/head";
import { FormEvent, useState } from "react";
import styles from "./styles.module.scss";
import { Header } from "../../componentes/Header";
import { Button } from "../../componentes/ui/Button";
import { Input } from "../../componentes/ui/Input";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { toast } from "react-toastify";

type UserProps = {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_excutor: boolean;
}

interface RequestProps {
  detailUser: UserProps;
}

export default function EditUser({ detailUser }: RequestProps) {
  const [user, setUser] = useState(detailUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(detailUser.email);
  const [password, setPassword] = useState("");
  const [editName, setEditName] = useState(false);
  const [editPasword, setEditPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleEditName() {
    setEditName(true);
  }

  function handleNotEditName() {
    setEditName(false);
  }

  function handleEditPassword() {
    setEditPassword(true);
  }

  function handleNotEditPassword() {
    setEditPassword(false);
  }

  async function handleUpdateUserName(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {

      const apiClient = setupAPIClient();
      const responseUser = await apiClient.put("/users/update/name", {
        id: detailUser.id,
        name: name
      });

      toast.success("Editado com sucesso!");
      setLoading(false);
      setUser(responseUser.data);
      setEditName(false);
      setName("");

    } catch (err) {
      toast.error("Erro ao alterar nome!");
      setLoading(false);
      return;
    }
  }

  async function handleUpdateUserPassword(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {

      const apiClient = setupAPIClient();

      await apiClient.put("/users/update/password", {
        id: detailUser.id,
        password: password
      });

      toast.success("Editado com sucesso!");
      setLoading(false);
      setEditPassword(false);
      setPassword("");

    } catch (err) {
      toast.error("Erro ao alterar senha!");
      setLoading(false);
      return;
    }
  }

  return (
    <>
      <Head>
        <title>Agrotec - Meus dados</title>
      </Head>

      <div>
        <Header />

        <main className={styles.container}>
          <h1>Meus dados</h1>

          <div className={styles.containerInfo}>
            <span><strong>E-mail: </strong>{user.email}</span>
          </div>

          {!editName && (
            <div className={styles.containerChange}>
              <div className={styles.containerInfo}>
                <span><strong>Nome: </strong>{user.name}</span>
              </div>

              <button
                type="button"
                onClick={handleEditName}
                className={styles.button}
              >
                Alterar
              </button>
            </div>
          )}

          {editName && (

            <>
              <form
                className={styles.form}
                onSubmit={handleUpdateUserName}
              >
                <Input
                  type="text"
                  value={name}
                  placeholder="Informe o novo nome..."
                  onChange={(e) => setName(e.target.value)}
                />

                <div className={styles.buttons}>
                  <Button
                    className={styles.buttonSubmit}
                    type="submit"
                  >
                    Salvar
                  </Button>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={handleNotEditName}
                  >
                    Manter
                  </button>
                </div>
              </form>
            </>
          )}

          {!editPasword && (
            <div className={styles.containerChange}>
              <div className={styles.containerInfo}>
                <span><strong>Senha: </strong>- - - -</span>
              </div>

              <button
                type="button"
                onClick={handleEditPassword}
                className={styles.button}
              >
                Alterar
              </button>
            </div>
          )}

          {editPasword && (
            <>
              <form
                className={styles.form}
                onSubmit={handleUpdateUserPassword}
              >
                <Input
                  type="password"
                  value={password}
                  placeholder="Informe a nova senha..."
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className={styles.buttons}>
                  <Button
                    className={styles.buttonSubmit}
                    type="submit"
                  >
                    Salvar
                  </Button>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={handleNotEditPassword}
                  >
                    Manter
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/users/detail");

  return {
    props: {
      detailUser: response.data
    }
  }
})