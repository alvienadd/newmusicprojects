import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import {
  play,
  pause,
  resume,
  playNext,
  selectAudio,
  moveAudio,
} from "../misc/audioController";
import { storeAudioNextOpening } from "../misc/helper";
import { changeAudio } from "../misc/audioController";

const { width } = Dimensions.get("window");

// const convertTime = (minutes) => {
//   if (minutes) {
//     const hrs = minutes / 60;
//     const minute = hrs.toString().split(".")[0];
//     const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
//     const sec = Math.ceil((60 * percent) / 100);

//     if (parseInt(minute) < 10 && sec < 10) {
//       return `0${minute}:0${sec}`;
//     }

//     if (sec == 60) {
//       return `${minute + 1}:00`;
//     }

//     if (parseInt(minute) < 10) {
//       return `0${minute}:${sec}`;
//     }
//     if (sec < 10) {
//       return `${minute}:0${sec}`;
//     }

//     return `${minute}:${sec}`;
//   }
// };

const EmptyPlayer = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;

  const calculateSeekBar = () => {
    if (playbackPosition != null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return;
  };

  useEffect(() => {
    context.loadPreviousAudio();
  });

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
    //play
    // if (context.soundObj === null) {
    //   const audio = context.currentAudio;
    //   const status = await play(context.playbackObj, audio.url);
    //   context.playbackObj.setOnPlaybackStatusUpdate(
    //     context.onPlaybackStatusUpdate
    //   );
    //   return context.updateState(context, {
    //     soundObj: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: context.currentAudioIndex,
    //   });
    // }
    // //pause
    // if (context.soundObj && context.soundObj.isPlaying) {
    //   const status = await pause(context.playbackObj);
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying: false,
    //   });
    // }
    // //resume
    // if (context.soundObj && !context.soundObj.isPlaying) {
    //   const status = await resume(context.playbackObj);
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying: true,
    //   });
    // }
  };

  const handleNext = async () => {
    await changeAudio(context, "next");

    // const { isLoaded } = await context.playbackObj.getStatusAsync();
    // const isLastAudio =
    //   context.currentAudioIndex + 1 === context.totalAudioCount;
    // let audio = context.audioFiles[context.currentAudioIndex + 1];
    // let index;
    // let status;
    // console.log(audio);
    // if (!isLoaded && !isLastAudio) {
    //   index = context.currentAudioIndex + 1;
    //   status = await play(context.playbackObj, audio.url);
    // }

    // if (isLoaded && !isLastAudio) {
    //   index = context.currentAudioIndex + 1;
    //   status = await playNext(context.playbackObj, audio.url);
    // }

    // if (isLastAudio) {
    //   index = 0;
    //   audio = context.audioFiles[index];
    //   if (isLoaded) {
    //     status = await playNext(context.playbackObj, audio.url);
    //   } else {
    //     status = await play(context.playbackObj, audio.url);
    //   }
    // }

    // context.updateState(this.context, {
    //   currentAudio: audio,
    //   playbackObj: context.playbackObj,
    //   soundObj: status,
    //   isPlaying: true,
    //   currentAudioIndex: index,
    //   playbackPosition: null,
    //   playbackDuration: null,
    // });
    // storeAudioNextOpening(audio, index);
  };

  const handlePrevious = async () => {
    await changeAudio(context, "previous");

    // const { isLoaded } = await context.playbackObj.getStatusAsync();
    // const isFirstAudio = context.currentAudioIndex <= 0;
    // let audio = context.audioFiles[context.currentAudioIndex - 1];
    // let index;
    // let status;
    // console.log(audio);
    // if (!isLoaded && !isFirstAudio) {
    //   index = context.currentAudioIndex - 1;
    //   status = await play(context.playbackObj, audio.url);
    // }

    // if (isLoaded && !isFirstAudio) {
    //   index = context.currentAudioIndex - 1;
    //   status = await playNext(context.playbackObj, audio.url);
    // }

    // if (isFirstAudio) {
    //   index = context.totalAudioCount - 1;
    //   audio = context.audioFiles[index];
    //   if (isLoaded) {
    //     status = await playNext(context.playbackObj, audio.url);
    //   } else {
    //     status = await play(context.playbackObj, audio.url);
    //   }
    // }

    // context.updateState(this.context, {
    //   currentAudio: audio,
    //   playbackObj: context.playbackObj,
    //   soundObj: status,
    //   isPlaying: true,
    //   currentAudioIndex: index,
    //   playbackPosition: null,
    //   playbackDuration: null,
    // });
    // storeAudioNextOpening(audio, index);
  };

  const renderCurrentTime = () => {
    return convertTime(context.playbackPosition / 1000);
  };

  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}></View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  audioController: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",
    padding: 15,
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
});

export default EmptyPlayer;
