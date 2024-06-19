import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setEmail(user.email); // Ensure we get the email from the user object
          setName(userData.name);
          setAge(userData.age);
          setHeight(userData.height);
          setWeight(userData.weight);
          setGender(userData.gender);
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);

      try {
        await updateDoc(docRef, {
          email,
          name,
          age,
          height,
          weight,
          gender
        });
        Alert.alert('프로필 업데이트', '프로필이 성공적으로 업데이트되었습니다.');
      } catch (error) {
        console.error('Error updating profile: ', error);
        Alert.alert('프로필 업데이트 오류', '프로필 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>
      <Text style={styles.header}>내 프로필</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일 *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={false} // 이메일은 수정 불가
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이름 *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>나이 *</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>키 (cm) *</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>몸무게 (kg) *</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>성별 *</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.updateButtonText}>프로필 업데이트</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center"
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5d5fef',
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
  updateButton: {
    backgroundColor: "#5d5fef",
    width: "80%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 20
  },
  updateButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    fontStyle: "italic"
  }
});

export default Profile;
