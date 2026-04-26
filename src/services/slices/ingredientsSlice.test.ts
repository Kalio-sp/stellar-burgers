import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice', () => {
  const ingredients: TIngredient[] = [
    {
      _id: '1',
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
    }
  ];

  it('should handle pending', () => {
    const state = reducer(undefined, fetchIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fulfilled', () => {
    const state = reducer(
      undefined,
      fetchIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.error).toBeNull();
  });

  it('should handle rejected', () => {
    const state = reducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка'), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
