import { StyleSheet } from "react-native";

import { ParkThumb } from "../../components/ParkThumb";
import { Text, View } from "../../components/Themed";

const PARKS = [
  {
    name: "Beto Carrero",
    address: "Penha, SC",
    working_hours: "",
    lat: "",
    lng: "",
  },
  {
    name: "Disney",
    address: "Orlando, Florida",
    working_hours: "",
    lat: "",
    lng: "",
  },
  {
    name: "Hopi Hari",
    address: "Vinhedo, SP",
    working_hours: "",
    lat: "",
    lng: "",
  },
  {
    name: "Agua Show",
    address: "Florianópolis, SC",
    working_hours: "",
    lat: "",
    lng: "",
  },
];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      {PARKS.map(function (park) {
        return <ParkThumb park={park}></ParkThumb>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
