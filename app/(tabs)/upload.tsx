import { StyleSheet, Image, Platform, Button, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';


export default function TabTwoScreen() {

  function extractJSON(text: string) {
    const match = text.match(/{[^]*}/); // matches content between the first `{` and last `}`
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
    }
    return null;
  }
  // const responseSchema = {
  //   type: 'object',
  //   properties: {
  //     total_time: { type : 'string' },
  //     screenshot_taken: { type : 'string' }
  //   }
  // }

  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [stats, setStats] = useState<any | null>(null);

  const genAI = new GoogleGenerativeAI("AIzaSyCAd25vj5yTgl95PJpf0dJXtma8hFg-Gvg");


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const uri = result.assets[0].uri;
      // Read the selected image as a base64 string
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setBase64Image(base64);
    }
  };

  const generateDescription = async (base64ImageString: string) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const prompt = "This is an image depicting the screen time details of a phone. analyse the image and give the details of total screen time with the time of the screenshot in this JSON format { total_time: '', screenshot_taken: ''}, if the provided image is not a screenshot depicting the screen time of a phone then just return this { error: 'Not a Screen Time Screenshot' }";

      const imagePart: any = {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg', // Adjust the MIME type as needed
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const description = response.text();
      const text = extractJSON(description);
      setStats(text);
      console.log('Generated Description:', text);

      setLoading(false);
      return description;
    } catch (error) {
      console.error('Error generating description:', error);
      setLoading(false);
      return 'Failed to generate description.';
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
        <ThemedText type="title">Screen Time Logs</ThemedText>
      </ThemedView>
      <ThemedText>This Page Contains your Uploaded Screenshots and Their Extracted Details</ThemedText>
      <Collapsible title="Latest Log Details">
        <ThemedText>
          Your Last Screenshot Upload:{' '}
          <ThemedText type="defaultSemiBold">Friday the 13th</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">Timezone and other details</ThemedText>
        </ThemedText>
        {/* <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink> */}
      </Collapsible>
      <Collapsible title="Current Status">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
          Also your current status is bad, your screen time usage is at an all time high
        </ThemedText>
      </Collapsible>
      {stats ? (
        <View>
          <Button title='Save' />
          <ThemedText>
            Extracted Details{'\n'}
            <ThemedText type="defaultSemiBold">Time : {stats?.total_time}</ThemedText>{'\n'}
            <ThemedText type="defaultSemiBold">Date : {stats?.screenshot_taken}</ThemedText>{' '}
          </ThemedText>
        </View>
      ) : null}
      {/* <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible> */}
      {loading ? (
        <View>
          <ThemedText>Loading...</ThemedText>
        </View>
      ) : (<>
        {image ? (
          <View style={styles.container}>
            <Button title='Analyze' onPress={() => generateDescription(base64Image as string)} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>
        ) : (
          <View style={styles.container}>
            <Button title='Upload Screenshot' onPress={pickImage} />
          </View>
        )}
      </>
      )}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
