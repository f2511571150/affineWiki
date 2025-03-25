import { TextSelection } from '@blocksuite/block-std';

import type { GetSelectionCommand } from './types';

export const getTextSelectionCommand: GetSelectionCommand = (ctx, next) => {
  const currentTextSelection = ctx.std.selection.find(TextSelection);
  if (!currentTextSelection) return;

  next({ currentTextSelection });
};
