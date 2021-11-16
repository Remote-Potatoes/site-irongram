import axios from "axios";
import { sendUser, SERVER_URL } from "../../utils/consts";
import { onError, onSuccess } from "../../utils/serverResponseHandlers";

const userService = axios.create({
  baseURL: `${SERVER_URL}/user`,
});

export function updateProfilePic(formBody) {
  return userService
    .post("/updateProfilePic", formBody, sendUser())
    .then(onSuccess("update-profile"))
    .catch(onError("update-profile"));
}

export function updateUserName(username) {
  return userService
    .patch("/update-account", { username }, sendUser())
    .then(onSuccess("update-account"))
    .catch(onError("update-account"));
}

export function getUserData(username) {
  return userService
    .get(`/${username}`)
    .then(onSuccess("getUser"))
    .catch(onError("getUser"));
}