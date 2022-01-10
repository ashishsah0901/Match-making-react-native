import { View, Text, TouchableOpacity } from "react-native";
import { Foundation, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <View style={tw("flex-row items-center justify-between p-2")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity style={tw("p-2")} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={tw("rounded-full mr-4 p-3 bg-red-400")}>
          <Foundation name="telephone" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
