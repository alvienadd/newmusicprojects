import React, { useContext, useEffect } from "react";
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
} from "../misc/audioController";
import { storeAudioNextOpening } from "../misc/helper";
import { changeAudio } from "../misc/audioController";

const { width } = Dimensions.get("window");

const Player = () => {
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

  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>
          {context.currentAudioIndex + 1} / {context.totalAudioCount}
        </Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.title}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioController}>
            <PlayerButton iconType={"PREV"} onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            />
            <PlayerButton iconType={"NEXT"} onPress={handleNext} />
          </View>
        </View>
      </View>
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

export default Player;
