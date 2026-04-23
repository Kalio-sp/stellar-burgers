import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import {
  clearOrderModalData,
  createOrder
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const user = useSelector((state) => state.user.user);

  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

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

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const resultAction = await dispatch(createOrder(ingredientIds));

    if (createOrder.fulfilled.match(resultAction)) {
      dispatch(clearConstructor());
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
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
