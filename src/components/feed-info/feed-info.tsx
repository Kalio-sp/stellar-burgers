import { FC } from 'react';
import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';

export const FeedInfo: FC = () => {
  const orders = useSelector((state) => state.feed.feedOrders);
  const total = useSelector((state) => state.feed.total);
  const totalToday = useSelector((state) => state.feed.totalToday);

  const readyOrders = orders
    .filter((item) => item.status === 'done')
    .slice(0, 20)
    .map((item) => item.number);

  const pendingOrders = orders
    .filter((item) => item.status === 'pending')
    .slice(0, 20)
    .map((item) => item.number);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
