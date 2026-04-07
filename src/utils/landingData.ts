import foodCooking from "../assets/food-cooking.jpg";
import foodDelivery from "../assets/food-delivery.jpg";
import foodEmployee from "../assets/food-employee.jpg";

export const featureCards = [
  {
    title: "Feed your employees",
    description: "Create a business account",
    image: foodEmployee,
    eyebrow: "Business",
    note: "Meal programs, team lunches, recurring orders.",
  },
  {
    title: "Your restaurant, delivered",
    description: "Add your restaurant",
    image: foodCooking,
    eyebrow: "Restaurants",
    note: "Better visibility, smarter orders, easy delivery.",
  },
  {
    title: "Deliver with Foodio",
    description: "Sign up to deliver",
    image: foodDelivery,
    eyebrow: "Delivery",
    note: "Flexible shifts, local routes, fast onboarding.",
  },
] as const;

export const cities = [
  "Pizza 4P's",
  "Banh Mi Huynh Hoa",
  "Maison Marou",
  "Highlands Coffee",
  "Phuc Long Tea",
  "Secret Garden",
  "The Deck Saigon",
  "Sushi Tei",
  "Dim Tu Tac",
  "Propaganda",
  "Au Parc",
  "Quan Ut Ut",
  "Poke Saigon",
  "Godmother Bake & Brunch",
  "L'Usine",
  "The Workshop",
  "Morico",
  "Anan Saigon",
  "Sol Kitchen & Bar",
  "Kieu Hoang",
  "Vintage Emporium",
  "Pizza Company",
  "Lotteria",
  "Popeyes"
] as const;

export const countries = [
  "District 1",
  "District 2 (Thao Dien)",
  "District 3",
  "District 7 (Phu My Hung)",
  "Binh Thanh",
  "District 4",
  "Go Vap",
  "District 10",
  "Phu Nhuan",
  "District 5",
  "Tan Binh",
  "District 11",
  "District 6",
  "District 8",
  "District 9",
  "District 12",
  "Thu Duc City",
  "Binh Tan",
  "Hoc Mon",
  "Cu Chi",
  "Nha Be"
] as const;

export const footerLinks = {
  company: ["Get Help", "Buy gift cards", "Add your restaurant", "Sign up to deliver"],
  discover: ["Restaurants near me", "View all restaurants", "Pickup near me", "HCMC Districts"],
  extra: ["About Foodio", "Shop groceries", "English"],
} as const;
