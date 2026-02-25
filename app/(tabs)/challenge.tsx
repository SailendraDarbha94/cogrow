import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { auth, db } from '@/firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type WorkoutStats = {
  totalSessions: number;
  bestScore: number;
  lastScore: number;
};

const WORKOUT_META: Record<string, { unit: string; icon: string; placeholder: string }> = {
  'Push-Ups': { unit: 'reps', icon: '🏋️', placeholder: 'e.g. 30' },
  Plank: { unit: 'seconds', icon: '🧘', placeholder: 'e.g. 60' },
};

type Challenge = {
  challenger: string;
  contender: string;
  challengeType: string;
  status: string;
};

export default function ChallengeScreen() {
  const { challengeKey } = useLocalSearchParams<{ challengeKey: string }>();
  const router = useRouter();

  const [metric, setMetric] = useState('');
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);

  // Fetch challenge record from Firebase
  useEffect(() => {
    if (!challengeKey) { setLoadingChallenge(false); return; }
    get(ref(db, `challenges/${challengeKey}`))
      .then((snap) => { if (snap.exists()) setChallenge(snap.val() as Challenge); })
      .finally(() => setLoadingChallenge(false));
  }, [challengeKey]);

  const challengeType = challenge?.challengeType ?? 'Push-Ups';
  const friendName = challenge?.contender ?? 'Unknown';
  const meta = WORKOUT_META[challengeType] ?? WORKOUT_META['Push-Ups'];

  // Fetch past stats once we know the challengeType
  useEffect(() => {
    if (loadingChallenge) return;
    const uid = auth.currentUser?.uid;
    if (!uid) { setLoadingStats(false); return; }
    get(ref(db, `users/${uid}/stats/${challengeType}`))
      .then((snapshot) => { if (snapshot.exists()) setStats(snapshot.val() as WorkoutStats); })
      .finally(() => setLoadingStats(false));
  }, [challengeType, loadingChallenge]);

  const handleNext = () => {
    if (!metric.trim()) return;
    router.push({
      pathname: '/(tabs)/evidence-upload',
      params: { challengeKey, metric },
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e0e7ff', dark: '#1e1b4b' }}
      headerImage={
        <IconSymbol
          size={200}
          color="#6366f1"
          name="person.crop.circle"
          style={styles.headerIcon}
        />
      }>
      {/* Loading state */}
      {loadingChallenge && (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 32 }} />
      )}

      {/* Title */}
      {!loadingChallenge && <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          {challengeType}
        </ThemedText>
        <View style={styles.vsChip}>
          <ThemedText style={styles.vsText}>vs {friendName}</ThemedText>
        </View>
      </ThemedView>}

      {/* Past Performance Card */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Your Past Performance
        </ThemedText>
        {loadingStats ? (
          <ActivityIndicator size="small" color="#6366f1" style={{ marginTop: 8 }} />
        ) : stats ? (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statValue}>{stats.totalSessions}</ThemedText>
              <ThemedText style={styles.statLabel}>Sessions</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <ThemedText style={styles.statValue}>
                {stats.bestScore}
                <ThemedText style={styles.statUnit}> {meta.unit}</ThemedText>
              </ThemedText>
              <ThemedText style={styles.statLabel}>Best</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <ThemedText style={styles.statValue}>
                {stats.lastScore}
                <ThemedText style={styles.statUnit}> {meta.unit}</ThemedText>
              </ThemedText>
              <ThemedText style={styles.statLabel}>Last</ThemedText>
            </View>
          </View>
        ) : (
          <ThemedText style={styles.noStats}>No past data yet — this could be your first!</ThemedText>
        )}
      </ThemedView>

      {/* Log Performance Card */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {meta.icon} Log Your Performance
        </ThemedText>
        <ThemedText style={styles.inputLabel}>
          How many {meta.unit} did you complete?
        </ThemedText>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={metric}
            onChangeText={setMetric}
            placeholder={meta.placeholder}
            placeholderTextColor="#aaa"
          />
          <View style={styles.unitBadge}>
            <ThemedText style={styles.unitText}>{meta.unit}</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !metric.trim() && styles.nextButtonDisabled]}
        activeOpacity={0.85}
        disabled={!metric.trim()}
        onPress={handleNext}>
        <ThemedText style={styles.nextButtonText}>Next: Upload Evidence →</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    bottom: -40,
    left: -10,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  vsChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
  },
  vsText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
  card: {
    marginHorizontal: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Platform.select({ web: '#fff', default: '#fff' }),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    marginBottom: 12,
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6366f1',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#888',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#eee',
  },
  noStats: {
    color: '#999',
    fontSize: 13,
    fontStyle: 'italic',
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 18,
    color: '#111',
  },
  unitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e0e7ff',
  },
  unitText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  nextButton: {
    marginHorizontal: 12,
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#c7c7c7',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
