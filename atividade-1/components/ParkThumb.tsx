import React from "react";
import { StyleSheet, Image } from "react-native";

import { Text, View } from "./Themed";

type ParkProps = {
  park: {
    name: string;
    address: string;
    open: string; // Opening hour
    close: string; // Closing hour
    lat: string;
    lng: string;
    thumb: string; // Thumbnail image url
    imgs: string[]; // Array of image urls for park detail screen
    video: string; // Promotional video url
    social: string[]; // Array of website and social media urls
    price: Number; // Ticket price
    buy: string; // Url to buy ticket
    phone: string;
    email: string;
  };
};

export function ParkThumb(props: ParkProps) {
  const park = props.park;

  return (
    <View style={styles.parkContainer}>
      <View style={styles.infos}>
        <Text style={styles.title}>{park.name}</Text>
        <Text style={styles.texto}>{park.address}</Text>
      </View>
      <View>
        <Image
          style={styles.picture}
          source={{ uri: park.thumb, method: "GET" }}
        />
      </View>
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
    backgroundColor: "#0B132B",
    borderWidth: 5,
    borderColor: "#6FFFE9",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginTop: 30,
  },
  picture: {
    height: 150,
    width: 290,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  infos: {
    backgroundColor: "#0B132B",
    marginVertical: 15,
    borderStyle: "solid",
    borderColor: "#6FFFE9",
    textAlign: "left",
    marginLeft: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  texto: {
    fontSize: 16,
  },
});
