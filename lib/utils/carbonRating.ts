import { CarbonRating } from "../../enums/carbonRating";

export const getCarbonRating = (footprint: number) => {
  let rating = "";
  if (footprint > 5) {
    rating = CarbonRating.C;
  } else if (footprint > 2.5) {
    rating = CarbonRating.B;
  } else {
    rating = CarbonRating.A;
  }

  return rating;
};

export const getRatingBadgeColor = (rating: string) => {
  switch (rating) {
    case "A":
      return "#8DC63F";
    case "B":
      return "#F8D15B";
    case "C":
      return "#ED1C24";
    default:
      return "#000000";
  }
};

// Get rating badge color
// export const getRatingBadgeColor = (rating: string) => {
//   switch (rating) {
//     case "A":
//       return "bg-green-500";
//     case "B":
//       return "bg-yellow-400";
//     case "C":
//       return "bg-orange-500";
//     case "D":
//       return "bg-red-500";
//     default:
//       return "bg-gray-500";
//   }
// };
