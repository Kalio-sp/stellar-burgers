import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        feedOrders: [],
        profileOrders: [],
        selectedOrder: null,
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      }
    });
  });
});
