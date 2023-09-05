import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text } from "./Themed";
import { useState } from "react";
import { Park, setPark } from "../assets/parks/Park";
import { router } from "expo-router";

type ParkThumbProps = {
  park: Park;
  onFavorite?: Function;
};

export function ParkThumb(props: ParkThumbProps) {
  const [park, setParkState] = useState(props.park);

  return (
    <TouchableOpacity
      onPress={() => {
        router.replace(`/parkInfo?id=${park.id}`);
      }}
    >
      <View style={[styles.parkContainer, styles.shadowProp]}>
        <View style={styles.infos}>
          <View style={styles.header}>
            <FontAwesome
              onPress={() => {
                park.favorite = !park.favorite;
                setParkState(park);
                setPark(park.id, park).then(() => {
                  if (props.onFavorite) {
                    props.onFavorite();
                  }
                });
              }}
              style={styles.star}
              name={park.favorite ? "star" : "star-o"}
              size={28}
              color="#e1b704"
            ></FontAwesome>
            <Text style={styles.title}>{park.name}</Text>
          </View>
          <Text style={styles.address}>{park.address}</Text>
        </View>
        <Image
          style={styles.picture}
          source={{ uri: park.thumb, method: "GET" }}
        />
      </View>
    </TouchableOpacity>
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
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  star: {
    marginRight: 5,
  },
});
