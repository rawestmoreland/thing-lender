import { iconMap } from '@/constants/iconMap';
import { EThingType, TThingType } from '@/lib/types/pocketbase';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Menu, Surface, Text } from 'react-native-paper';

export function LentThingCard({
  borrower_id,
  thing_id,
  isLoading,
  isReminding,
  onReturnedPress,
  onReminderPress,
  borrower,
  thingName,
  dueDate,
  pastDue = false,
  thingType,
}: {
  borrower_id: string;
  thing_id: string;
  isLoading: boolean;
  isReminding: boolean;
  onReturnedPress: () => void;
  onReminderPress: (
    type: 'email' | 'sms',
    borrower_id: string,
    thing_id: string
  ) => void;
  borrower: string;
  thingName: string;
  dueDate: string;
  pastDue?: boolean;
  thingType: TThingType;
}) {
  const [reminderMenuOpen, setReminderMenuOpen] = useState(false);

  const openReminderMenu = () => setReminderMenuOpen(true);
  const closeReminderMenu = () => setReminderMenuOpen(false);

  useEffect(() => {
    if (isReminding) {
      closeReminderMenu();
    }
  }, [isReminding]);

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
          <Menu
            visible={reminderMenuOpen}
            onDismiss={closeReminderMenu}
            anchor={
              <Button
                loading={isReminding}
                disabled={isReminding}
                mode='contained'
                icon='bell-outline'
                onPress={openReminderMenu}
              >
                Remind
              </Button>
            }
            anchorPosition='bottom'
          >
            <Menu.Item
              leadingIcon='email-fast-outline'
              title='Email'
              onPress={() => onReminderPress('email', borrower_id, thing_id)}
            />
            <Menu.Item
              leadingIcon='message-text-outline'
              title='SMS'
              onPress={() => onReminderPress('sms', borrower_id, thing_id)}
            />
          </Menu>
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
