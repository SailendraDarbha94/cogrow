import { ThemedText, ThemedView } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const medals = [
  { id: 1, name: 'Push-Up Challenge', date: '2026-02-25' },
  // Add more medals dynamically
];

export default function DashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Medals</ThemedText>
      <View style={styles.medalsContainer}>
        {medals.map((medal) => (
          <View key={medal.id} style={styles.medal}>
            <ThemedText>{medal.name}</ThemedText>
            <ThemedText style={styles.date}>{medal.date}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  medalsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  medal: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
});