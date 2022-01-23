import React, { Component, createContext } from "react";
import { Alert, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import { Audio } from "expo-av";
import { storeAudioNextOpening } from "../misc/helper";
import { pause, play, resume, playNext } from "../misc/audioController";
export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This Apps need to read audio files!", [
      {
        text: "I am ready",
        onPress: () => this.getPermission(),
      },
      {
        text: "cancel",
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    // let media = await MediaLibrary.getAssetsAsync({
    //   mediaType: "audio",
    // });

    // media = await MediaLibrary.getAssetsAsync({
    //   mediaType: "audio",
    //   first: media.totalCount,
    // });

    const { dataProvider, audioFiles } = this.state;

    const response = await fetch(
      "https://raw.githubusercontent.com/alvienadd/osttruebeauty/master/data.json"
    );
    const json = await response.text();
    const jsonResult = json;
    let object = JSON.parse(jsonResult);
    let array = Object.keys(object).map(function (k) {
      return object[k];
    });

    this.totalAudioCount = Object.keys(array).length;
    console.log("Total Count:", Object.keys(array).length);
    // this.setState({ ...this.state, audioFiles: media.assets });
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([...audioFiles, ...array]),
      audioFiles: [...audioFiles, ...array],
    });
  };

  loadPreviuousAudio = async () => {
    //todo: we need to load audio from our async storage
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    //    {
    //         "canAskAgain": true,
    //         "expires": "never",
    //         "granted": false,
    //         "status": "undetermined",
    //   }
    // console.log(permission);
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      //we want to get all the audio files
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();

      if (status === "denied" && canAskAgain) {
        //we are going to display alert that user must allow this permission to work this app
        this.permissionAlert();
      }

      if (status === "granted") {
        //we want to get all the audio files
        this.getAudioFiles();
      }

      if (status === "denied" && !canAskAgain) {
        //we want to display some error to the user
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  onPlaybackStatusUpdate = async (playbackStatus) => {
    // console.log("Test:", playbackStatus);
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    // console.log("playback status", playbackStatus);
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      //there is no next audio to play or the current audio is the last
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioNextOpening(this.state.audioFiles[0], 0);
      }

      //otherwise we want to select the next audio
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.url);
      this.state.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioNextOpening(audio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;

    if (permissionError)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, textAlign: "center", color: "red" }}>
            It looks like you haven't accept the permission.
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles: audioFiles,
          // audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          updateState: this.updateState,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          loadPreviousAudio: this.loadPreviuousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
