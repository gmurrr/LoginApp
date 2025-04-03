import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as Crypto from "expo-crypto";

// Główna aplikacja zarządzająca ekranami
export default function App() {
  const [screen, setScreen] = useState("login"); // Stan przechowujący aktualny ekran
  const [userData, setUserData] = useState(null); // Przechowuje dane zalogowanego użytkownika

  return (
    <View style={styles.container}>
      {screen === "login" && (
        <LoginScreen
          onRegister={() => setScreen("register")}
          onLogin={(user) => {
            setUserData(user);
            setScreen("home");
          }}
        />
      )}
      {screen === "register" && <RegisterScreen onLogin={() => setScreen("home")} />}
      {screen === "home" && (
        <HomeScreen
          user={userData}
          onLogout={() => setScreen("login")}
          onRegister={() => setScreen("register")}
        />
      )}
    </View>
  );
}

// Ekran logowania
function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // Obsługuje proces logowania
  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("login", "==", login));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Błąd", "Nie ma takiego użytkownika");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      if (userData.password === hashedPassword) {
        onLogin(userData);
      } else {
        Alert.alert("Błąd", "Niepoprawne hasło.");
      }
    } catch (error) {
      Alert.alert("Błąd", "Wystąpił błąd aplikacji. Spróbuj ponownie.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Logowanie</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj login"
        placeholderTextColor="#bbb"
        onChangeText={setLogin}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Podaj hasło"
        placeholderTextColor="#bbb"
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Zaloguj się</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Ekran rejestracji użytkownika
function RegisterScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // Obsługuje proces rejestracji
  const handleRegister = async () => {
    if (!email || !firstName || !lastName || !login || !password) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      await addDoc(collection(db, "users"), {
        email,
        firstName,
        lastName,
        login,
        password: hashedPassword,
      });
      Alert.alert("Sukces", "Rejestracja zakończona pomyślnie");
      onLogin();
    } catch (error) {
      Alert.alert("Błąd", "Wystąpił problem podczas rejestracji");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dodaj nowego użytkownika</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Imię" onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Nazwisko" onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Login" onChangeText={setLogin} />
      <TextInput style={styles.input} secureTextEntry placeholder="Hasło" onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Zatwierdź</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogin}>
        <Text style={styles.link}>Powróć</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Ekran domowy po zalogowaniu
function HomeScreen({ user, onRegister, onLogout }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Zalogowano pomyślnie</Text>
      <Text style={styles.subtitle}>Witaj, {user.firstName} {user.lastName}!</Text>
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Wyloguj</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.link}>Czy chcesz dodać nowego użytkownika?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Style dla aplikacji
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  title: { fontSize: 24, color: "#fff", marginBottom: 20 },
  subtitle: { fontSize: 18, color: "#fff", marginBottom: 20 },
  input: { height: 40, borderColor: "#bbb", borderWidth: 1, marginBottom: 10, width: 250, paddingLeft: 10, color: "#fff", backgroundColor: "#222" },
  button: { backgroundColor: "#1E88E5", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
  link: { marginTop: 10, color: "#1E88E5" },
});
