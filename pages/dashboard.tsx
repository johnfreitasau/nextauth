import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  console.log("USER:", user);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => response)
      .catch((err) => console.log(err));
  }, []);

  return <h1>Dashboard: {user?.email}</h1>;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  try {
    const response = await apiClient.get("/me");
  } catch (err) {
    console.log(err instanceof AuthTokenError);
  }
  // console.log("ME:", response.data);

  return {
    props: {},
  };
});
