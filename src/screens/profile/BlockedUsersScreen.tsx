import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  blockedDate: string;
}

const BlockedUsersScreen = ({ navigation }: any) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: '1',
      name: 'John Doe',
      username: '@johndoe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      blockedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: '@janesmith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      blockedDate: '2024-02-20',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      username: '@mikej',
      blockedDate: '2024-03-10',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: () => unblockUser(user.id),
        },
      ]
    );
  };

  const unblockUser = async (userId: string) => {
    setUnblockingId(userId);
    
    // TODO: Replace with your actual API call
    // await api.unblockUser(userId);
    
    setTimeout(() => {
      setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
      setUnblockingId(null);
    }, 500);
  };

  const renderBlockedUser = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color="#999" />
          </View>
        )}
        
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.blockedDate}>
            Blocked on {new Date(item.blockedDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item)}
        disabled={unblockingId === item.id}
      >
        {unblockingId === item.id ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.unblockButtonText}>Unblock</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No Blocked Users</Text>
      <Text style={styles.emptyText}>
        You haven't blocked anyone yet. Blocked users will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={blockedUsers}
        renderItem={renderBlockedUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          blockedUsers.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  blockedDate: {
    fontSize: 12,
    color: '#999',
  },
  unblockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  unblockButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BlockedUsersScreen;