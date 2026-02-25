import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

export default function ContenderUploadScreen() {
  const { challengerName, challengeType } = useLocalSearchParams();
  const [video, setVideo] = useState(null);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.uri);
    }
  };

  const handleSubmit = () => {
    alert(`Video submitted for ${challengerName} to approve!`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Upload Your Challenge</ThemedText>
      <ThemedText>Challenge Type: {challengeType}</ThemedText>

      <Button title="Pick a Video" onPress={pickVideo} />
      {video && <ThemedText>Video Selected: {video}</ThemedText>}

      <Button title="Submit Video" onPress={handleSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});