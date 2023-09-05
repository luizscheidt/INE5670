import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";

import { ParkThumb } from "../../components/ParkThumb";
import { getParks, setPark, Park } from "../../assets/parks/Park";
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
        return (
          <View key={i}>
            <ParkThumb key={i} park={park} onFavorite={fetchParks}></ParkThumb>
          </View>
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
