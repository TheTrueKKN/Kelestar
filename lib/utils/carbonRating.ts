import { CarbonRating} from "../../enums/carbonRating";

export const getCarbonRating = (footprint: number) => {
  if (footprint < 1) return CarbonRating.A;
  if (footprint >= 1 && footprint < 5) return CarbonRating.B;
  if (footprint >= 5 && footprint < 20) return CarbonRating.C;
  return CarbonRating.D;
};

// export const getRatingBadgeColor = (rating: string) => {
//   switch (rating) {
//     case "A":
//       return RatingColor.A; // green
//     case "B":
//       return RatingColor.B; // light green
//     case "C":
//       return RatingColor.C; // yellow
//     case "D":
//       return RatingColor.D; // red
//     default:
//       return RatingColor.default;
//   }
// };

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
