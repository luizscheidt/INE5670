import { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";

import { ParkThumb } from "../../components/ParkThumb";
import { getParks, Park, setPark } from "../../assets/parks/Park";
import colors from "../../constants/Colors";

export default function TabOneScreen() {
  const [parks, setParks] = useState([]);
  const [reload, setReload] = useState(false);
  function fetchParks() {
    getParks().then((p) => {
      setParks(p);
    });
  }
  useEffect(fetchParks, [reload]);

  return (
    <ScrollView bounces={true} contentContainerStyle={styles.container}>
      {Object.values(parks).map((park: Park, i) => {
        return park.favorite ? (
          <ParkThumb key={i} park={park} onFavorite={fetchParks}></ParkThumb>
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
});
