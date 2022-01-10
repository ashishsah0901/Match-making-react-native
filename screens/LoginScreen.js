import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import userAuth from "../hooks/userAuth";
import tw from "tailwind-rn";

const LoginScreen = () => {
  const { signInWithGoogle } = userAuth();
  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={{
          uri: "https://tinder.com/static/tinder.png",
        }}
      >
        <TouchableOpacity
          style={[
            tw("absolute bottom-5 w-52 bg-white p-4 rounded-full"),
            {
              marginHorizontal: "42%",
            },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw("text-center font-semibold")}>Login</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
