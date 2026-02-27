import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { get, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

type Challenge = {
  key: string;
  challenger: string;
  challengerUid: string;
  contender: string;
  challengeType: string;
  status: 'pending' | 'awaiting_approval' | 'completed';
  createdAt: number;
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:           { label: 'Pending',            color: '#b45309', bg: '#fef3c7' },
  awaiting_approval: { label: 'Awaiting Approval',  color: '#1d4ed8', bg: '#dbeafe' },
  completed:         { label: 'Completed',           color: '#15803d', bg: '#dcfce7' },
};

export default function HomeScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteChallenge = (key: string) => {
    Alert.alert(
      'Delete Challenge',
      'Are you sure you want to delete this challenge?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(ref(db, `challenges/${key}`));
              setChallenges((prev) => prev.filter((c) => c.key !== key));
            } catch (e) {
              console.error('Failed to delete challenge:', e);
              Alert.alert('Error', 'Failed to delete challenge. Please try again.');
            }
          },
        },
      ]
    );
  };

  const fetchChallenges = async (email: string) => {
    try {
      const snap = await get(ref(db, 'challenges'));
      if (snap.exists()) {
        const data = snap.val() as Record<string, Omit<Challenge, 'key'>>;
        const list = Object.entries(data)
          .map(([key, val]) => ({ key, ...val }))
          .filter((c) => c.challenger === email);
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setChallenges(list);
      } else {
        setChallenges([]);
      }
    } catch (e) {
      console.error('Failed to fetch challenges:', e);
    } finally {
      setLoading(false);
    }
  };

  // Wait for Firebase Auth to restore session before fetching
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        fetchChallenges(user.email);
      } else {
        setLoading(false);
        setChallenges([]);
      }
    });
    return unsub;
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e0e7ff', dark: '#1e1b4b' }}
      headerImage={
        <IconSymbol
          size={260}
          color="#6366f1"
          name="house.fill"
          style={styles.headerIcon}
        />

      }
      >

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Dashboard
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.sectionLabel}>Active Challenges</ThemedText>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 32 }} />
      ) : challenges.length === 0 ? (
        <ThemedView style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>No active challenges yet.</ThemedText>
          <ThemedText style={styles.emptyHint}>
            Head to the + tab to start a new challenge!
          </ThemedText>
        </ThemedView>
      ) : (
        challenges.map((c) => {
          const s = STATUS_META[c.status] ?? STATUS_META['pending'];
          return (
            <TouchableOpacity
              key={c.key}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({ pathname: '/(tabs)/challenge', params: { challengeKey: c.key } })
              }>
              {/* Header row */}
              <View style={styles.cardHeader}>
                <ThemedText type="defaultSemiBold" style={styles.challengeType}>
                  {c.challengeType}
                </ThemedText>
                <View style={styles.cardHeaderRight}>
                  <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <ThemedText style={[styles.statusText, { color: s.color }]}>
                      {s.label}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => { e.stopPropagation(); deleteChallenge(c.key); }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <IconSymbol name="trash" size={15} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Details row */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>You</ThemedText>
                  <ThemedText style={styles.detailValue}>{c.challenger}</ThemedText>
                </View>
                <ThemedText style={styles.vsText}>vs</ThemedText>
                <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
                  <ThemedText style={styles.detailLabel}>Contender</ThemedText>
                  <ThemedText style={styles.detailValue}>{c.contender}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    color: '#6366f1',
    bottom: -60,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginHorizontal: 4,
  },
  card: {
    marginHorizontal: 2,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Platform.select({ web: '#fff', default: '#fff' }),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  challengeType: {
    fontSize: 16,
    color: '#111',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366f1',
    marginHorizontal: 12,
  },
  emptyCard: {
    marginTop: 24,
    padding: 24,
    borderRadius: 14,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366f1',
  },
  emptyHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
