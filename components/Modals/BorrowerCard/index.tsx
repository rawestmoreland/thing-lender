import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, IconButton, Surface, Text } from 'react-native-paper';

export function BorrowerCard({
  borrowerId,
  name,
  email,
  phone,
}: {
  borrowerId: string;
  name: string;
  email: string;
  phone?: string | undefined;
}) {
  const router = useRouter();

  return (
    <Surface style={styles.surface} elevation={2}>
      <View style={styles.inner}>
        <View style={styles.leftBox}>
          <View style={styles.row}>
            <Icon source='account-outline' size={30} />
            <Text>{name}</Text>
          </View>
          <View style={styles.row}>
            <Icon source='email-outline' size={30} />
            <Text>{email}</Text>
          </View>
          <View style={styles.row}>
            <Icon source='cellphone' size={30} />
            <Text>{phone}</Text>
          </View>
        </View>
        <View style={styles.rightButtons}>
          <IconButton
            mode='contained-tonal'
            iconColor='red'
            icon='trash-can-outline'
          />
          <IconButton
            onPress={() => router.navigate(`/borrower/${borrowerId}`)}
            mode='contained-tonal'
            icon='pencil'
          />
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 8,
    padding: 10,
    margin: 10,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftBox: {
    justifyContent: 'space-between',
  },
  rightButtons: {
    justifyContent: 'space-between',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
});
