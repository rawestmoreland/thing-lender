import { useState } from 'react';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import formatTime from '@/lib/utils/formatTime';

export default function DatePicker({
  initialDate,
  date,
  setDate,
}: {
  initialDate: Date;
  date: Date;
  setDate: (date: Date) => void;
}) {
  initialDate.setHours(12, 0, 0, 0);

  const [show, setShow] = useState(false);

  const handleChange = async (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    if (Platform.OS === 'ios') {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <View>
      {Platform.OS === 'ios' && (
        <Button mode='contained' onPress={() => setShow(!show)}>
          {`Due: ${date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`}
        </Button>
      )}
      {Platform.OS === 'android' && (
        <View style={styles.row}>
          <Text variant='bodyLarge'>Due on: </Text>
          <Button onPress={() => setShow(true)}>
            {formatTime(date.getHours(), date.getMinutes())}
          </Button>
        </View>
      )}
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          is24Hour={false}
          display='spinner'
          textColor='black'
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  picker: {
    backgroundColor: 'gray',
    marginLeft: 8,
  },
});
