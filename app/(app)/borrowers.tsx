import { BorrowerCard } from '@/components/Modals/BorrowerCard';
import { DeleteBorrowerModal } from '@/components/Modals/DeleteBorrowerModal';
import Colors from '@/design/Colors';
import { useDeleteBorrower } from '@/hooks/DELETE/useDeleteBorrower';
import { useGetBorrowers } from '@/hooks/GET/useGetBorrowers';
import { TBorrower } from '@/lib/types/pocketbase';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Page() {
  const { data: borrowers, isLoading: borrowersLoading } = useGetBorrowers();
  const {
    mutate: deleteBorrower,
    isPending: deletingBorrower,
    isSuccess: deleteSuccess,
  } = useDeleteBorrower();

  const [selectedBorrowerToDelete, setSelectedBorrowerToDelete] = useState<
    string | null
  >();

  const handleDeleteBorrower = () => {
    deleteBorrower(selectedBorrowerToDelete ?? '');
  };

  useEffect(() => {
    if (deleteSuccess) setSelectedBorrowerToDelete(null);
  }, [deleteSuccess]);

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
            handleDelete={() => setSelectedBorrowerToDelete(item.id)}
            borrowerId={item.id}
            name={item.name}
            email={item.email}
            phone={item.phone_number}
          />
        )}
      />
      <DeleteBorrowerModal
        isLoading={deletingBorrower}
        isOpen={Boolean(selectedBorrowerToDelete)}
        onDeleteBorrower={handleDeleteBorrower}
        onDismiss={() => setSelectedBorrowerToDelete(null)}
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
