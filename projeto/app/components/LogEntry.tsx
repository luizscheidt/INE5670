import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { Log } from "../constants/Log";

type LogProps = {
  log: Log;
};

export function LogEntry(props: LogProps) {
  let { log } = props;
  let textStyle = log.success ? styles.successText : styles.deniedText;

  return (
    <View
      style={[styles.container, log.success ? styles.success : styles.denied]}
    >
      <Text style={textStyle}>Usuário: {log.user}</Text>
      <Text style={textStyle}>CPF: {log.cpf}</Text>
      <Text style={textStyle}>
        Acesso: {log.success ? "Permitido" : "Negado"}
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
  successText: {
    color: "#155724",
  },
  deniedText: {
    color: "#721c24",
  },
});
