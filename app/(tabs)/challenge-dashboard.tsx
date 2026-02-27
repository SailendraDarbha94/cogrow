import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { auth, db, storage } from '@/firebaseConfig';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { onAuthStateChanged } from 'firebase/auth';
import { get, ref, update } from 'firebase/database';
import { getDownloadURL, listAll, ref as storageRef } from 'firebase/storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

type Challenge = {
  challenger: string;
  contender: string;
  challengeType: string;
  status: string;
};

type Submission = {
  score?: number | string;
  approvalStatus?: 'blank' | 'sent_for_approval' | 'approved' | 'rejected';
};

// Firebase RTDB does not allow '.' in keys – encode email
const encodeEmail = (email: string) => email.replace(/\./g, ',');

// ─── Approval badge ────────────────────────────────────────────────────────────

const APPROVAL_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  blank:              { label: 'Not submitted', color: '#888',   bg: '#f3f4f6' },
  sent_for_approval:  { label: 'Sent for approval', color: '#b45309', bg: '#fef3c7' },
  approved:           { label: 'Approved ✓',  color: '#15803d', bg: '#dcfce7' },
  rejected:           { label: 'Rejected ✗',  color: '#b91c1c', bg: '#fee2e2' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TileCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.tile, style]}>{children}</View>;
}

function VideoTile({ videoUrl }: { videoUrl: string | null | undefined }) {
  const player = useVideoPlayer(videoUrl ?? null, (p) => {
    p.loop = false;
  });

  if (!videoUrl) {
    return (
      <TileCard>
        <View style={styles.videoPlaceholder}>
          <IconSymbol name="video.slash" size={28} color="#ccc" />
          <ThemedText style={styles.tileSubLabel}>No video</ThemedText>
        </View>
      </TileCard>
    );
  }
  return (
    <TileCard style={{ padding: 0, overflow: 'hidden' }}>
      <VideoView
        player={player}
        style={styles.videoPlayer}
        allowsFullscreen
        allowsPictureInPicture={false}
        nativeControls
      />
    </TileCard>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ChallengeDashboardScreen() {
  const { challengeKey } = useLocalSearchParams<{ challengeKey: string }>();
  const router = useRouter();

  const [challenge, setChallenge]         = useState<Challenge | null>(null);
  const [loading, setLoading]             = useState(true);
  const [mySubmission, setMySubmission]   = useState<Submission | null>(null);
  const [oppSubmission, setOppSubmission] = useState<Submission | null>(null);
  const [myVideoUrl, setMyVideoUrl]       = useState<string | null>(null);
  const [oppVideoUrl, setOppVideoUrl]     = useState<string | null>(null);
  const [approving, setApproving]         = useState(false);
  const [myEmail, setMyEmail]             = useState<string>('');
  const [authReady, setAuthReady]         = useState(false);

  // Wait for Firebase Auth to restore session before fetching
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setMyEmail(user?.email ?? '');
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const loadAll = useCallback(async () => {
    if (!authReady) return;
    if (!challengeKey || !myEmail) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Challenge record
      const snap = await get(ref(db, `challenges/${challengeKey}`));
      if (!snap.exists()) { setLoading(false); return; }
      const c = snap.val() as Challenge;
      setChallenge(c);

      const opponentEmail = c.challenger === myEmail ? c.contender : c.challenger;

      // 2. Submissions (score + approval)
      const [mySubSnap, oppSubSnap] = await Promise.all([
        get(ref(db, `challenges/${challengeKey}/submissions/${encodeEmail(myEmail)}`)),
        get(ref(db, `challenges/${challengeKey}/submissions/${encodeEmail(opponentEmail)}`)),
      ]);

      setMySubmission(mySubSnap.exists() ? (mySubSnap.val() as Submission) : null);
      setOppSubmission(oppSubSnap.exists() ? (oppSubSnap.val() as Submission) : null);

      // 3. Video download URLs from Storage
      const fetchVideoUrl = async (email: string): Promise<string | null> => {
        try {
          const folder = storageRef(storage, `challenges/${challengeKey}/${email}`);
          const result = await listAll(folder);
          if (result.items.length === 0) return null;
          return await getDownloadURL(result.items[0]);
        } catch {
          return null;
        }
      };

      const [myUrl, oppUrl] = await Promise.all([
        fetchVideoUrl(myEmail),
        fetchVideoUrl(opponentEmail),
      ]);

      setMyVideoUrl(myUrl);
      setOppVideoUrl(oppUrl);
    } finally {
      setLoading(false);
    }
  }, [challengeKey, myEmail, authReady]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Re-fetch every time the screen comes into focus (e.g. after uploading evidence)
  useFocusEffect(
    useCallback(() => {
      if (authReady) loadAll();
    }, [authReady, loadAll])
  );

  const handleApprove = async (decision: 'approved' | 'rejected') => {
    if (!challenge || !challengeKey) return;
    const opponentEmail = challenge.challenger === myEmail ? challenge.contender : challenge.challenger;
    setApproving(true);
    try {
      await update(
        ref(db, `challenges/${challengeKey}/submissions/${encodeEmail(opponentEmail)}`),
        { approvalStatus: decision },
      );
      setOppSubmission((prev) => ({ ...prev, approvalStatus: decision }));
    } catch {
      Alert.alert('Error', 'Could not save decision. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const isAttempted = !!mySubmission?.score;
  const opponentEmail = challenge
    ? challenge.challenger === myEmail
      ? challenge.contender
      : challenge.challenger
    : '';
  const myApproval   = mySubmission?.approvalStatus  ?? 'blank';
  const oppApproval  = oppSubmission?.approvalStatus ?? 'blank';
  const myApprovalMeta  = APPROVAL_META[myApproval]  ?? APPROVAL_META['blank'];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#e0e7ff', dark: '#1e1b4b' }}
      headerImage={
        <IconSymbol
          size={180}
          color="#6366f1"
          name="chart.bar.fill"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Progress
        </ThemedText>
      </ThemedView>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
      ) : !challenge ? (
        <ThemedText style={styles.errorText}>Challenge not found.</ThemedText>
      ) : (
        <>
          {/* ── Challenge info card ── */}
          <ThemedView style={styles.infoCard}>
            <ThemedText type="defaultSemiBold" style={styles.challengeType}>
              {challenge.challengeType}
            </ThemedText>
            <View style={styles.vsRow}>
              <View style={styles.participant}>
                <ThemedText style={styles.participantRole}>Challenger</ThemedText>
                <ThemedText style={styles.participantEmail} numberOfLines={1}>
                  {challenge.challenger}
                </ThemedText>
              </View>
              <ThemedText style={styles.vsText}>vs</ThemedText>
              <View style={[styles.participant, { alignItems: 'flex-end' }]}>
                <ThemedText style={styles.participantRole}>Contender</ThemedText>
                <ThemedText style={styles.participantEmail} numberOfLines={1}>
                  {challenge.contender}
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* ── My progress section ── */}
          <ThemedText style={styles.sectionLabel}>Your Progress</ThemedText>
          <View style={styles.tilesRow}>
            {/* Tile 1 – Attempt status */}
            <TileCard>
              <ThemedText style={styles.tileLabel}>Status</ThemedText>
              {isAttempted ? (
                <>
                  <ThemedText style={styles.scoreValue}>{mySubmission?.score}</ThemedText>
                  <ThemedText style={styles.tileSubLabel}>score</ThemedText>
                </>
              ) : (
                <>
                  <ThemedText style={[styles.tileSubLabel, { color: '#ef4444', marginBottom: 8 }]}>
                    Not attempted
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.attemptButton}
                    onPress={() =>
                      router.push({ pathname: '/(tabs)/challenge', params: { challengeKey } })
                    }>
                    <ThemedText style={styles.attemptButtonText}>Go attempt</ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </TileCard>

            {/* Tile 2 – My video */}
            <VideoTile videoUrl={myVideoUrl} />

            {/* Tile 3 – Approval status */}
            <TileCard>
              <ThemedText style={styles.tileLabel}>Approval</ThemedText>
              <View style={[styles.approvalBadge, { backgroundColor: myApprovalMeta.bg }]}>
                <ThemedText
                  style={[styles.approvalBadgeText, { color: myApprovalMeta.color }]}
                  numberOfLines={2}>
                  {myApprovalMeta.label}
                </ThemedText>
              </View>
            </TileCard>
          </View>

          {/* ── Opponent progress section ── */}
          <ThemedText style={[styles.sectionLabel, { marginTop: 24 }]}>
            Opponent Progress
          </ThemedText>
          <ThemedText style={styles.opponentEmail} numberOfLines={1}>
            {opponentEmail}
          </ThemedText>
          <View style={styles.tilesRow}>
            {/* Tile 1 – Their score */}
            <TileCard>
              <ThemedText style={styles.tileLabel}>Score</ThemedText>
              {oppSubmission?.score ? (
                <>
                  <ThemedText style={styles.scoreValue}>{oppSubmission.score}</ThemedText>
                  <ThemedText style={styles.tileSubLabel}>score</ThemedText>
                </>
              ) : (
                <ThemedText style={[styles.tileSubLabel, { color: '#aaa' }]}>
                  Not attempted
                </ThemedText>
              )}
            </TileCard>

            {/* Tile 2 – Their video */}
            <VideoTile videoUrl={oppVideoUrl} />

            {/* Tile 3 – Approve / Reject */}
            <TileCard>
              <ThemedText style={styles.tileLabel}>Verdict</ThemedText>
              {oppApproval === 'approved' || oppApproval === 'rejected' ? (
                <View
                  style={[
                    styles.approvalBadge,
                    { backgroundColor: APPROVAL_META[oppApproval].bg },
                  ]}>
                  <ThemedText
                    style={[
                      styles.approvalBadgeText,
                      { color: APPROVAL_META[oppApproval].color },
                    ]}
                    numberOfLines={2}>
                    {APPROVAL_META[oppApproval].label}
                  </ThemedText>
                </View>
              ) : oppSubmission?.score && oppVideoUrl ? (
                <View style={styles.verdictButtons}>
                  <TouchableOpacity
                    style={[styles.verdictBtn, styles.approveBtn]}
                    disabled={approving}
                    onPress={() => handleApprove('approved')}>
                    {approving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ThemedText style={styles.verdictBtnText}>✓</ThemedText>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.verdictBtn, styles.rejectBtn]}
                    disabled={approving}
                    onPress={() => handleApprove('rejected')}>
                    <ThemedText style={styles.verdictBtnText}>✗</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <ThemedText style={[styles.tileSubLabel, { color: '#aaa' }]}>
                  Awaiting attempt
                </ThemedText>
              )}
            </TileCard>
          </View>
        </>
      )}
    </ParallaxScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  headerIcon: {
    bottom: -50,
    left: -10,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 32,
  },

  // Info card
  infoCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  challengeType: {
    fontSize: 18,
    color: '#111',
    marginBottom: 12,
    fontWeight: '700',
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participant: {
    flex: 1,
  },
  participantRole: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  participantEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  vsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366f1',
    marginHorizontal: 10,
  },

  // Section headings
  sectionLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 2,
  },
  opponentEmail: {
    fontSize: 12,
    color: '#6366f1',
    marginBottom: 8,
    marginHorizontal: 2,
  },

  // Tiles row
  tilesRow: {
    flexDirection: 'column',
    gap: 8,
  },
  tile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  tileLabel: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  tileSubLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  scoreValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#6366f1',
    lineHeight: 30,
  },

  // Attempt button
  attemptButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  attemptButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // Approval badge
  approvalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
  },
  approvalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Video tile
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: 210,
    borderRadius: 12,
  },

  // Verdict buttons
  verdictButtons: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  verdictBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtn: {
    backgroundColor: '#16a34a',
  },
  rejectBtn: {
    backgroundColor: '#dc2626',
  },
  verdictBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
