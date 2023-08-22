import { StyleSheet } from "react-native";

import { ParkThumb } from "../../components/ParkThumb";
import { Text, View } from "../../components/Themed";

const PARKS = [
  {
    name: "Beto Carrero",
    address: "Penha, SC",
    pic: "",
    working_hours: "",
    lat: "",
    lng: "",
  },
  {
    name: "Disney",
    address: "Orlando, Florida",
    pic: "",
    working_hours: "",
    lat: "",
    lng: "",
  },
  {
    name: "Hopi Hari",
    address: "Vinhedo, SP",
    pic: "",
    working_hours: "",
    lat: "",
    lng: "",
  },
  {
    name: "Agua Show",
    address: "Florianópolis, SC",
    pic: "",
    working_hours: "",
    lat: "",
    lng: "",
  },
];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      {PARKS.map((park) => {
        return (
          <View>
            <ParkThumb park={park}></ParkThumb>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    color: "#6f1d1b",
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
});
