import { Notification as NotificationUi } from '@usm/ui';
import { useGetNotificationState, useHideNotification } from '@usm-web/ui-module';

export function Notification() {
  const hideNotification = useHideNotification();
  const props = useGetNotificationState();
  return <NotificationUi {...props} onHide={hideNotification} />;
}

export default Notification;
