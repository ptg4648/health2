import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, Pressable, Image, ScrollView, Picker } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name || !age || !height || !weight || !gender) {
      Alert.alert("모든 필드를 입력해 주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        age,
        height,
        weight,
        gender,
      });
      Alert.alert("회원가입 성공!", "회원가입이 완료되었습니다.", [
        { text: "확인", onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error("회원가입 오류:", error);
      Alert.alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/back.png')} style={styles.backIcon} />
      </Pressable>
      <Text style={styles.header}>회원가입</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예)abc@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호 *</Text>
        <TextInput
          style={styles.input}
          placeholder="영문, 숫자 조합 8~16자"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호 확인 *</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 한 번 더 입력해주세요."
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이름 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 홍길동"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>나이 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 25"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>키 (cm) *</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 175"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>몸무게 (kg) *</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 70"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>성별 *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="남성" value="남성" />
            <Picker.Item label="여성" value="여성" />
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center"
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  header: {
    fontSize: 36,
    color: "#000",
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    marginVertical: 20
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    marginBottom: 5
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular"
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  signupButton: {
    backgroundColor: "#5d5fef",
    width: "80%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 20
  },
  signupButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    fontStyle: "italic"
  }
});

export default Signup;
