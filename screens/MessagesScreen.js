import { useRoute } from "@react-navigation/native";
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../components/Header";
import userAuth from "../hooks/userAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "tailwind-rn";
import { useEffect, useState } from "react";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const MessagesScreen = () => {
  const { user } = userAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );
  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header
        title={getMatchedUserInfo(matchDetails?.user, user.uid).displayName}
        callEnabled
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              messages.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
            inverted={-1}
          />
        </TouchableWithoutFeedback>
        <View
          style={tw(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tw("h-10 text-lg")}
            placeholder="Send Message..."
            onChangeText={setInput}
            value={input}
            onSubmitEditing={sendMessage}
          />
          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;
