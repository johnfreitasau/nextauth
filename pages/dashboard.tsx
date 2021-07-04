import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  console.log("USER:", user);

  useEffect(() => {
    api.get("/me").then((response) => response).catch(err => console.log(err));
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
}
