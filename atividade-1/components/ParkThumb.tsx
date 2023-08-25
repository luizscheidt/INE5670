import React from "react";
import { StyleSheet, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text, View } from "./Themed";
import { useState } from "react";
import { Park } from "../assets/parks/Park";

type ParkThumbProps = {
  park: Park;
  reloadOnFavorite?: boolean;
};

export function ParkThumb(props: ParkThumbProps) {
  const park = props.park;
  const reloadOnFavorite = !!props.reloadOnFavorite;
  const [favorite, setFavorite] = useState(!!park.favorite);

  return (
    <View style={[styles.parkContainer, styles.shadowProp]}>
      <View style={styles.infos}>
        <Text style={styles.title}>{park.name}</Text>
        <FontAwesome
          onPress={() => {
            setFavorite(!favorite);
            park.favorite = true;
          }}
          style={styles.star}
          name={favorite ? "star" : "star-o"}
          size={28}
          color="#e1b704"
        ></FontAwesome>
        <Text style={styles.address}>{park.address}</Text>
      </View>
      <Image
        style={styles.picture}
        source={{ uri: park.thumb, method: "GET" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parkContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: 300,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginTop: 30,
  },
  picture: {
    height: 150,
    width: 296,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  infos: {
    backgroundColor: "transparent",
    marginVertical: 15,
    borderStyle: "solid",
    borderColor: "#6FFFE9",
    textAlign: "left",
    marginLeft: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  address: {
    fontSize: 16,
    color: "black",
  },
  shadowProp: {
    shadowOffset: { width: 10, height: 8 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  star: {
    position: "absolute",
    right: -95,
  },
});
