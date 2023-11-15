import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

import { View, Text } from "../../components/Themed";
import { CONFIG_ENDPOINT, LOG_ENDPOINT } from "../endpoints";
import { LogEntry } from "../../components/LogEntry";
import { Log } from "../../constants/Log";

type LogData = {
  [ts: string]: {
    key: string;
    success: boolean;
  };
};

export default function LogScreen() {
  const [logs, setLogs] = useState<Log[]>([]);

  const [logsFetched, setLogsFetched] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchLogData = () => {
    setLogsFetched(false);
    axios
      .get(LOG_ENDPOINT)
      .then((logResp) => {
        axios
          .get(CONFIG_ENDPOINT)
          .then((configResp) => {
            let logsData: Log[] = [];
            let logData: LogData = logResp.data;

            for (const [ts, data] of Object.entries(logData)) {
              let { key, success } = data;
              let user = "Desconhecido";
              let cpf = "-";

              let userData = configResp.data.info[key];
              if (userData) {
                user = userData.name;
                cpf = userData.cpf.toString() || "-";
              }
              logsData.push({
                ts: parseInt(ts, 10),
                key,
                success,
                user,
                cpf,
              });
            }
            setLogs(logsData);
            setLogsFetched(true);
          })
          .catch(() => {
            setFetchError(true);
          });
      })
      .catch(() => {
        setFetchError(true);
      });
  };

  const [reload, _] = useState(true);
  useEffect(fetchLogData, [reload]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.reload} onPress={fetchLogData}>
        {({ pressed }) => (
          <FontAwesome
            name="rotate-right"
            size={25}
            color="white"
            style={{ marginRight: 10, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
      {fetchError ? (
        <Text style={styles.warningText}>Erro ao buscar acessos</Text>
      ) : !logsFetched ? (
        <Text style={styles.warningText}>Carregando acessos...</Text>
      ) : logs.length ? (
        <ScrollView style={styles.scrollView}>
          {logs.map((log, i) => {
            return (
              <View key={i} style={styles.entry}>
                <LogEntry key={i} log={log}></LogEntry>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.warningText}>Não há registros de acessos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    marginTop: 15,
    width: "100%",
  },
  entry: {
    marginTop: 30,
    marginLeft: 10,
  },
  reload: {
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 100,
  },
  warningText: {
    fontSize: 25,
    position: "absolute",
    top: "30%",
  },
});
