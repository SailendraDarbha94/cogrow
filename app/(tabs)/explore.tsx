import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Push-Ups');
  const [contender, setContender] = useState<string | null>(null);

  const contenders = [
    { id: 'sailu', label: 'Sailu', initials: 'SA' },
    { id: 'cat', label: 'Cat', initials: 'CT' },
  ];
  const router = useRouter();

  const handleContenderSelect = (contenderId:any) => {
    setContender(contenderId);
    const selectedContender = contenders.find((c) => c.id === contenderId);
    if (selectedContender) {
      router.push({
        pathname: '/(tabs)/challenge',
        params: { friendName: selectedContender.label, challengeType: selected },
      });
    }
  };

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

      {/* Select Contender card */}
      <ThemedView style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Select contender
        </ThemedText>
        <View style={styles.contenderRow}>
          {contenders.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => handleContenderSelect(c.id)}
              style={[
                styles.contenderAvatar,
                contender === c.id && styles.contenderAvatarSelected,
              ]}
              activeOpacity={0.8}>
              <ThemedText style={styles.contenderInitials}>{c.initials}</ThemedText>
              <ThemedText style={styles.contenderLabel}>{c.label}</ThemedText>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.contenderAdd}
            activeOpacity={0.8}>
            <IconSymbol name="plus" size={22} color="#888" />
            <ThemedText style={styles.contenderLabel}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
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
  contenderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  contenderAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contenderAvatarSelected: {
    borderColor: '#6366f1',
  },
  contenderAdd: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  contenderInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  contenderLabel: {
    fontSize: 10,
    marginTop: 2,
    color: '#555',
  },
});
