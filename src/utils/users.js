import { useSelector } from "react-redux";

export function isConnected() {
  const userAutenticate = useSelector(
    (state) => state.userReducer?.isAuthenticated
  );
  return userAutenticate;
}

export function infoUser() {
  const infoUser = useSelector((state) => state.userReducer?.user);
  return infoUser;
}
