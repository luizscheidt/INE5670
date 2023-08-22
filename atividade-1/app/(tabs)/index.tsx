import { StyleSheet } from "react-native";

import { ParkThumb } from "../../components/ParkThumb";
import { Text, View } from "../../components/Themed";
import { parks } from "../../assets/parks/data.json";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      {parks.map(function (park, i) {
        return <ParkThumb key={i} park={park}></ParkThumb>;
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
