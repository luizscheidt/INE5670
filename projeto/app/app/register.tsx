import {
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import axios from "axios";

import { Text, View } from "../components/Themed";
import { validateCpf } from "../utils";
import { CONFIG_ENDPOINT } from "./endpoints";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [key, setKey] = useState("");

  const [cpfError, setCpfError] = useState("");
  const [nameError, setNameError] = useState("");
  const [keyError, setKeyError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMsg] = useState("");

  const validateAndSubmit = () => {
    setCpfError("");
    setNameError("");
    setKeyError("");
    setSuccessMsg("");
    setSubmitError("");
    let error = false;

    let validatedCpf = validateCpf(cpf);
    if (!validatedCpf) {
      setCpfError("CPF inválido!");
      error = true;
    }
    if (!name) {
      setNameError("Campo obrigatório!");
      error = true;
    }
    if (!key) {
      setKeyError("Campo obrigatório!");
      error = true;
    }

    if (!error) {
      axios
        .post(CONFIG_ENDPOINT, { key: key, name: name, cpf: validatedCpf })
        .then((resp) => {
          if (resp.status >= 400) {
            throw new Error();
          }

          setSuccessMsg("Usuário adicionado com sucesso!");
        })
        .catch((error) => {
          setSubmitError(error.response?.data || "Erro ao salvar cadastro");
        });
    }
  };

  return (
    <ScrollView>
      <Pressable
        style={styles.back}
        onPress={() => {
          router.replace("/(tabs)/");
        }}
      >
        {({ pressed }) => (
          <FontAwesome
            name="chevron-left"
            size={25}
            color="white"
            style={{ marginLeft: 10, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastrar Usuário</Text>
        {submitError ? (
          <Text style={[styles.error, { marginBottom: 5 }]}>{submitError}</Text>
        ) : successMessage ? (
          <Text style={[styles.success, { marginBottom: 5 }]}>
            {successMessage}
          </Text>
        ) : (
          ""
        )}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[
              styles.input,
              nameError ? { borderWidth: 1, borderColor: "red" } : {},
            ]}
            onChangeText={setName}
          ></TextInput>
          {nameError ? <Text style={styles.error}>{nameError}</Text> : ""}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={[
              styles.input,
              cpfError ? { borderWidth: 1, borderColor: "red" } : {},
            ]}
            onChangeText={setCpf}
          ></TextInput>
          {cpfError ? <Text style={styles.error}>{cpfError}</Text> : ""}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Chave de Acesso</Text>
          <TextInput
            style={[
              styles.input,
              keyError ? { borderWidth: 1, borderColor: "red" } : {},
            ]}
            onChangeText={setKey}
          ></TextInput>
          {keyError ? <Text style={styles.error}>{keyError}</Text> : ""}
        </View>
        <Button title="Adicionar" onPress={validateAndSubmit}></Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginBottom: 300,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  back: {
    position: "absolute",
    top: 10,
    left: 0,
    zIndex: 100,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  formGroup: {
    width: "90%",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    width: "100%",
    height: 40,
    padding: 10,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 6,
  },
  success: {
    color: "green",
    fontSize: 16,
    marginTop: 6,
  },
});
