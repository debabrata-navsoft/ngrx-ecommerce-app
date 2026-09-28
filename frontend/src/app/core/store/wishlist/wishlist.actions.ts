import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Product } from '../../../shared/models/product.model';

export const WishlistActions = createActionGroup({
  source: 'Wishlist',
  events: {
    Load: emptyProps(),
    'Load Succeeded': props<{ items: Product[] }>(),
    Reset: emptyProps(),

    Add: props<{ product: Product }>(),
    Remove: props<{ id: string }>(),

    'Sync Succeeded': props<{ items: Product[] }>(),
    'Sync Failed': emptyProps(),
  },
});
