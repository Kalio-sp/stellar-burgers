import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';
import { TIngredient } from '../../utils/types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const order = useSelector((state) => state.feed.selectedOrder);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isLoading = useSelector((state) => state.feed.isLoading);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!order) return null;

    const ingredientsInfo: { [key: string]: TIngredient & { count: number } } =
      {};

    order.ingredients.forEach((id) => {
      const ingredient = ingredients.find((item) => item._id === id);

      if (!ingredient) return;

      if (!ingredientsInfo[id]) {
        ingredientsInfo[id] = {
          ...ingredient,
          count: 1
        };
      } else {
        ingredientsInfo[id].count += 1;
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
