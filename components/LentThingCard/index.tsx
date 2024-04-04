import { sendReminder } from '@/api/sendReminder';
import { iconMap } from '@/constants/iconMap';
import { EThingType, TThingType } from '@/lib/types/pocketbase';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Surface, Text } from 'react-native-paper';

export function LentThingCard({
  isLoading,
  onReturnedPress,
  onReminderPress,
  borrower,
  thingName,
  dueDate,
  pastDue = false,
  thingType,
}: {
  isLoading: boolean;
  onReturnedPress: () => void;
  onReminderPress: () => void;
  borrower: string;
  thingName: string;
  dueDate: string;
  pastDue?: boolean;
  thingType: TThingType;
}) {
  return (
    <Surface style={styles.surface} elevation={2}>
      <View style={styles.inner}>
        <View>
          <View style={styles.row}>
            <Icon source={iconMap[EThingType[thingType.name]]} size={30} />
            <Text variant='bodyLarge'>{thingName}</Text>
          </View>
          <View style={styles.row}>
            <Icon source='account-outline' size={30} />
            <Text variant='bodyMedium'>{borrower}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              source={pastDue ? `calendar-alert` : `calendar-outline`}
              size={30}
            />
            <Text
              variant='bodyMedium'
              style={pastDue ? styles.pastDueText : null}
            >
              {dueDate}
            </Text>
          </View>
        </View>
        <View style={styles.rightButtons}>
          <Button
            loading={isLoading}
            compact
            mode='contained'
            icon='check'
            onPress={onReturnedPress}
          >
            Returned
          </Button>
          <Button
            disabled={isLoading}
            compact
            mode='contained'
            icon='bell-outline'
            onPress={onReminderPress}
          >
            Remind
          </Button>
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
});
