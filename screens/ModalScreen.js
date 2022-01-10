import { useNavigation } from "@react-navigation/native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { View, Text, Image, TextInput } from "react-native";
import tw from "tailwind-rn";
import { db } from "../firebase";
import userAuth from "../hooks/userAuth";

const ModalScreen = () => {
  const navigation = useNavigation();
  const user = userAuth();
  const [image, setImage] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");
  const inCompleteForm = !image || !job || !age;
  const updateUserProfile = () => {
    setDoc(doc(db, "tinder-users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => navigation.navigate("Home"))
      .catch((error) => console.log(error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Update Your Profile",
      headerStyle: {
        backgroundColor: "#FF5864",
      },
      headerTitleStyle: {
        color: "white",
      },
    });
  }, []);

  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="cover"
        source={{
          uri: "https://links.papareact.com/2pf",
        }}
      />
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user?.displayName || "Anonymous"}
      </Text>
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        placeholder="Enter a Profile Pic URL"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        placeholder="Enter your Occupation"
      />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        placeholder="Enter your Age"
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[
          tw("w-64 rounded-xl p-3 absolute bottom-10"),
          inCompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
        disabled={inCompleteForm}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-center text-white text-xl")}>
          Update Your Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
