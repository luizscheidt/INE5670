import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { parks } from "../assets/parks/data.json";

const park = parks[0];

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const dimensions = Dimensions.get("window");

const slideList = park.imgs.map((url, i) => {
  return {
    id: i,
    image: url,
    title: `This is the title! ${i + 1}`,
    subtitle: `This is the subtitle ${i + 1}!`,
  };
});

type SlideProps = {
  data: {
    image: string;
    title: string;
    subtitle: string;
  };
};

function Slide(props: SlideProps) {
  let { data } = props;
  return (
    <View
      style={{
        height: windowHeight,
        width: windowWidth,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: data.image }}
      ></Image>
      <Text style={{ fontSize: 24 }}>{data.title}</Text>
      <Text style={{ fontSize: 18 }}>{data.subtitle}</Text>
    </View>
  );
}

function Carousel() {
  return (
    <FlatList
      data={slideList}
      style={{ flex: 1 }}
      renderItem={({ item }) => {
        return <Slide data={item} />;
      }}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{park.name}</Text>
      <View style={styles.carouselContainer}></View>
      <Carousel></Carousel>
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselContainer: {
    width: "100%",
  },
  title: {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 23,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
