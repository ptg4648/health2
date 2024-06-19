import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Chatbot = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { initialMessage } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState(initialMessage || '');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0); // 0 for symptom analysis, 1 for hospital recommendation
  const [userSymptom, setUserSymptom] = useState('');
  const [predictedDisease, setPredictedDisease] = useState('');

  const apiKey = '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';
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

  useEffect(() => {
    addMessage('bot', '무엇을 도와드릴까요? (예: 두통, 발열, 복통)');
  }, []);

  const addMessage = (sender, message) => {
    setMessages(prevMessages => [...prevMessages, { sender, message }]);
  };

  const handleSendMessage = async () => {
    const message = userInput.trim();
    if (message.length === 0) return;

    addMessage('user', message);
    setUserInput('');

    if (stage === 0) {
      if (message.includes('병원추천')) {
        setStage(1);
        addMessage('bot', '어느 지역에 계신가요?');
      } else {
        setUserSymptom(message);
        addMessage('bot', '잠시만 기다려주세요. 증상을 분석 중입니다.');
        setLoading(true);
        await handlePredictDisease(message);
      }
    } else if (stage === 1) {
      addMessage('bot', '잠시만 기다려주세요. 병원을 추천해드리겠습니다.');
      setLoading(true);
      await handleRecommendHospital(message);
    }
  };

  const handlePredictDisease = async (symptom) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: "system", content: "당신은 세계 최고의 의사입니다. 당신은 환자의 증상을 매우 명확하게 진단하고 적절한 조언을 줄 수 있습니다. 당신의 이름은 챗닥터입니다. 당신은 사람의 건강과 관련된 모든 질문에 대해서 명확히 답변해 줄 수 있습니다." },
            { role: "user", content: `저의 증상은 다음과 같습니다: ${symptom}.` },
          ],
          max_tokens: 1024,
          top_p: 1,
          temperature: 0.5,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '증상을 확인할 수 없습니다. 다시 시도해주세요.';
      setPredictedDisease(aiResponse);
      addMessage('bot', `당신의 증상은 ${aiResponse}일 가능성이 높습니다. 추가적인 증상이나 질문이 있나요? 병원을 추천받고 싶으시면 "병원추천"을 입력해주세요.`);
    } catch (error) {
      console.error('오류 발생!', error);
      addMessage('bot', '증상을 예측하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendHospital = async (location) => {
    try {
      const messages = [
        { role: "system", content: "당신은 세계 최고의 의사입니다. 당신은 환자의 증상을 매우 명확하게 진단하고 적절한 조언을 줄 수 있습니다. 당신의 이름은 챗닥터입니다. 당신은 사람의 건강과 관련된 모든 질문에 대해서 명확히 답변해 줄 수 있습니다." },
        { role: "user", content: `저의 증상은 다음과 같습니다: ${userSymptom}.` },
        { role: "assistant", content: `당신의 증상은 ${predictedDisease}일 가능성이 높습니다.` },
        { role: "user", content: `질병: ${predictedDisease}, 지역: ${location}. 이 조건에 맞는 병원을 추천해줘.` },
      ];

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 1024,
          top_p: 1,
          temperature: 0.5,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || '추천할 병원을 찾지 못했습니다. 다시 시도해주세요.';
      const formattedResponse = formatResponse(aiResponse);
      addMessage('bot', formattedResponse);
    } catch (error) {
      console.error('오류 발생!', error);
      addMessage('bot', '병원을 추천하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      resetChat();
    }
  };

  const resetChat = () => {
    setLoading(false);
    setStage(0);
    setUserSymptom('');
    setUserLocation('');
    setPredictedDisease('');
    addMessage('bot', '다른 증상에 대해 병원을 추천받고 싶으신가요? 증상을 입력해주세요.');
  };

  const formatResponse = (response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      const hospitalMatch = line.match(/(\d+\. )(.*?병원)/);
      if (hospitalMatch) {
        const hospitalName = hospitalMatch[2].trim();
        return (
          <Text key={index} style={styles.botMessageText}>
            {line.replace(hospitalName, '')}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Map', { hospitalName })}
            >
              {hospitalName}
            </Text>
          </Text>
        );
      }
      return <Text key={index} style={styles.botMessageText}>{line}</Text>;
    });
  };

  const renderItem = ({ item }) => (
    <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
      {Array.isArray(item.message) ? item.message : <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>{item.message}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>병원추천 AI</Text>
      <FlatList
        style={styles.chat}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요 (예: 두통, 발열, 복통)"
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Image source={require('../assets/quill_send.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  chat: {
    flex: 1,
    marginBottom: 10,
  },
  chatContainer: {
    paddingBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    marginRight: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    marginLeft: 10,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  loading: {
    marginBottom: 10,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default Chatbot;
