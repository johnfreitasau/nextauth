import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";
import { Can } from "../components/Can";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // console.log("USER:", user);

  // const userCanSeeMetrics = useCan({
  //   permissions: ["metrics.list"],
  //   roles: ["editor"],
  // });

  useEffect(() => {
    api.get("/me").then((response) => response);
  }, []);

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <Can permissions={["metrics.list"]}>
        <div>Metrics</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});
