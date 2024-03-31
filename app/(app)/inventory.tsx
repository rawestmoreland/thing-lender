import { ThingCard } from '@/components/ThingCard';
import { useGetInventory } from '@/hooks/GET/useGetInventory';
import { TThing } from '@/lib/types/pocketbase';
import { RecordModel } from 'pocketbase';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, SectionList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Colors from '@/design/Colors';
import { DeleteThingModal } from '@/components/Modals/DeleteThingModal';
import { useDeleteThing } from '@/hooks/DELETE/useDeleteThing';
import { useGetBorrowers } from '@/hooks/GET/useGetBorrowers';
import { LoanThingModal } from '@/components/Modals/LoanThingModal';
import { useDeleteLentThing } from '@/hooks/DELETE/useDeleteLentThing';

type TSectionListData = {
  title: string;
  data: TThing[];
};

enum ESectionTitles {
  LENT = 'Lent',
  AVAILABLE = 'Available',
}

export default function Inventory() {
  const { data: inventory, isLoading: inventoryLoading } = useGetInventory();
  const { data: borrowers, isLoading: borrowersLoading } = useGetBorrowers();
  const {
    mutate: deleteThing,
    isSuccess,
    isPending: deletingThing,
  } = useDeleteThing();
  const {
    mutate: deleteLentThing,
    isPending: deletingLentThing,
    error: updateError,
  } = useDeleteLentThing();

  const [isDeleteThingModalOpen, setIsDeleteThingModalOpen] = useState(false);
  const [thingIdToDelete, setThingIdToDelete] = useState<string | null>();

  const [thingIdToLoan, setThingIdToLoan] = useState<string | null>();

  const dismissDeleteThingModal = () => setIsDeleteThingModalOpen(false);

  useEffect(() => {
    if (isSuccess) {
      dismissDeleteThingModal();
      setThingIdToDelete(null);
    }
  }, [isSuccess]);

  const normalizedInventory = useMemo(() => {
    if (!inventory) return;
    const data: TSectionListData[] = [];
    inventory?.forEach((item: RecordModel) => {
      const dueDate = item.expand?.lent_things_via_thing_id?.[0].due_date;
      const thing: TThing = {
        id: item.id,
        name: item.name,
        thingType: item.expand?.thing_type,
        isLent: item.expand?.lent_things_via_thing_id?.[0].returned === false,
        lentThing: item.expand?.lent_things_via_thing_id?.[0],
        lentTo: item.expand?.lent_things_via_thing_id?.[0].expand?.borrower_id,
        dueDate: dueDate
          ? new Date(dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : undefined,
      };
      if (thing.isLent) {
        const lentIndex = data.findIndex(
          (s: TSectionListData) => s.title === ESectionTitles.LENT
        );
        if (lentIndex !== -1) {
          data[lentIndex].data.push(thing);
        } else {
          data.push({ title: ESectionTitles.LENT, data: [thing] });
        }
      } else {
        const availableIndex = data.findIndex(
          (s) => s.title === ESectionTitles.AVAILABLE
        );
        if (availableIndex !== -1) {
          data[availableIndex].data.push(thing);
        } else {
          data.push({ title: ESectionTitles.AVAILABLE, data: [thing] });
        }
      }
    });
    return data;
  }, [inventory]);

  if (inventoryLoading || borrowersLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Boolean(normalizedInventory) ? (
        <SectionList
          style={styles.cardStyle}
          sections={normalizedInventory}
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={({ item }: { item: TThing }) => (
            <ThingCard
              thingId={item.id}
              setThingIdToLoan={setThingIdToLoan}
              setDeleteModalOpen={() => setIsDeleteThingModalOpen(true)}
              setThingIdToDelete={setThingIdToDelete}
              borrowerName={item.lentTo?.name}
              thingName={item.name}
              thingType={item.thingType}
              dueDate={item.dueDate}
              isLent={item.isLent}
              lentRelationship={item.lentThing}
              markReturned={deleteLentThing}
              isLoading={deletingLentThing}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.headerText}>{title}</Text>
          )}
        />
      ) : (
        <View style={{ width: '80%', gap: 8 }}>
          <Text
            variant='headlineMedium'
            style={{ fontWeight: '600', textAlign: 'center' }}
          >
            Nothing here 😢
          </Text>
          <Text
            variant='headlineMedium'
            style={{ fontWeight: '600', textAlign: 'center' }}
          >
            Add some items to your inventory
          </Text>
        </View>
      )}
      <DeleteThingModal
        isOpen={isDeleteThingModalOpen}
        onDismiss={dismissDeleteThingModal}
        onDeleteThing={() => deleteThing(thingIdToDelete ?? '')}
        isLoading={deletingThing}
      />
      <LoanThingModal
        thingId={thingIdToLoan ?? ''}
        isOpen={Boolean(thingIdToLoan)}
        onDismiss={() => setThingIdToLoan(null)}
        borrowers={borrowers ?? []}
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
  cardStyle: {
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 10,
    backgroundColor: Colors.brand.cream,
  },
});
