import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

export default function EvidenceUploadScreen() {
  const { friendName, challengeType, pushups } = useLocalSearchParams();
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

  const handleSendForApproval = () => {
    // Logic to send video for approval
    alert(`Video sent to ${friendName} for approval!`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Upload Evidence</ThemedText>
      <ThemedText>Challenge Type: {challengeType}</ThemedText>
      {challengeType === 'Push-Ups' && <ThemedText>Push-Ups Completed: {pushups}</ThemedText>}

      <Button title="Pick a Video" onPress={pickVideo} />
      {video && <ThemedText>Video Selected: {video}</ThemedText>}

      <Button title="Send Video for Approval" onPress={handleSendForApproval} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});