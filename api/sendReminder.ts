import Client from 'pocketbase';
import { EApiPaths } from './paths';

export type TReminderDataEmail = {
  borrower_id: string;
  thing_id: string;
};

export async function sendReminderEmail(
  pb: Client | null,
  data: TReminderDataEmail
): Promise<Record<string, any>> {
  if (!pb) {
    throw new Error('Pocketbase client not initialized');
  }

  try {
    const response = await pb.send(EApiPaths.EMAIL_REMINDER, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error: any) {
    return { success: false, message: error.message ?? 'Unknown error' };
  }
}

export async function sendReminderSms(
  pb: Client | null,
  data: TReminderDataEmail
) {
  if (!pb) {
    throw new Error('Pocketbase client not initialized');
  }

  try {
    const response = await pb.send(EApiPaths.SMS_REMINDER, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error: any) {
    return { success: false, message: error.message ?? 'Unknown error' };
  }
}
