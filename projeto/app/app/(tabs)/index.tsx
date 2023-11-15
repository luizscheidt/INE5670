import { useEffect, useState } from "react";
import { StyleSheet, Pressable, ScrollView, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

import axios from "axios";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { Text, View } from "../../components/Themed";
import { User } from "../../constants/User";
import { UserInfo } from "../../components/UserInfo";
import { CONFIG_ENDPOINT } from "../endpoints";

type UserData = {
  [key: string]: {
    name: string;
    cpf: string;
    blocked?: boolean;
  };
};

export default function TabTwoScreen() {
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [hasSelectedUsers, setHasSelectedUsers] = useState(false);
  let __selectedUsers = [];

  const fetchUsers = () => {
    setIsLoading(true);
    setSelectedUsers([]);
    setHasSelectedUsers(false);

    axios
      .get(CONFIG_ENDPOINT)
      .then((resp) => {
        let users: User[] = [];
        let userData: UserData = resp.data.info;

        for (const [key, info] of Object.entries(userData)) {
          let user: User = { name: info.name, cpf: info.cpf, key };
          if (info.blocked) {
            user.blocked = true;
          }
          users.push(user);
        }

        setUsers(users);
        setIsLoading(false);
      })
      .catch(() => setFetchError(true));
  };

  const blockUsers = () => {
    axios.post(CONFIG_ENDPOINT + "/block", { cpfs: selectedUsers }).then(() => {
      fetchUsers();
    });
  };

  const unblockUsers = () => {
    axios
      .post(CONFIG_ENDPOINT + "/unblock", { cpfs: selectedUsers })
      .then(() => {
        fetchUsers();
      });
  };

  const deleteUsers = () => {
    axios.delete(CONFIG_ENDPOINT + "/" + selectedUsers.join(",")).then(() => {
      fetchUsers();
    });
  };

  const [reload, _] = useState(false);
  useEffect(fetchUsers, [reload]);

  return (
    <ScrollView style={styles.container}>
      <Pressable
        style={styles.reload}
        onPress={() => {
          fetchUsers();
          setSelectedUsers([]);
        }}
      >
        {({ pressed }) => (
          <FontAwesome
            name="rotate-right"
            size={25}
            color="white"
            style={{ marginRight: 10, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
      <View style={styles.usersContainer}>
        <Text style={styles.header}>Usuários:</Text>
        {fetchError ? (
          <Text style={styles.warningText}>Erro ao buscar Usuários...</Text>
        ) : isLoading ? (
          <Text style={styles.warningText}>Carregando Usuários...</Text>
        ) : (
          <View>
            {users.map((user, i) => {
              return (
                <View key={i} style={styles.user}>
                  <BouncyCheckbox
                    onPress={(isChecked: boolean) => {
                      __selectedUsers = selectedUsers;
                      if (isChecked) {
                        __selectedUsers.push(user.cpf);
                      } else {
                        for (let i = 0; i < __selectedUsers.length; i++) {
                          if (__selectedUsers[i] === user.cpf) {
                            __selectedUsers.splice(i, 1);
                          }
                        }
                      }

                      setSelectedUsers(__selectedUsers);
                      setHasSelectedUsers(!!selectedUsers.length);
                    }}
                  ></BouncyCheckbox>
                  <UserInfo key={i} user={user}></UserInfo>
                </View>
              );
            })}
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <Button
          title={"Adicionar Usuário"}
          onPress={() => {
            router.replace("/register");
          }}
        ></Button>
        {hasSelectedUsers ? (
          <View>
            <Button
              title={"Conceder Accesso aos Usuários Selecionados"}
              onPress={unblockUsers}
            ></Button>
            <Button
              color="red"
              title={"Bloquear Usuários Selecionados"}
              onPress={blockUsers}
            ></Button>
            <Button
              color="red"
              title={"Deletar Usuários Selecionados"}
              onPress={deleteUsers}
            ></Button>
          </View>
        ) : (
          ""
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  usersContainer: {
    width: "100%",
    marginTop: 20,
    marginLeft: 20,
  },
  user: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reload: {
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 100,
  },
  warningText: {
    fontSize: 20,
  },
  actions: {
    marginBottom: 40,
  },
});
