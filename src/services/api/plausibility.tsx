import { TestPlausibilityError } from "models/TestPlausibilityError";
import api from "./index";
import { UserErrorDetail } from "models/UserErrorDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const sendResponse = async (data: {
  textId: number,
  userErrorDetails: UserErrorDetail[],
  userRateSelected: number,
  sentencePositions: any,
  responseNum: number,
}): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("@auth_token");
    const response = await api.post("/plausibility/sendResponse", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la réponse :", error);
    throw error;
  }
};

export const getTestPlausibilityErrorByTextId = async (textId: number): Promise<TestPlausibilityError[]> => {
  try {
    const response = await api.get(`/plausibility/getErrorDetailTest/${textId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const getCorrectPlausibilityByTextId = async (textId: number): Promise<number> => {
//   try {
//     const response = await api.get(`/plausibility/correctPlausibility/${textId}`);
//     return response.data.test_plausibility;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const getReasonForRateByTextId = async (textId: number): Promise<string> => {
  try {
    const response = await api.get(`/plausibility/getReasonForRateByTextId/${textId}`);
    return response.data.reason_for_rate;
  } catch (error) {
    console.error(error);
    throw error;
  }
};