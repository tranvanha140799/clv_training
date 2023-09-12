import { notification } from 'antd';
import { IconType, NotificationPlacement } from 'antd/es/notification/interface';

type Notification = {
  type: IconType;
  message: string;
  description?: string;
  placement?: NotificationPlacement;
  duration?: number;
};

export const customNotification = (notificationProps: Notification) => {
  notification.open({
    ...notificationProps,
    message:
      notificationProps.message === 'Forbidden'
        ? 'You do not have permission with this action/site!'
        : notificationProps.message,
    placement: notificationProps.placement || 'bottomLeft',
    duration: notificationProps.duration || 3,
  });

  notification.config({
    maxCount:
      notificationProps.message === 'Token expired! Please login again.' ? 1 : 3,
  });
};
