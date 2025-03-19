import { useEffect, useState } from "react";
import { Vendor } from "../interfaces/vendor";
import { getVendorByUser } from "../controllers/vendorController";
import VendorDetailPage from "./vendordetail";
import { View } from "react-native";
import InitialMenu from "./initialmenu";
import { useRouter } from "expo-router";

export default function VendorHome() {
  const router = useRouter();  

  useEffect(() => {
    const navigateVendorPage = async () => {
      const vendor = await getVendorByUser();
    //   router.dismissAll();
      if (vendor) {
        router.replace("/dashboard")
      }
      else {
        router.replace("/vendordetail")
      }
    };
    navigateVendorPage();
  }, []);

//   return <>{vendor ? <InitialMenu /> : <VendorDetailPage />}</>;
  return <></>;

}
