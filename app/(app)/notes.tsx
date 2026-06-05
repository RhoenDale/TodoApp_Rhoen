import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  type ListRenderItem,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Note = {
  id: string;
  title: string;
  content: string;
};

const EMPTY_NOTE_CONTENT = '<p></p>';

const htmlToPlainText = (content: string) =>
  content
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const isContentEmpty = (content: string) => htmlToPlainText(content).length === 0;

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState(EMPTY_NOTE_CONTENT);
  const [editorContentSeed, setEditorContentSeed] = useState(EMPTY_NOTE_CONTENT);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: EMPTY_NOTE_CONTENT,
  });
  const editorRef = useRef(editor);

  editorRef.current = editor;

  // Load notes from AsyncStorage on component mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('myNotes');
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes) as Note[];

          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
          }
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setHasLoadedNotes(true);
      }
    };
    loadNotes();
  }, []);

  // Save notes to AsyncStorage whenever the 'notes' state changes
  useEffect(() => {
    if (!hasLoadedNotes) {
      return;
    }

    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('myNotes', JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes:', error);
      }
    };
    saveNotes();
  }, [hasLoadedNotes, notes]);

  useEffect(() => {
    if (Platform.OS !== 'web' && isModalVisible) {
      editorRef.current.setContent(editorContentSeed);
    }
  }, [editorContentSeed, isModalVisible]);

  const getCurrentContent = async () => {
    if (Platform.OS === 'web') {
      return noteContent;
    }

    try {
      return await editor.getHTML();
    } catch (error) {
      console.error('Failed to read note content:', error);
      return noteContent;
    }
  };

  const resetDraft = () => {
    setNoteTitle('');
    setNoteContent(EMPTY_NOTE_CONTENT);
    setEditorContentSeed(EMPTY_NOTE_CONTENT);
    setEditingNoteId(null);
  };

  const closeNoteModal = () => {
    setModalVisible(false);
    resetDraft();
  };

  const handleAddNote = async () => {
    const currentContent = await getCurrentContent();

    if (noteTitle.trim().length === 0 || isContentEmpty(currentContent)) {
      Alert.alert('Error', 'Note title and content cannot be empty.');
      return;
    }

    setNotes((currentNotes) => [
      ...currentNotes,
      {
        id: Date.now().toString(),
        title: noteTitle.trim(),
        content: currentContent.trim(),
      },
    ]);
    closeNoteModal();
  };

  const handleEditNote = async () => {
    if (!editingNoteId) {
      return;
    }

    const currentContent = await getCurrentContent();

    if (noteTitle.trim().length === 0 || isContentEmpty(currentContent)) {
      Alert.alert('Error', 'Note title and content cannot be empty.');
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === editingNoteId
          ? { ...note, title: noteTitle.trim(), content: currentContent.trim() }
          : note
      )
    );
    closeNoteModal();
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id)),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const openNoteModal = (note?: Note) => {
    const content = note?.content || EMPTY_NOTE_CONTENT;

    if (note) {
      setEditingNoteId(note.id);
      setNoteTitle(note.title);
      setNoteContent(content);
    } else {
      setEditingNoteId(null);
      setNoteTitle('');
      setNoteContent(EMPTY_NOTE_CONTENT);
    }

    setEditorContentSeed(content);
    setModalVisible(true);
  };

  const renderNote: ListRenderItem<Note> = ({ item }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteContentContainer}>
        <Text style={styles.noteTitleText}>{item.title}</Text>
        <Text style={styles.noteContentPreview} numberOfLines={2}>{htmlToPlainText(item.content)}</Text>
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => openNoteModal(item)} style={styles.noteActionButton}>
          <Ionicons name="create-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.noteActionButton}>
          <Ionicons name="trash-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Notes</Text>

      {notes.length === 0 ? (
        <Text style={styles.noNotesText}>No notes yet. Add one!</Text>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.noteList}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => openNoteModal()}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeNoteModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{editingNoteId ? 'Edit Note' : 'Add New Note'}</Text>

              <TextInput
                style={styles.input}
                placeholder="Note Title"
                value={noteTitle}
                onChangeText={setNoteTitle}
              />

              {Platform.OS === 'web' ? (
                <TextInput
                  style={[styles.input, styles.richTextEditor]}
                  placeholder="Note Content"
                  multiline
                  value={htmlToPlainText(noteContent)}
                  onChangeText={(text) => setNoteContent(text)}
                />
              ) : (
                <>
                  <View style={styles.toolbar}>
                    <Toolbar editor={editor} />
                  </View>
                  <RichText
                    editor={editor}
                    style={styles.richTextEditor}
                  />
                </>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeNoteModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={editingNoteId ? handleEditNote : handleAddNote}
                >
                  <Text style={styles.buttonText}>{editingNoteId ? 'Save Changes' : 'Add Note'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  noNotesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  noteList: {
    paddingHorizontal: 15,
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noteContentContainer: {
    flex: 1,
    marginRight: 10,
  },
  noteTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  noteContentPreview: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  noteActions: {
    flexDirection: 'row',
  },
  noteActionButton: {
    marginLeft: 10,
    padding: 5,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#6200EE',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalKeyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '90%',
    height: '80%', // Give more space to the editor
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  toolbar: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  richTextEditor: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#6200EE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
