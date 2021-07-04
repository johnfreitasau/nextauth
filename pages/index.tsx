import Head from "next/head";
import Image from "next/image";
import { FormEvent, useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import { AuthContext } from "../contexts/AuthContext";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <>
      <h1>Authentication</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Enter</button>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);

  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
