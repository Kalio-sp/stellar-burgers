import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

describe('constructorSlice', () => {
  const bun: TIngredient = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 100,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img'
  };

  const main1: TIngredient = {
    _id: 'main-1',
    name: 'Котлета',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 200,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img'
  };

  const main2: TIngredient = {
    _id: 'main-2',
    name: 'Соус',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 300,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img'
  };

  beforeEach(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: jest
          .fn()
          .mockReturnValueOnce('id-1')
          .mockReturnValueOnce('id-2')
          .mockReturnValueOnce('id-3')
      },
      configurable: true
    });
  });

  it('should add ingredient', () => {
    const state = reducer(undefined, addIngredient(main1));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Котлета');
    expect(state.ingredients[0].id).toBe('id-1');
  });

  it('should add bun separately', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun?.name).toBe('Булка');
    expect(state.ingredients).toHaveLength(0);
  });

  it('should remove ingredient', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, removeIngredient('id-1'));

    expect(state.ingredients).toHaveLength(0);
  });

  it('should move ingredient down', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    state = reducer(state, moveIngredientDown(0));

    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  it('should move ingredient up', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    state = reducer(state, moveIngredientUp(1));

    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });
});
