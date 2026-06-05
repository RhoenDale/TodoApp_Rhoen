import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  type ListRenderItem,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Task = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (taskTitle.trim().length === 0) {
      Alert.alert('Error', 'Task title cannot be empty.');
      return;
    }
    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now().toString(), title: taskTitle.trim(), date: taskDate.toDateString(), completed: false },
    ]);
    setTaskTitle('');
    setTaskDate(new Date());
    setModalVisible(false);
  };

  const handleUpdateTask = () => {
    if (!currentTask) {
      return;
    }

    if (taskTitle.trim().length === 0) {
      Alert.alert('Error', 'Task title cannot be empty.');
      return;
    }
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === currentTask.id ? { ...task, title: taskTitle.trim(), date: taskDate.toDateString() } : task
      )
    );
    setTaskTitle('');
    setTaskDate(new Date());
    setModalVisible(false);
    setIsEditing(false);
    setCurrentTask(null);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((currentTasks) => currentTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => setTasks((currentTasks) => currentTasks.filter(task => task.id !== id)),
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const onChangeDate = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || taskDate;
    setShowDatePicker(Platform.OS === 'ios');
    setTaskDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const openEditModal = (task: Task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDate(new Date(task.date));
    setModalVisible(true);
  };

  const renderTask: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => handleToggleComplete(item.id)} style={styles.checkbox}>
        <Ionicons
          name={item.completed ? 'checkbox-outline' : 'square-outline'}
          size={24}
          color={item.completed ? '#4CAF50' : '#888'}
        />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.completedTaskTitle]}>
          {item.title}
        </Text>
        <Text style={styles.taskDate}>{item.date}</Text>
      </View>
      <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
        <Ionicons name="create-outline" size={24} color="#007BFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Tasks</Text>

      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No tasks yet. Add one!</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setIsEditing(false);
          setTaskTitle('');
          setTaskDate(new Date());
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Task' : 'Add New Task'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
              <Text style={styles.datePickerButtonText}>{taskDate.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={taskDate}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={isEditing ? handleUpdateTask : handleAddTask}
              >
                <Text style={styles.buttonText}>{isEditing ? 'Update Task' : 'Add Task'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  noTasksText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  taskList: {
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButton: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '90%',
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
  datePickerButton: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'flex-start',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  addButton: {
    backgroundColor: '#6200EE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
