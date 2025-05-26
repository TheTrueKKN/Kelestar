import { CarbonRating } from "../../enums/carbonRating";

export const getCarbonRating = (footprint: number) => {
  let rating = "";
  if (footprint < 1) {
    rating = CarbonRating.A;
  } else if ((footprint >= 1 && footprint < 5)) {
    rating = CarbonRating.B;
  } else if ((footprint >= 5 && footprint < 20))  {
    rating = CarbonRating.C;
  }else{
      rating = CarbonRating.D
  }
  
  return rating;
};

export const getRatingBadgeColor = (rating: string) => {
  switch (rating) {
    case "A":
      return "#74B318";
    case "B":
      return "#A4D056";
    case "C":
      return "#FFDA44";
    case "D":
      return "#F87171"
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
