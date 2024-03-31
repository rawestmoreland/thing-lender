import { BorrowerCard } from '@/components/Modals/BorrowerCard';
import { useAuth } from '@/context/auth';
import Colors from '@/design/Colors';
import { useGetBorrowers } from '@/hooks/GET/useGetBorrowers';
import { TBorrower } from '@/lib/types/pocketbase';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function Page() {
  const { user } = useAuth();
  const { data: borrowers, isLoading: borrowersLoading } = useGetBorrowers();

  if (borrowersLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listStyle}
        data={borrowers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: TBorrower }) => (
          <BorrowerCard
            borrowerId={item.id}
            name={item.name}
            email={item.email}
            phone={item.phone_number}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.cream,
  },
  listStyle: {
    width: '100%',
  },
});
