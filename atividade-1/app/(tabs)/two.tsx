import { StyleSheet, ScrollView } from "react-native";

import { ParkThumb } from "../../components/ParkThumb";
import { parks } from "../../assets/parks/data.json";
import colors from "../../constants/Colors";

export default function TabOneScreen() {
  return (
    <ScrollView bounces={true} contentContainerStyle={styles.container}>
      {parks.map((park, i) => {
        return park.favorite ? (
          <ParkThumb key={i} park={park} reloadOnFavorite={true}></ParkThumb>
        ) : (
          ""
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.background,
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
