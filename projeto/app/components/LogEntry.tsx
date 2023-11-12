import { SetStateAction, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { Log } from "../constants/Log";

type LogProps = {
  log: Log;
};

export function LogEntry(props: LogProps) {
  let { log } = props;

  let dateObj = new Date(log.ts * 1000);

  let textStyle = log.success ? styles.successText : styles.deniedText;

  return (
    <View
      style={[styles.container, log.success ? styles.success : styles.denied]}
    >
      <Text style={[styles.text, textStyle]}>Usuário: {log.user}</Text>
      <Text style={[styles.text, textStyle]}>
        Acesso: {log.success ? "Permitido" : "Negado"}
      </Text>
      <Text style={[styles.text, textStyle]}>Chave: {log.key}</Text>
      <Text style={[styles.text, textStyle]}>CPF: {log.cpf}</Text>
      <Text style={[styles.text, textStyle]}>
        Data: {dateObj.getDate()}/{dateObj.getMonth()}/{dateObj.getFullYear()}
      </Text>
      <Text style={[styles.text, textStyle]}>
        Hora: {dateObj.getHours()}:{dateObj.getMinutes()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
  },
  success: {
    borderColor: "#c3e6cb",
    backgroundColor: "#d4edda",
  },
  denied: {
    borderColor: "#f5c6cb",
    backgroundColor: "#f8d7da",
  },
  text: {
    marginBottom: 7,
  },
  successText: {
    color: "#155724",
  },
  deniedText: {
    color: "#721c24",
  },
});
