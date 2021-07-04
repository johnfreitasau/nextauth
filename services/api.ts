import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { SignOut } from "../contexts/AuthContext";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data.code === "token.expired") {
        cookies = parseCookies();

        const { "nextauth.refreshToken": refreshToken } = cookies;

        const originalConfig = error.config //all the config details done to the backend, such as routes, callback, etc.

        if (!isRefreshing) {

          isRefreshing = true;

          api
          .post("/refresh", {
            refreshToken,
          })
          .then((response) => {
            const { token } = response.data;

            setCookie(undefined, "nextauth.token", token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/", //paths that should have the access to the cookie
            });

            setCookie(
              undefined,
              "nextauth.refreshToken",
              response.data.refreshToken,
              {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
              }
            );
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failedRequestQueue.forEach(request => request.onSuccess(token))
            failedRequestQueue = [];
          }).catch((err) => {
            failedRequestQueue.forEach(request => request.onFailure(err))
            failedRequestQueue = [];
          })
          
          .finally(() => {
            isRefreshing = false;
          });
        }

        //onSuccess: if the refreshToken process is complete
        //onFailure: if refreshToken fails
        return new Promise((resolve, reject) => { //because Axios doesn't accept Async
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig)) //same as await - since Axios doesn't accept Async await
            },
            onFailure: (error: AxiosError) => {
              reject(error)
            }
          })
        }) 
      } else {
        //logout user
        SignOut();
      }
    }

    return Promise.reject(error);



  }
);
