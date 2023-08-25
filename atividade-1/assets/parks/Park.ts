export type Park = {
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
