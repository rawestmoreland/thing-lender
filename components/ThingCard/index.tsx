import { iconMap } from '@/constants/iconMap';
import { EThingType, TLentThing, TThingType } from '@/lib/types/pocketbase';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, IconButton, Surface, Text } from 'react-native-paper';
import { isEmpty } from 'lodash';
import { useRouter } from 'expo-router';

export function ThingCard({
  thingId,
  setThingIdToLoan,
  setThingIdToDelete,
  borrowerName,
  thingName,
  dueDate,
  thingType,
  isLent,
  setDeleteModalOpen,
  markReturned,
  lentRelationship,
  isLoading = false,
}: {
  thingId: string;
  setThingIdToLoan: (id: string) => void;
  setThingIdToDelete: (id: string) => void;
  borrowerName?: string;
  thingName: string;
  dueDate?: string;
  thingType: TThingType;
  isLent?: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  markReturned: (id: string) => void;
  lentRelationship: TLentThing | undefined;
  isLoading: boolean;
}) {
  const router = useRouter();

  return (
    <Surface style={styles.surface} elevation={2}>
      <View style={styles.inner}>
        <View style={{ justifyContent: 'space-between' }}>
          <View style={styles.row}>
            <Icon source={iconMap[EThingType[thingType.name]]} size={30} />
            <Text variant='bodyLarge'>{thingName}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              source={
                borrowerName && isLent
                  ? `account-outline`
                  : `account-off-outline`
              }
              size={30}
            />
            <Text variant='bodyMedium'>
              {borrowerName && isLent
                ? `Lent to ${borrowerName}`
                : `Not on loan`}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              source={
                isLent && dueDate
                  ? `calendar-outline`
                  : `calendar-remove-outline`
              }
              size={30}
            />
            <Text variant='bodyMedium'>{dueDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightButtons}>
        <Button
          loading={isLoading}
          onPress={() => {
            if (isLent && !isEmpty(lentRelationship)) {
              markReturned(lentRelationship.id);
            } else {
              setThingIdToLoan(thingId);
            }
          }}
          compact
          icon={isLent ? `check` : `handshake-outline`}
          mode='contained'
        >
          {isLent ? 'Returned' : 'Lend it'}
        </Button>
        <View style={styles.iconButtonRow}>
          <IconButton
            disabled={isLoading}
            onPress={() => {
              setThingIdToDelete(thingId);
              setDeleteModalOpen(true);
            }}
            iconColor='red'
            icon='trash-can-outline'
            mode='contained'
          />
          <IconButton
            disabled={isLoading}
            onPress={() => router.navigate(`/thing/${thingId}`)}
            icon='pencil'
            mode='contained'
          />
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 8,
    padding: 20,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButtons: {
    justifyContent: 'space-between',
    gap: 8,
  },
  row: {
    gap: 3,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pastDueText: {
    color: 'red',
    fontWeight: 'bold',
  },
  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
