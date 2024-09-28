import { useSelector } from "react-redux";

export function isConnected() {
  const userAutenticate = useSelector(
    (state: any) => state.userReducer?.isAuthenticated,
  );
  return userAutenticate;
}

export function infoUser() {
  const infoUser = useSelector((state: any) => state.userReducer?.user);
  return infoUser;
}
