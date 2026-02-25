import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { auth } from '@/firebaseConfig';
import { Image } from 'expo-image';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out failed', e);
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.headerImage} />
        ) : (
          <IconSymbol
            size={200}
            color="#808080"
            name="person.crop.circle"
            style={styles.headerIcon}
          />
        )
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Profile
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {user ? (
          <View>
            <View style={styles.row}>
              <ThemedText type="defaultSemiBold">Name: </ThemedText>
              <ThemedText>{user.displayName ?? '—'}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText type="defaultSemiBold">Email: </ThemedText>
              <ThemedText>{user.email ?? '—'}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText type="defaultSemiBold">UID: </ThemedText>
              <ThemedText>{user.uid}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText type="defaultSemiBold">Phone: </ThemedText>
              <ThemedText>{(user as any).phoneNumber ?? '—'}</ThemedText>
            </View>

            <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
              <ThemedText type="defaultSemiBold">Sign out</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <ThemedText>No user signed in.</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    color: '#808080',
    bottom: -40,
    left: -10,
    position: 'absolute',
  },
  headerImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: -40,
    left: -10,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    marginTop: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  signOut: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});
