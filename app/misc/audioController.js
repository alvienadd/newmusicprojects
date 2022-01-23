import { storeAudioNextOpening } from "../misc/helper";
//play audio
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync(
      { uri: uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
    );
  } catch (error) {
    console.log("error inside play helper method", error.message);
  }
};

//pause audio
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error inside pause helper method", error.message);
  }
};

//resume audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error inside resume helper method", error.message);
  }
};
//select another audio
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("error inside playNext helper method", error.message);
  }
};

export const selectAudio = async (audio, context) => {
  const {
    soundObj,
    playbackObj,
    currentAudio,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
  } = context;
  try {
    // console.log("audio", audio);
    //playing audio for the first time
    if (soundObj === null) {
      // const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.url);
      const index = audioFiles.indexOf(audio);
      updateState(context, {
        currentAudio: audio,
        // playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return storeAudioNextOpening(audio, index);

      // await playbackObj.loadAsync(
      //   { uri: audio.url },
      //   { shouldPlay: true }
      // );
      // console.log(status);
      // return this.setState({
      //   ...this.state,
      //   currentAudio: audio,
      //   playbackObj: playbackObj,
      //   soundObj: status,
      // });
    }

    //pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      console.log("audio is already playing");
      const status = await pause(playbackObj);
      // console.log("this context", this.context);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        // playbackPosition: status.positionMillis,
      });
      // await this.state.playbackObj.setStatusAsync({
      //   shouldPlay: false,
      // });

      // return this.setState({
      //   ...this.state,
      //   soundObj: status,
      // });
    }
    // console.log("Current Audio:", this.state.currentAudio.id);
    // console.log("id:", audio.id);
    //resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      console.log("resume audio", soundObj);
      const status = await resume(playbackObj);
      return updateState(context, { soundObj: status, isPlaying: true });
      // await this.state.playbackObj.playAsync();
      // return this.setState({
      //   ...this.state,
      //   soundObj: status,
      // });
    }

    //select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      console.log("selected next audio");
      // const status = await playNext(playbackObj, audio.url);
      // const index = audioFiles.indexOf(audio);
      const status = await playNext(playbackObj, audio.url);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioNextOpening(audio, index);
    }
  } catch (error) {
    console.log("error inside select audio method.", error.message);
  }
};

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
  } = context;
  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    let audio;
    let index;
    let status;
    console.log(audio);
    //for next
    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];
      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.url);
      }

      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.url);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.url);
        } else {
          status = await play(playbackObj, audio.url);
        }
      }
    }

    //for previous
    if (select === "previous") {
      audio = audioFiles[currentAudioIndex - 1];
      if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.url);
      }

      if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.url);
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.url);
        } else {
          status = await play(playbackObj, audio.url);
        }
      }
    }

    updateState(context, {
      currentAudio: audio,
      // playbackObj: playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioNextOpening(audio, index);
  } catch (error) {
    console.log("error inside change audio method.", error.message);
  }
};

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  if (soundObj === null || !isPlaying) return;

  try {
    const status = await playbackObj.setPositionAsync(
      Math.floor(soundObj.durationMillis * value)
    );
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
    });

    await resume(playbackObj);
  } catch (error) {
    console.log("error inside onSlidingComplete callback", error);
  }
};
