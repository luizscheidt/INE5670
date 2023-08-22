import React from "react";
import { StyleSheet } from "react-native";

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
      <Text>Nome: {park.name}</Text>
      <Text>Endereço: {park.address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  parkContainer: {
    marginBottom: 20,
  },
});
