import { SetStateAction, useState } from "react";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { Text, View } from "./Themed";
import { User } from "../constants/User";

type UserInfoProps = {
  user: User;
};

export function UserInfo(props: UserInfoProps) {
  let { user } = props;

  return (
    <View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.text}>CPF: {user.cpf}</Text>
      <Text style={styles.text}>Chave: {user.key}</Text>
      <View style={styles.access}>
        <Text>Acesso: {user.blocked ? "Bloqueado" : "Ativo"}</Text>
        <FontAwesome
          style={styles.icon}
          color={user.blocked ? "red" : "green"}
          name={user.blocked ? "times" : "check"}
        ></FontAwesome>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  access: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  icon: {
    marginLeft: 5,
    fontSize: 15,
  },
  text: {
    marginTop: 5,
  },
});
