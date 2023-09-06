import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from "react-native";

import { Text } from "../components/Themed";
import { getParks } from "../assets/parks/Park";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useGlobalSearchParams, router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import colors from "../constants/Colors";
import { Video, ResizeMode } from "expo-av";

export default function ModalScreen() {
  const [park, setPark] = useState({
    name: "",
    address: "",
    open: "",
    close: "",
    lat: "0",
    lng: "0",
    imgs: [],
    video: "",
    social: [],
    price: "",
    buy: "",
    phone: "",
    email: "",
  });
  const [reload, setReload] = useState(false);
  const params = useGlobalSearchParams();
  const mapRegion = {
    latitude: parseFloat(park.lat),
    longitude: parseFloat(park.lng),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const video = useRef(null);

  function fetchPark() {
    getParks().then((parks) => {
      setPark(parks[params.id[0]]);
      var slideList = park.imgs.map((url, i) => {
        return {
          id: i,
          image: url,
          title: `This is the title! ${i + 1}`,
          subtitle: `This is the subtitle ${i + 1}!`,
        };
      });
    });
  }
  useEffect(fetchPark, [reload]);

  return (
    <ScrollView bounces={true} contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => {
          router.replace("/(tabs)/");
        }}
      >
        <FontAwesome name="chevron-left" size={25} color="black"></FontAwesome>
        <Text
          onPress={() => {
            router.replace("/(tabs)/");
          }}
          style={[styles.text, styles.backText]}
        >
          Voltar
        </Text>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{park.name}</Text>
        <View style={styles.separator}></View>
      </View>
      <View style={styles.imagesContainer}>
        {park.imgs.map((url, i) => {
          return (
            <Image
              key={i}
              style={styles.parkImages}
              source={{
                uri: url,
              }}
            ></Image>
          );
        })}
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.title, styles.infoHeader]}>Sobre:</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoPair}>
            <Text style={styles.infoText}>Endereço:</Text>
            <Text style={styles.infoValue}>{park.address}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoText}>Horário:</Text>
            <Text style={styles.infoValue}>
              {park.open} - {park.close}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, styles.infoHeader]}>Ingressos:</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoPair}>
            <Text style={styles.infoText}>Preço:</Text>
            <Text style={styles.infoValue}>R$: {park.price}</Text>
          </View>
          <Text style={[{ marginLeft: 12 }, styles.infoText]}>
            Onde comprar:
          </Text>
          <Text onPress={() => Linking.openURL(park.buy)} style={styles.link}>
            {park.buy}
          </Text>
        </View>
        <Text style={[styles.title, styles.infoHeader]}>Links:</Text>
        <View style={styles.infoItem}>
          {park.social.map((url, i) => {
            return (
              <Text
                key={i}
                style={styles.link}
                onPress={() => Linking.openURL(url)}
              >
                {url}
              </Text>
            );
          })}
        </View>
        <Text style={[styles.title, styles.infoHeader]}>Contato:</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoPair}>
            <Text style={styles.infoText}>Número:</Text>
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(`tel:${park.phone.replace(/\s/g, "")}`)
              }
            >
              {park.phone}
            </Text>
          </View>
          <Text style={[{ marginLeft: 55 }, styles.infoText]}>Email:</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(`mailto:${park.email}`)}
          >
            {park.email}
          </Text>
        </View>
        <Text style={[styles.title, styles.infoHeader]}>Vídeo:</Text>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: park.video,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isMuted={true}
          shouldPlay={true}
          onPlaybackStatusUpdate={() => {}}
        />
        <Text style={[styles.title, styles.infoHeader]}>Localização:</Text>
        <MapView region={mapRegion} style={{ height: 250 }}>
          <Marker coordinate={mapRegion} title="Marker"></Marker>
        </MapView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "center",
  },
  link: {
    fontSize: 16,
    color: "blue",
    marginBottom: 10,
  },
  back: {
    marginLeft: 5,
    marginTop: 6,
    display: "flex",
    flexDirection: "row",
  },
  backText: {
    fontSize: 22,
    marginLeft: 6,
  },
  infoContainer: {
    marginTop: 0,
  },
  infoPair: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  infoHeader: {
    marginLeft: 15,
  },
  infoItem: {
    marginLeft: 30,
  },
  infoValue: {
    fontSize: 18,
    color: "black",
    fontWeight: "800",
  },
  infoText: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
  },
  text: {
    color: "black",
  },
  imagesContainer: {
    width: "100%",
    alignItems: "center",
  },
  parkImages: { width: 296, height: 150, marginTop: 20 },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    color: "black",
    marginTop: 30,
    marginBottom: 30,
    fontSize: 30,
    fontWeight: "bold",
  },
  separator: {
    backgroundColor: "black",
    height: 1,
    width: "100%",
  },
  video: {
    height: 190,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
});
