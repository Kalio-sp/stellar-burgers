import { FC, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const user = useSelector((state) => state.user.user);

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = async () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setOrderRequest(true);

      const ingredientIds = [
        bun._id,
        ...ingredients.map((item) => item._id),
        bun._id
      ];

      const data = await orderBurgerApi(ingredientIds);

      setOrderModalData({
        _id: data.order._id,
        status: data.order.status,
        name: data.order.name,
        createdAt: data.order.createdAt,
        updatedAt: data.order.updatedAt,
        number: data.order.number,
        ingredients: ingredientIds
      });

      dispatch(clearConstructor());
    } catch (error) {
      console.error(error);
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
