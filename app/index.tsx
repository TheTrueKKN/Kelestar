import React, { useEffect, useState } from "react";
import { getUser } from "../controllers/userController";
import { User } from "../interfaces/user";
import { UserRole } from "../enums/userRole";
import VendorHome from "./vendorhome";
import LandingPage from "./landingpage";
import RolePage from "./role_page";
import FAQ from "./faq";
import CustomerHome from "./customer/customerhome";
import { useRouter } from "expo-router";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const router = useRouter();

  useEffect(() => {
    const initUserRole = async () => {
      const fetchedUser = await getUser();
      // setUser(fetchedUser);

      // if (fetchedUser?.user_role) {
      //   setUserRole(fetchedUser.user_role);
      // }

      if (fetchedUser) {
        if (fetchedUser?.user_role) {
          if (fetchedUser.user_role == UserRole.Vendor) {
            router.replace("vendorhome");
          } else {
            router.replace("/(customer-tabs)/home");
          }
        } else {
          router.replace("role_page");
        }
      } else {
        router.replace("landingpage");
      }

      console.log(fetchedUser, fetchedUser?.user_role);
    };
    initUserRole();
  }, []);

  return (
    <>
      {/* {!user ? (
        <LandingPage />
      ) : !userRole ? (
        <RolePage />
      ) : userRole == UserRole.Vendor ? (
        <VendorHome />
      ) : (
        <CustomerHome />
      )} */}
    </>
  );
}
