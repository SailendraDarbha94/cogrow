import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';




export default function LoginScreen() {

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "CoGrow",
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to CoGrow</Text>
            <Text style={styles.description}>This is where you can reduce your screen time and increase the lifespan of your eyes.</Text>
            <View style={styles.buttonContainer}>
                <Button title="Login" />
                <Button title="Sign Up" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 44,
        fontWeight: 'bold',
        margin: 10,
    },
    description: {
        fontSize: 18,
        color: '#000',
        margin: 10
    },
});