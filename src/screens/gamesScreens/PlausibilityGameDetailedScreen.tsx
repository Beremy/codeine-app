import React, { useCallback, useEffect, useRef, useState, FC } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { useTailwind } from "tailwind-rn";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from 'services/context/UserContext';
import { Word } from "models/Word";
import { TemporalEntity } from "models/TemporalEntity";
import { getAllTexts } from "services/api/texts";
import Modal from 'react-native-modal';
import ErrorButtonPlausibilityGame from "components/ErrorButtonPlausibilityGame";
import { shuffleArray, splitText } from "utils/functions";
import CustomHeaderInGame from 'components/header/CustomHeaderInGame';
import { ErrorDetail } from "models/ErrorDetail";

const colors = [
  "bg-yellow-300",
  "bg-green-300",
  "bg-indigo-300",
  "bg-pink-300",
];
export interface SplitText {
  id: number;
  content: Word[];
  selectedType: string | null;
}
interface ModalPlausibilityGameDetailedProps {
  isVisible: boolean;
  closeModal: () => void;
  setIsModalVisible: (isVisible: boolean) => void;
  setHighlightEnabled: (highlight: boolean) => void;
}

const PlausibilityGameDetailedScreen = ({ }) => {
  const tw = useTailwind();
  const [texts, setTexts] = useState<SplitText[]>([]);
  const { incrementPoints } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [errorSpecifying, setErrorSpecifying] = useState(false);
  const [selectedErrorType, setSelectedErrorType] = useState<string | null>(null);
  const [wordsSelected, setWordsSelected] = useState(false);
  const [coherenceSelected, setCoherenceSelected] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [isSelectionStarted, setSelectionStarted] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetail[]>([]);
  const [nextId, setNextId] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);


  const ModalPlausibilityGameDetailed: FC<ModalPlausibilityGameDetailedProps> = ({ isVisible, closeModal, setIsModalVisible, setHighlightEnabled }) => {
    const tw = useTailwind();

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        backdropColor="transparent"
        style={tw("items-center justify-center")}
      >
        <View style={[tw("bg-white rounded-lg p-4 flex-row mb-14"), {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 3,
        }]}>
          <>
            <TouchableOpacity
              style={tw("bg-orange-100 p-3 mr-3 rounded-lg")}
              onPress={() => {
                setIsModalVisible(false);
                setHighlightEnabled(true);
                setErrorSpecifying(true);
                closeModal();
              }}
            >
              <Text style={tw(" text-orange-500 font-semibold")}>Source du doute</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw("bg-green-200 p-3 rounded-lg")}
              onPress={() => {
                setIsModalVisible(false);
                if (currentIndex + 1 < texts.length) {
                  setCurrentIndex(currentIndex + 1);
                  incrementPoints(5)
                  scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
                } else {
                  // TODO afficher qu'il n'y a plus de texte
                }
                closeModal();
              }}
            >
              <Text style={tw(" text-green-700 font-semibold")}>Aller au texte suivant</Text>
            </TouchableOpacity>
          </>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await getAllTexts();
        const shuffledTexts = shuffleArray(response);
        const newtexts = shuffledTexts.map((text) => {
          return splitText(text);
        });

        setTexts(newtexts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTexts();
  }, []);

  const onCoherenceSelected = (type: string) => {
    setSelectedErrorType(type);
    setCoherenceSelected(true); // Ajouter cette ligne
  };

  const addErrorDetail = () => {
    setSelectionStarted(false);
    const selectedWords = texts[currentIndex].content.filter(word => word.isCurrentSelection);
    selectedWords.forEach(word => {
      word.sentenceId = nextId;
      word.isSelected = true;
      word.isCurrentSelection = false;
      delete word.color; // Remove the temporary color from the word
    });

    const startPosition = selectedWords[0].position;
    const endPosition = selectedWords[selectedWords.length - 1].position;

    // @ts-ignore
    setErrorDetails([...errorDetails, {
      id: nextId,
      user_text_rating_id: texts[currentIndex].id, //mettre l'id du text rating
      content: selectedWords.map(word => word.text).join(' '),
      startPosition: startPosition,
      endPosition: endPosition,
      type: 1, //mettre en fonction du medical ou linguistique
      color: colors[colorIndex]
    }]);

    setNextId(nextId + 1);
    setColorIndex((colorIndex + 1) % colors.length);
  };


  const getSentenceColor = (sentenceId: number | null) => {
    if (sentenceId === null) {
      return "bg-transparent";
    }
    const sentence = errorDetails.find(spec => spec.id === sentenceId);
    return sentence ? sentence.color : "bg-transparent";
  };

  const onWordPress = (wordIndex: number, textIndex: number) => {
    if (!highlightEnabled) {
      return;
    }

    const newTexts = texts.map((text, idx) => {
      if (idx === textIndex) {
        const newWords = text.content.map((word: Word, idx: number) => {
          if (idx === wordIndex) {
            word.isCurrentSelection = !word.isCurrentSelection;
            if (word.isCurrentSelection) {
              word.color = 'bg-blue-200';
              setSelectionStarted(true);
            } else {
              delete word.color;
              setSelectionStarted(false);
            }
            return word;
          }
          return word;
        });
        return { ...text, content: newWords };
      }
      return text;
    });
    setTexts(newTexts);
    setWordsSelected(true);
  };

  // TODO Séparer dans d'autres fichiers pour plus de visibilité
  const renderText = (text: SplitText, index: number) => {
    if (typeof text === "undefined") {
      return null;
    }
    return (
      <SafeAreaView style={tw("flex-1 bg-white")}>

        <View
          style={[
            tw("bg-[#FFFEE0] rounded-xl justify-center mx-2 mt-2 lg:mt-8 xl:mt-12"),
            {
              minHeight: 300,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
          ]}
        >
          <View style={tw("flex-row flex-wrap mb-2 m-7")}>
            {text.content.map((word: any, idx: number) => {

              return (
                <TouchableOpacity
                  key={`${idx}-${word.text}`}
                  onPress={() => onWordPress(idx, index)}
                  style={tw(
                    `m-0 p-[2px] ${word.isCurrentSelection ? word.color : word.isSelected ? getSentenceColor(word.sentenceId) : "bg-transparent"}`

                  )}
                >
                  <Text style={tw("text-2xl font-secondary")}>{word.text + " "}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (

    <SafeAreaView style={tw("flex-1 bg-white")}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={tw("flex-grow")}>
        <CustomHeaderInGame title="Plausibilité de textes" />
        {/* Cards */}
        <View style={tw("flex-1")}>
          {renderText(texts[currentIndex], currentIndex)}
        </View>
      </ScrollView>

      <ModalPlausibilityGameDetailed
        isVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        setIsModalVisible={setIsModalVisible}
        setHighlightEnabled={setHighlightEnabled}
      />

      {errorSpecifying ? (
        <View style={tw('my-3 flex flex-row justify-between items-center')}>
          <View style={tw('flex flex-row self-center mx-auto')}>
            <ErrorButtonPlausibilityGame
              type="Cohérence médicale"
              setSelectedErrorType={onCoherenceSelected}
              selectedErrorType={selectedErrorType}
            />
            <ErrorButtonPlausibilityGame
              type="Cohérence linguistique"
              setSelectedErrorType={onCoherenceSelected}
              selectedErrorType={selectedErrorType}
            />
          </View>
          <TouchableOpacity
            key={"add"}
            style={tw(`items-center justify-center rounded-full w-12 h-12 mr-2 ${wordsSelected && coherenceSelected ? 'bg-blue-200' : 'bg-blue-50'}`)}
            onPress={addErrorDetail}
            disabled={!wordsSelected || !coherenceSelected}
          >
            <MaterialIcons name="add" size={22} color="white" />
            <Text style={tw("text-white font-primary text-lg")}>Valider la sélection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={"next"}
            style={tw(`items-center justify-center rounded-full w-12 h-12 mr-2 ${wordsSelected && coherenceSelected ? 'bg-blue-200' : 'bg-blue-50'}`)}
            onPress={async () => {
              if (wordsSelected && coherenceSelected) {
                if (currentIndex + 1 < texts.length) {
                  setCurrentIndex(currentIndex + 1);
                  incrementPoints(10)
                  setHighlightEnabled(false)
                  setErrorSpecifying(false)
                  scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
                  // Réinitialisation de l'état
                  const newTexts = texts.map((text, idx) => {
                    if (idx === currentIndex) {
                      const newWords = text.content.map(word => {
                        return { ...word, isSelected: false };
                      });
                      return { ...text, content: newWords };
                    }
                    return text;
                  });
                  setTexts(newTexts);
                  setSelectedErrorType(null);
                  setWordsSelected(false);
                  setCoherenceSelected(false);
                } else {
                  // TODO afficher qu'il n'y a plus de texte
                }
              }
            }}
            disabled={!wordsSelected || !coherenceSelected} // Le bouton est désactivé si les mots ne sont pas surlignés ou si la cohérence n'est pas sélectionnée
          >
            <Ionicons name="arrow-forward" size={24} color={wordsSelected && coherenceSelected ? "blue" : "lightblue"} />
          </TouchableOpacity>
        </View>
      ) : (
        // Boutons de plausibilité  
        < View style={tw('flex flex-row justify-evenly my-1 md:my-3')}>
          <TouchableOpacity style={tw('items-center justify-center rounded-full w-14 h-14 md:w-16 md:h-16 my-auto bg-red-200')}
            onPress={async () => {
              setIsModalVisible(true);
            }} >
            <Entypo name="cross" size={32} color="red" />
          </TouchableOpacity>

          <TouchableOpacity style={tw('items-center justify-center rounded-full w-14 h-14 md:w-16 md:h-16 my-auto bg-orange-100')}
            onPress={async () => {
              setIsModalVisible(true);
            }} >
            <Entypo name="flag" size={28} color="orange" />
          </TouchableOpacity>

          <TouchableOpacity style={tw('items-center justify-center rounded-full w-14 h-14 md:w-16 md:h-16 my-auto bg-yellow-100')}
            onPress={() => {
              setIsModalVisible(true);
            }}  >
            <AntDesign name="question" size={30} color="orange" />
          </TouchableOpacity>

          <TouchableOpacity style={tw('items-center justify-center rounded-full w-14 h-14 md:w-16 md:h-16 my-auto bg-green-50')}
            onPress={async () => {
              setIsModalVisible(true);
            }} >
            <Ionicons name="checkmark" size={24} color="#48d1cc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw('items-center justify-center rounded-full w-14 h-14 md:w-16 md:h-16 my-auto bg-green-200')}
            onPress={async () => {
              if (currentIndex + 1 < texts.length) {
                setCurrentIndex(currentIndex + 1);
                incrementPoints(5);
                scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
              } else {
                // TODO afficher qu'il n'y a plus de texte
              }
            }}
          >
            <Ionicons name="checkmark-done-sharp" size={24} color="green" />
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView >
  );
};

export default PlausibilityGameDetailedScreen;