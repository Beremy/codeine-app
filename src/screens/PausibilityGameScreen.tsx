import React, { useRef, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useTailwind } from "tailwind-rn";
import MainTitle from "components/MainTitle";
import PrimaryButton from "components/PrimaryButton";
import data from "data/fakeUserData.js";
import Swiper from "react-native-deck-swiper";
import { AntDesign } from '@expo/vector-icons';

const PausibilityGameScreen = ({ }) => {
  const tw = useTailwind();
  const [listTexts, setListTexts] = useState<any>(null);
  const swipeRef = useRef(null);

  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleExpandCard = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <ScrollView contentContainerStyle={tw("flex-grow")}>

        {/* Cards */}
        <View style={tw("flex-1 -mt-6")}>
          <Swiper
            ref={swipeRef}
            containerStyle={{ backgroundColor: "transparent" }}
            cards={data.texts}
            onSwiped={(cardIndex) => {
              console.log(cardIndex);
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            cardIndex={0}
            backgroundColor={"#4FD0E9"}
            stackSize={5}
            animateCardOpacity
            verticalSwipe={false}
            overlayLabels={{
              left: {
                title: "Suspect",
                style: {
                  label: {
                    textAlign: "right",
                    color: "red",
                  },
                },
              },
              right: {
                title: "Crédible",
                style: {
                  label: {
                    color: "#4DED30",
                  },
                },
              },
            }}
            renderCard={(card, index) => {
              const isExpanded = expandedCard === index;
              const limitedText = card.content.slice(0, 750) + (card.content.length > 750 ? "..." : ""); // Increased text length
              const displayText = isExpanded ? card.content : limitedText;

              return (
                <View style={[
                  tw("bg-yellow-100 p-7 rounded-xl justify-center"),
                  {
                    minHeight: 400, // Increased card size
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }
                ]}>
                  <Text style={[
                    tw("text-xl tracking-wider mb-2"),
                    {
                      fontFamily: "Pally",
                    }
                  ]}>
                    {/* TODO: Désactiver le surlignage */}
                    {displayText}
                  </Text>
                  {card.content.length > 750 && (
                    <TouchableOpacity onPress={() => toggleExpandCard(index)} >
                      {isExpanded ? (
                        <AntDesign name="up" size={24} color="black" />
                      ) : (
                        <AntDesign name="down" size={24} color="black" />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          ></Swiper>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PausibilityGameScreen;
