import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

export default function ChallengeScreen() {
  const { friendName = 'Unknown', challengeType = 'Unknown' } = useLocalSearchParams();
  const [pushups, setPushups] = useState('');
  const router = useRouter();

  const handleNext = () => {
    router.push({
      pathname: '/evidence-upload',
      params: { friendName, challengeType, pushups },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Challenge with {friendName}</ThemedText>
      <ThemedText>Challenge Type: {challengeType}</ThemedText>

      {challengeType === 'Push-Ups' && (
        <View style={styles.inputContainer}>
          <ThemedText>Enter the number of push-ups you did:</ThemedText>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pushups}
            onChangeText={setPushups}
          />
        </View>
      )}

      <Button title="Next" onPress={handleNext} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
});