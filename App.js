import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/userAuth";
import StackNavigation from "./navigation/StackNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigation />
      </AuthProvider>
    </NavigationContainer>
  );
}
