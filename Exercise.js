import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TextInput, FlatList } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Picker } from '@react-native-picker/picker';

const Exercise = () => {
  const [selectedExercise, setSelectedExercise] = useState('레그익스텐션');
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [exerciseRecords, setExerciseRecords] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchExerciseRecords = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'exercises'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map(doc => doc.data());
        setExerciseRecords(records);
      }
    };

    fetchExerciseRecords();
  }, []);

  const handleSaveExercise = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'exercises'), {
          userId: user.uid,
          exercise: selectedExercise,
          date: date.toISOString().split('T')[0],
          duration
        });
        Alert.alert('운동 기록 저장', '운동 기록이 성공적으로 저장되었습니다.');
        setExerciseRecords(prev => [...prev, { exercise: selectedExercise, date: date.toISOString().split('T')[0], duration }]);
      } catch (error) {
        console.error('Error saving exercise: ', error);
        Alert.alert('운동 기록 오류', '운동 기록 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>운동 기록 하기</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>운동 종류</Text>
        <Picker
          selectedValue={selectedExercise}
          onValueChange={(itemValue) => setSelectedExercise(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="레그프레스" value="레그프레스" />
          <Picker.Item label="덤벨컬" value="덤벨컬" />
          <Picker.Item label="바벨컬" value="바벨컬" />
          <Picker.Item label="트라이셉스익스텐션" value="트라이셉스익스텐션" />
          <Picker.Item label="벤치프레스" value="벤치프레스" />
          <Picker.Item label="인클라인벤치프레스" value="인클라인벤치프레스" />
          <Picker.Item label="펙덱플라이" value="펙덱플라이" />
          <Picker.Item label="케이블크로스오버" value="케이블크로스오버" /> 
          <Picker.Item label="풀업" value="풀업" />
          <Picker.Item label="친업" value="친업" />
          <Picker.Item label="데드리프트" value="데드리프트" />
          <Picker.Item label="스쿼트" value="스쿼트" />
          <Picker.Item label="런지" value="런지" />
          <Picker.Item label="레그컬" value="레그컬" />
          <Picker.Item label="카프레이즈" value="카프레이즈" />
          <Picker.Item label="핵스쿼트" value="핵스쿼트" />
          <Picker.Item label="시티드로우" value="시티드로우" />
          <Picker.Item label="티바로우" value="티바로우" />
          <Picker.Item label="덤벨프레스" value="덤벨프레스" />
          <Picker.Item label="케이블로우" value="케이블로우" />
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>날짜</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
        </Pressable>
      </View>
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            inline
            className="custom-datepicker"
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>운동 시간(개수)</Text>
        <TextInput
          style={styles.input}
          placeholder="운동 시간 입력"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />
      </View>
      <Pressable style={styles.saveButton} onPress={handleSaveExercise}>
        <Text style={styles.saveButtonText}>저장</Text>
      </Pressable>
      <FlatList
        data={exerciseRecords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>{item.date} - {item.exercise} - {item.duration}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  record: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 5,
  },
  datePickerContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    zIndex: 2,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Exercise;
