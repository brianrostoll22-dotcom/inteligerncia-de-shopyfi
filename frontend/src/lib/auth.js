import { createContext, useContext } from "react";

export const AuthCtx = createContext({ user: null, ready: false, setUser: () => {} });
export const useAuth = () => useContext(AuthCtx);
