import React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";

type ParkProps = {
  park: {
    name: string;
    address: string;
    working_hours: string;
    lat: string;
    lng: string;
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
