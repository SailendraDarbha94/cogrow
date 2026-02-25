import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Challenge = {
  challenger: string;
  contender: string;
  challengeType: string;
  status: string;
};

export default function EvidenceUploadScreen() {
  const { challengeKey, metric } = useLocalSearchParams<{
    challengeKey: string;
    metric: string;
  }>();
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [video, setVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!challengeKey) { setLoadingChallenge(false); return; }
    get(ref(db, `challenges/${challengeKey}`))
      .then((snap) => { if (snap.exists()) setChallenge(snap.val() as Challenge); })
      .finally(() => setLoadingChallenge(false));
  }, [challengeKey]);

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access media library is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const handleSend = async () => {
    if (!video) return;
    setUploading(true);
    // TODO: upload video to Firebase Storage and write challenge record to RTDB
    await new Promise((r) => setTimeout(r, 1500)); // simulate upload
    setUploading(false);
    setSent(true);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e0e7ff', dark: '#1e1b4b' }}
      headerImage={
        <IconSymbol
          size={180}
          color="#6366f1"
          name="person.crop.circle"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Upload Evidence
        </ThemedText>
      </ThemedView>

      {/* Summary card */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Challenge Summary
        </ThemedText>
        {loadingChallenge ? (
          <ActivityIndicator size="small" color="#6366f1" style={{ marginVertical: 8 }} />
        ) : (
          <>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Workout</ThemedText>
              <ThemedText style={styles.summaryValue}>{challenge?.challengeType ?? '—'}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Challenger</ThemedText>
              <ThemedText style={styles.summaryValue}>{challenge?.challenger ?? '—'}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Contender</ThemedText>
              <ThemedText style={styles.summaryValue}>{challenge?.contender ?? '—'}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Your score</ThemedText>
              <ThemedText style={[styles.summaryValue, styles.summaryScore]}>{metric}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Status</ThemedText>
              <ThemedText style={styles.summaryValue}>{challenge?.status ?? '—'}</ThemedText>
            </View>
          </>
        )}
      </ThemedView>

      {/* Video upload card */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          📹 Video Evidence
        </ThemedText>
        <ThemedText style={styles.hint}>
          Record yourself completing the challenge and upload it here. Your contender will review
          it before submitting their own.
        </ThemedText>

        <TouchableOpacity
          style={[styles.uploadBox, video ? styles.uploadBoxDone : null]}
          onPress={pickVideo}
          activeOpacity={0.8}>
          <ThemedText style={styles.uploadIcon}>{video ? '✅' : '🎥'}</ThemedText>
          <ThemedText style={styles.uploadText}>
            {video ? 'Video selected — tap to change' : 'Tap to select a video'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Send button */}
      {!sent ? (
        <TouchableOpacity
          style={[styles.sendButton, (!video || uploading) && styles.sendButtonDisabled]}
          activeOpacity={0.85}
          disabled={!video || uploading}
          onPress={handleSend}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.sendButtonText}>Send video for approval →</ThemedText>
          )}
        </TouchableOpacity>
      ) : (
        <ThemedView style={styles.successCard}>
          <ThemedText style={styles.successText}>
            🎉 Video sent! Waiting for {challenge?.contender ?? 'your contender'} to approve.
          </ThemedText>
        </ThemedView>
      )}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#888',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryScore: {
    color: '#6366f1',
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 14,
    lineHeight: 19,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#c7d2fe',
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f3ff',
  },
  uploadBoxDone: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
  sendButton: {
    marginHorizontal: 12,
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#c7c7c7',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  successCard: {
    marginHorizontal: 12,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
  },
  successText: {
    color: '#166534',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});
