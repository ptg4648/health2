import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TextInput, ScrollView, Modal, Button } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Food = () => {
  const [date, setDate] = useState(new Date());
  const [breakfast, setBreakfast] = useState('');
  const [breakfastCalories, setBreakfastCalories] = useState('');
  const [lunch, setLunch] = useState('');
  const [lunchCalories, setLunchCalories] = useState('');
  const [dinner, setDinner] = useState('');
  const [dinnerCalories, setDinnerCalories] = useState('');
  const [foodRecords, setFoodRecords] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchFoodRecords = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'foods'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map(doc => doc.data());
        setFoodRecords(records);
      }
    };

    fetchFoodRecords();
  }, []);

  const handleSaveFood = async () => {
    const user = auth.currentUser;
    const totalCalories = parseInt(breakfastCalories, 10) + parseInt(lunchCalories, 10) + parseInt(dinnerCalories, 10);
    if (user) {
      try {
        await addDoc(collection(db, 'foods'), {
          userId: user.uid,
          date: date.toISOString().split('T')[0],
          breakfast,
          breakfastCalories: parseInt(breakfastCalories, 10),
          lunch,
          lunchCalories: parseInt(lunchCalories, 10),
          dinner,
          dinnerCalories: parseInt(dinnerCalories, 10),
          totalCalories
        });
        Alert.alert('식단 기록 저장', '식단 기록이 성공적으로 저장되었습니다.');
        setFoodRecords(prev => [...prev, { date: date.toISOString().split('T')[0], breakfast, breakfastCalories: parseInt(breakfastCalories, 10), lunch, lunchCalories: parseInt(lunchCalories, 10), dinner, dinnerCalories: parseInt(dinnerCalories, 10), totalCalories }]);
        setBreakfast('');
        setBreakfastCalories('');
        setLunch('');
        setLunchCalories('');
        setDinner('');
        setDinnerCalories('');
      } catch (error) {
        console.error('Error saving food: ', error);
        Alert.alert('식단 기록 오류', '식단 기록 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
    setShowDatePicker(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>식단 기록 하기</Text>
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
        <Text style={styles.label}>아침</Text>
        <TextInput
          style={styles.input}
          placeholder="음식 입력"
          value={breakfast}
          onChangeText={setBreakfast}
        />
        <TextInput
          style={styles.input}
          placeholder="칼로리 입력"
          keyboardType="numeric"
          value={breakfastCalories}
          onChangeText={setBreakfastCalories}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>점심</Text>
        <TextInput
          style={styles.input}
          placeholder="음식 입력"
          value={lunch}
          onChangeText={setLunch}
        />
        <TextInput
          style={styles.input}
          placeholder="칼로리 입력"
          keyboardType="numeric"
          value={lunchCalories}
          onChangeText={setLunchCalories}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>저녁</Text>
        <TextInput
          style={styles.input}
          placeholder="음식 입력"
          value={dinner}
          onChangeText={setDinner}
        />
        <TextInput
          style={styles.input}
          placeholder="칼로리 입력"
          keyboardType="numeric"
          value={dinnerCalories}
          onChangeText={setDinnerCalories}
        />
      </View>
      <Pressable style={styles.saveButton} onPress={handleSaveFood}>
        <Text style={styles.saveButtonText}>저장</Text>
      </Pressable>
      <Pressable style={styles.modalButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.modalButtonText}>목록 보기</Text>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>식단 기록 목록</Text>
          <ScrollView>
            {foodRecords.map((item, index) => (
              <View key={index} style={styles.record}>
                <Text>{item.date} - 총 칼로리: {item.totalCalories} 칼로리</Text>
                {item.totalCalories >= 1800 && <Text style={styles.warning}>권장 칼로리를 초과했습니다</Text>}
                <Text>아침: {item.breakfast} - {item.breakfastCalories} 칼로리</Text>
                <Text>점심: {item.lunch} - {item.lunchCalories} 칼로리</Text>
                <Text>저녁: {item.dinner} - {item.dinnerCalories} 칼로리</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="닫기" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 10,
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
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  record: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 5,
  },
  warning: {
    color: "red",
    marginTop: 5,
  },
  dateText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default Food;
