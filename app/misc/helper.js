import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioNextOpening = async (audio, index) => {
  await AsyncStorage.setItem("previousAudio", JSON.stringify({ audio, index }));
};
