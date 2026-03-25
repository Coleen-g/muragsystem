import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  SafeAreaView, Animated,
} from 'react-native';
import { Send, Bot, User, AlertCircle, ArrowLeft } from 'lucide-react-native';
import apiClient from '../api/client';
import useThemeStore from '../store/themeStore';
import { useColors } from '../theme/colors';

const SUGGESTIONS = [
  'How do I register a case?',
  'What does my case status mean?',
  'What is the PEP vaccine schedule?',
  'What should I do after an animal bite?',
  'How do I check my vaccination schedule?',
];

/* ─── Message bubble ─── */
const MessageBubble = ({ item, colors }) => {
  const isUser = item.role === 'user';
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.bubbleRow,
      isUser ? styles.bubbleRowUser : styles.bubbleRowBot,
      { opacity: fadeAnim },
    ]}>
      {!isUser && (
        <View style={styles.avatarBot}>
          <Bot color="#fff" size={14} />
        </View>
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : [styles.bubbleBot, { backgroundColor: colors.card, borderColor: colors.border }],
      ]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : { color: colors.text }]}>
          {item.text}
        </Text>
        <Text style={[styles.bubbleTime, isUser ? styles.bubbleTimeUser : { color: colors.subText }]}>
          {item.time}
        </Text>
      </View>
      {isUser && (
        <View style={styles.avatarUser}>
          <User color="#fff" size={14} />
        </View>
      )}
    </Animated.View>
  );
};

/* ─── Typing indicator ─── */
const TypingIndicator = ({ colors }) => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot, delay) => Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={[styles.bubbleRow, styles.bubbleRowBot]}>
      <View style={styles.avatarBot}>
        <Bot color="#fff" size={14} />
      </View>
      <View style={[styles.bubbleBot, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.typingRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View key={i} style={[styles.typingDot, { opacity: dot, backgroundColor: colors.subText }]} />
          ))}
        </View>
      </View>
    </View>
  );
};

/* ─── Main Screen ─── */
export default function ChatScreen({ navigation }) {
  const { dark } = useThemeStore();
  const colors   = useColors(dark);

  function formatTime(date) {
    return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  const [messages, setMessages] = useState([
    {
      id:   '0',
      role: 'bot',
      text: 'Hello! This is iRabiesCare 👋 We can help you with:\n\n• Rabies health questions (symptoms, wound care, vaccines)\n• How to use the iRabiesCare app (register a case, check status, view schedule)\n\nHow can I help you today?',
      time: formatTime(new Date()),
    },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const flatListRef           = useRef(null);

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    setError(null);

    const userMessage = {
      id:   Date.now().toString(),
      role: 'user',
      text: messageText,
      time: formatTime(new Date()),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== '0')
        .map(m => ({ role: m.role, text: m.text }));

      const res = await apiClient.post('/chat', { message: messageText, history });

      setMessages(prev => [...prev, {
        id:   (Date.now() + 1).toString(),
        role: 'bot',
        text: res.data.reply,
        time: formatTime(new Date()),
      }]);
    } catch (err) {
      setError('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, loading]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.header }]}>
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.bg }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.header }]}>
          {navigation && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft color="#fff" size={20} />
            </TouchableOpacity>
          )}
          <View style={styles.headerAvatar}>
            <Bot color="#1565C0" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>iRabiesCare</Text>
            <Text style={styles.headerSub}>Health Assistant · Always available</Text>
          </View>
          <View style={styles.headerOnline} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble item={item} colors={colors} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? <TypingIndicator colors={colors} /> : null}
          keyboardShouldPersistTaps="handled"
        />

        {/* Error */}
        {error && (
          <View style={styles.errorBar}>
            <AlertCircle color="#ef4444" size={14} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <View style={styles.suggestions}>
            <Text style={[styles.suggestionsLabel, { color: colors.subText }]}>Suggested questions:</Text>
            <View style={styles.suggestionsRow}>
              {SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => sendMessage(s)}
                >
                  <Text style={[styles.suggestionText, { color: colors.accent || '#1565C0' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
            placeholder="Ask about rabies, vaccines, or the app..."
            placeholderTextColor={colors.subText}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Send color="#fff" size={18} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1 },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 2,
  },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  headerSub:   { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  headerOnline: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#4ade80', marginLeft: 'auto',
  },

  /* Messages */
  messageList: { padding: 16, paddingBottom: 8 },

  bubbleRow:     { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubbleRowBot:  { justifyContent: 'flex-start' },

  avatarBot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1565C0',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  avatarUser: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#64748b',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },

  bubble:     { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleUser: { backgroundColor: '#1565C0', borderBottomRightRadius: 4 },
  bubbleBot:  { borderBottomLeftRadius: 4, borderWidth: 1, elevation: 2 },

  bubbleText:     { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTime:     { fontSize: 10, marginTop: 4 },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },

  /* Typing */
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 4 },
  typingDot: { width: 7, height: 7, borderRadius: 4 },

  /* Error */
  errorBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fef2f2', borderTopWidth: 1, borderTopColor: '#fee2e2',
    paddingHorizontal: 16, paddingVertical: 8,
  },
  errorText: { fontSize: 12, color: '#ef4444', flex: 1 },

  /* Suggestions */
  suggestions:      { paddingHorizontal: 16, paddingBottom: 8 },
  suggestionsLabel: { fontSize: 11, marginBottom: 8, fontWeight: '600' },
  suggestionsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1,
  },
  suggestionText: { fontSize: 12, fontWeight: '500' },

  /* Input */
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 100,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 22, borderWidth: 1.5,
    fontSize: 14,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1565C0',
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#94a3b8' },
});