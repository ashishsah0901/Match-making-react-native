import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext({});

const config = {
  iosClientId:
    "791969300645-qr9ec88t1rafto2pllepachmer36ud6a.apps.googleusercontent.com",
  androidClientId:
    "791969300645-g7gsd5dn6k9778gpl1obg1c8tik97mca.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const [loadingInitial, setloadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
        setloadingInitial(false);
      }),
    []
  );
  const signInWithGoogle = async () => {
    setLoading(true);
    await Google.logInAsync(config)
      .then(async (loginResult) => {
        if (loginResult.type === "success") {
          const { idToken, accessToken } = loginResult;
          const credentails = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credentails);
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const memoValue = useMemo(
    () => ({
      user,
      signInWithGoogle,
      logout,
      loading,
      error,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

const userAuth = () => {
  return useContext(AuthContext);
};

export default userAuth;
