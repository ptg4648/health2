// Login.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          navigation.navigate('MainTabs', { screen: 'Home', params: { userName: userData.name } });
        } else {
          Alert.alert("로그인 오류", "사용자 데이터를 찾을 수 없습니다.");
        }
      } catch (docError) {
        console.error("Firestore 문서 오류:", docError.message);
        Alert.alert("Firestore 문서를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (authError) {
      console.error("로그인 오류:", authError.message);
      switch (authError.code) {
        case 'auth/invalid-email':
          Alert.alert("로그인 오류", "유효하지 않은 이메일 형식입니다.");
          break;
        case 'auth/user-not-found':
          Alert.alert("로그인 오류", "가입되지 않은 이메일입니다.");
          break;
        case 'auth/wrong-password':
          Alert.alert("로그인 오류", "비밀번호가 잘못되었습니다.");
          break;
        default:
          Alert.alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <View style={styles.view}>
      <Image style={styles.image4Icon} resizeMode="contain" source={require('../assets/image 4.png')} />
      <Text style={[styles.healthguard, styles.textTypo]}>HealthCare</Text>
      <View style={[styles.idWrapper, styles.wrapperFlexBox]}>
        <TextInput
          style={[styles.idInput, styles.idTypo]}
          placeholder="ID"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.passwordWrapper, styles.wrapperFlexBox]}>
        <TextInput
          style={[styles.passwordInput, styles.idTypo]}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => {
          navigation.navigate('Signup');  // 회원가입 버튼을 누르면 Signup 화면으로 이동
        }}
      >
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "center",
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    fontStyle: "italic"
  },
  wrapperFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    width: "80%",
    backgroundColor: "#a5a6f6",
    borderRadius: 25,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  idTypo: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    fontStyle: "italic"
  },
  idInput: {
    color: "rgba(255, 255, 255, 0.9)",
    flex: 1
  },
  passwordInput: {
    color: "rgba(255, 255, 255, 0.9)",
    flex: 1
  },
  healthguard: {
    fontSize: 48,
    color: "#2e55ba",
    marginBottom: 20
  },
  loginButton: {
    backgroundColor: "#5d5fef",
    width: "80%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 10
  },
  loginButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    fontStyle: "italic"
  },
  signupButton: {
    backgroundColor: "#fff",
    width: "80%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#5d5fef",
    marginVertical: 10
  },
  signupButtonText: {
    fontSize: 18,
    color: "#5d5fef",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    fontStyle: "italic"
  },
  image4Icon: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  view: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  }
});

export default Login;
