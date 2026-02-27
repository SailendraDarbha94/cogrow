import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { auth, db } from '@/firebaseConfig';
import { router } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { push, ref, serverTimestamp } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function TabTwoScreen() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Push-Ups');
  const [contenderEmail, setContenderEmail] = useState('');
  const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
      return unsubscribe;
    }, []);

  const createChallengeInFirebase = async ({ contender, challengeType }: any) => {
    const userName = user?.email;
    const uid = user?.uid;
    try {
      const newRef = await push(ref(db, 'challenges'), {
        challenger: userName ?? null,
        challengerUid: uid ?? null,
        contender,
        challengeType,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      console.log('Created challenge key:', newRef.key);
      return newRef.key;
    } catch (e) {
      console.error('Failed to create challenge:', e);
      return null;
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          New Entry
        </ThemedText>
      </ThemedView>
      {/* Top card with dropdown */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Select workout
        </ThemedText>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            onPress={() => setOpen((v) => !v)}
            style={styles.dropdownButton}
            activeOpacity={0.8}>
            <ThemedText>{selected}</ThemedText>
            <IconSymbol name="chevron.right" size={18} color="#666" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
          {open && (
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSelected('Push-Ups');
                  setOpen(false);
                }}>
                <ThemedText>Push-Ups</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSelected('Plank');
                  setOpen(false);
                }}>
                <ThemedText>Plank</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ThemedView>

      {/* Contender email card */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Contender's email
        </ThemedText>
        <TextInput
          style={styles.emailInput}
          placeholder="e.g. friend@example.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={contenderEmail}
          onChangeText={setContenderEmail}
        />
      </ThemedView>

      <TouchableOpacity
        style={[styles.startButton, !contenderEmail.trim() && styles.startButtonDisabled]}
        activeOpacity={0.85}
        disabled={!contenderEmail.trim()}
        onPress={async () => {
          const key = await createChallengeInFirebase({ contender: contenderEmail.trim(), challengeType: selected });
          if (key) {
            router.push({
              pathname: '/(tabs)/challenge',
              params: { challengeKey: key },
            });
          }
        }}>
        <ThemedText style={styles.startButtonText}>Start</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Platform.select({ web: '#fff', default: '#fff' }),
    // shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  cardTitle: {
    marginBottom: 8,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
  },
  options: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  emailInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    fontSize: 14,
    color: '#111',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  startButton: {
    marginHorizontal: 12,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#c7c7c7',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
