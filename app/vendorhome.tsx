import { useEffect } from "react";
import { getVendorByUser } from "../controllers/vendorController";
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
