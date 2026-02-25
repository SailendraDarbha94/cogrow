import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

export default function ApprovalScreen() {
  const { friendName, challengeType, videoUri } = useLocalSearchParams();
  const [isApproved, setIsApproved] = useState(false);
  const [isMutualComplete, setIsMutualComplete] = useState(false);

  const handleApprove = () => {
    setIsApproved(true);
    // Simulate mutual task completion check
    const mutualComplete = true; // Replace with actual logic
    if (mutualComplete) {
      setIsMutualComplete(true);
      alert(`Challenge completed! You and ${friendName} earned a medal!`);
    } else {
      alert(`You approved ${friendName}'s video! Waiting for their approval.`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Approve Challenge</ThemedText>
      <ThemedText>Challenge Type: {challengeType}</ThemedText>
      <ThemedText>Video: {videoUri}</ThemedText>

      {!isApproved && <Button title="Approve" onPress={handleApprove} />}
      {isMutualComplete && <ThemedText>🎉 Challenge Completed! Medal Awarded! 🎉</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});