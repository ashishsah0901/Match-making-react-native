import { useNavigation } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native-web";
import userAuth from "../hooks/userAuth";
import tw from "tailwind-rn";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = userAuth();
  const swipeRef = useRef(null);
  const [profile, setProfile] = useState([]);
  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "tinder-users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unSub;
    const fetchCards = async () => {
      const passes = await getDoc(
        collection(db, "tinder-users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const passedUserId = passes.length > 0 ? passes : ["no-one"];

      const swipes = await getDoc(
        collection(db, "tinder-users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const swipedUserId = swipes.length > 0 ? swipes : ["no-one"];

      unSub = onSnapshot(
        query(
          collection(db, "tinder-users"),
          where("id", "not-in", [...passedUserId, ...swipedUserId])
        ),
        (snapshot) =>
          setProfile(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          )
      );
    };
    fetchCards();
    return unSub;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profile[cardIndex]) return;
    const userSwiped = profile[cardIndex];
    setDoc(
      doc(db, "tinder-users", user.uid, "passes", userSwiped.id),
      userSwiped
    );
  };
  const swipeRight = async (cardIndex) => {
    if (!profile[cardIndex]) return;
    const userSwiped = profile[cardIndex];
    const loggedInUser = await (
      await getDoc(doc(db, "tinder-users", user.uid))
    ).data();
    getDoc(doc(db, "tinder-user", userSwiped.id, "swipes", user.uid)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.id]: loggedInUser,
              [userSwiped.id]: userSwiped,
            },
            userMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate("Match", {
            loggedInUser,
            userSwiped,
          });
        }
      }
    );
    setDoc(
      doc(db, "tinder-users", user.uid, "swipes", userSwiped.id),
      userSwiped
    );
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <View style={tw("items-center flex-row justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{
              uri: user?.photoURL || require("../image.png"),
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image style={tw("h-14 w-14")} source={require("../image.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons color="#FF3864" name="chatbubbles-sharp" size={30} />
        </TouchableOpacity>
      </View>
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          stackSize={5}
          cardIndex={0}
          cards={profile}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                labels: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          backgroundColor="#4FD0E9"
          onSwipedLeft={swipeLeft}
          onSwipedRight={swipeRight}
          verticalSwipe={false}
          animateCardOpacity
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("bg-white relative h-3/4 rounded-xl")}
              >
                <Image
                  source={{ uri: card.photoURL }}
                  style={tw("h-full w-full absolute top-0 rounded-xl")}
                />
                <View
                  style={[
                    tw(
                      "bg-white w-full h-20 absolute bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-between items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more Profiles</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
