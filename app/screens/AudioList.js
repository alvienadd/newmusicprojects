import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { Audio } from "expo-av";
import {
  pause,
  play,
  resume,
  playNext,
  selectAudio,
} from "../misc/audioController";
import { storeAudioNextOpening } from "../misc/helper";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      // playbackObj: null,
      // soundObj: null,
      // currentAudio: {},
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  onPlaybackStatusUpdate = async (playbackStatus) => {
    // console.log("Test:", playbackStatus);
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.context.updateState(this.context, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    // console.log("playback status", playbackStatus);
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.context.currentAudioIndex + 1;
      //there is no next audio to play or the current audio is the last
      if (nextAudioIndex >= this.context.totalAudioCount) {
        this.context.playbackObj.unloadAsync();
        this.context.updateState(this.context, {
          soundObj: null,
          currentAudio: this.context.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioNextOpening(this.context.audioFiles[0], 0);
      }

      //otherwise we want to select the next audio
      const audio = this.context.audioFiles[nextAudioIndex];
      const status = await playNext(this.context.playbackObj, audio.url);
      this.context.updateState(this.context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioNextOpening(audio, nextAudioIndex);
    }
  };

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);

    // const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
    //   this.context;
    // // console.log("audio", audio);
    // //playing audio for the first time
    // if (soundObj === null) {
    //   const playbackObj = new Audio.Sound();
    //   const status = await play(playbackObj, audio.url);
    //   const index = audioFiles.indexOf(audio);
    //   updateState(this.context, {
    //     currentAudio: audio,
    //     playbackObj: playbackObj,
    //     soundObj: status,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   playbackObj.setOnPlaybackStatusUpdate(
    //     this.context.onPlaybackStatusUpdate
    //   );
    //   return storeAudioNextOpening(audio, index);

    //   // await playbackObj.loadAsync(
    //   //   { uri: audio.url },
    //   //   { shouldPlay: true }
    //   // );
    //   // console.log(status);
    //   // return this.setState({
    //   //   ...this.state,
    //   //   currentAudio: audio,
    //   //   playbackObj: playbackObj,
    //   //   soundObj: status,
    //   // });
    // }

    // //pause audio
    // if (
    //   soundObj.isLoaded &&
    //   soundObj.isPlaying &&
    //   currentAudio.id === audio.id
    // ) {
    //   console.log("audio is already playing");
    //   const status = await pause(playbackObj);
    //   // console.log("this context", this.context);
    //   return updateState(this.context, { soundObj: status, isPlaying: false });
    //   // await this.state.playbackObj.setStatusAsync({
    //   //   shouldPlay: false,
    //   // });

    //   // return this.setState({
    //   //   ...this.state,
    //   //   soundObj: status,
    //   // });
    // }
    // // console.log("Current Audio:", this.state.currentAudio.id);
    // // console.log("id:", audio.id);
    // //resume audio
    // if (
    //   soundObj.isLoaded &&
    //   !soundObj.isPlaying &&
    //   currentAudio.id === audio.id
    // ) {
    //   console.log("resume audio", soundObj);
    //   const status = await resume(playbackObj);
    //   return updateState(this.context, { soundObj: status, isPlaying: true });
    //   // await this.state.playbackObj.playAsync();
    //   // return this.setState({
    //   //   ...this.state,
    //   //   soundObj: status,
    //   // });
    // }

    // //select another audio
    // if (soundObj.isLoaded && currentAudio.id !== audio.id) {
    //   console.log("selected next audio");
    //   const status = await playNext(playbackObj, audio.url);
    //   const index = audioFiles.indexOf(audio);
    //   updateState(this.context, {
    //     currentAudio: audio,
    //     soundObj: status,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   return storeAudioNextOpening(audio, index);
    // }
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    // console.log("Item:", extendedState);
    // return <Text>{item.title}</Text>;
    return (
      <AudioListItem
        title={item.title}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        // isPlaying={this.context.isPlaying}
        // onOptionPress={() => console.log("opening options")}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                onPlayPress={() => console.log("Playing Audio")}
                onPlayListPress={() => console.log("Adding to Playlist")}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioList;
