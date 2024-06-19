import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

const Home = (props) => {
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || '사용자');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.viewStyle}>
      <View style={styles.header}>
        <Image source={require('../assets/Ellipse 1.png')} style={styles.profileImage} />
        <View>
          <Text style={styles.texthong}>{userName}</Text>
          <Pressable onPress={() => props.navigation.navigate('Profile')}>
            <Text style={styles.checkyourhealth}>프로필 수정</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.lineStyle}></View>

      <View style={styles.section}>
        <Image source={require('../assets/exercise.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.textfacerec}>운동관리</Text>
          <Text style={styles.aifaceRecognitionStyle}>운동 스케쥴을 관리하면서 편하게 운동하세요!</Text>
        </View>
        <Pressable 
          style={styles.movePageButtonStyle} 
          onPress={() => {
            props.navigation.navigate('Exercise');
          }}
        >
          <Text style={styles.buttonText}>이동</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Image source={require('../assets/food.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.voiceRecognitionStyle}>식단관리</Text>
          <Text style={styles.aiVoiceRecognitionStyle}>미리 식단을 짜놓으면서 건강관리를 해보세요!</Text>
        </View>
        <Pressable 
          style={styles.movePageButtonStyle} 
          onPress={() => {
            props.navigation.navigate('Voice');
          }}
        >
          <Text style={styles.buttonText}>이동</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Image source={require('../assets/chat.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.chatbotStyle}>챗봇</Text>
          <Text style={styles.chatbotDescriptionStyle}>챗봇과 대화를 통해 질병진단과 약 추천, 병원 정보까지 받아보세요!</Text>
        </View>
        <Pressable 
          style={styles.movePageButtonStyle} 
          onPress={() => {
            props.navigation.navigate('Chatbot');
          }}
        >
          <Text style={styles.buttonText}>이동</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  texthong: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#000000',
  },
  checkyourhealth: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: '#2E55BA',
  },
  lineStyle: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.29)',
    marginVertical: 20,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  textfacerec: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#000000',
    marginBottom: 5,
  },
  aifaceRecognitionStyle: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  voiceRecognitionStyle: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#000000',
    marginBottom: 5,
  },
  aiVoiceRecognitionStyle: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  chatbotStyle: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#000000',
    marginBottom: 5,
  },
  chatbotDescriptionStyle: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  movePageButtonStyle: {
    backgroundColor: '#5d5fef',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default Home;
