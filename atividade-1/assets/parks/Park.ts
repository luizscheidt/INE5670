import { useState } from "react";
import { parksData } from "./data.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Park = {
  id: string;
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
  price: number; // Ticket price
  buy: string; // Url to buy ticket
  phone: string;
  email: string;
  favorite?: boolean;
};

export async function getParks() {
  var parks = await AsyncStorage.getItem("parks");
  if (!parks) {
    let parksJSON = parksData;
    AsyncStorage.setItem("parks", JSON.stringify(parksJSON));
    return parksJSON;
  }

  return JSON.parse(parks);
}

export async function setPark(id: string, data: Park) {
  let parks = await getParks();
  parks[id] = data;

  AsyncStorage.setItem("parks", JSON.stringify(parks));
}
