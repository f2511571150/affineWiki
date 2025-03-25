import { LoadingIcon } from '@blocksuite/affine/blocks/image';
import { WarningIcon } from '@blocksuite/icons/lit';
import { type TemplateResult } from 'lit';

import type {
  ChatChip,
  ChipState,
  CollectionChip,
  DocChip,
  FileChip,
  TagChip,
} from '../chat-context';

export function getChipTooltip(
  state: ChipState,
  name: string,
  tooltip?: string | null
) {
  if (tooltip) {
    return tooltip;
  }
  if (state === 'candidate') {
    return 'Click to add doc';
  }
  if (state === 'processing') {
    return 'Processing...';
  }
  if (state === 'failed') {
    return 'Failed to add to context';
  }
  return name;
}

export function getChipIcon(
  state: ChipState,
  icon: TemplateResult<1>
): TemplateResult<1> {
  const isLoading = state === 'processing';
  const isFailed = state === 'failed';
  if (isFailed) {
    return WarningIcon();
  }
  if (isLoading) {
    return LoadingIcon;
  }
  return icon;
}

export function isDocChip(chip: ChatChip): chip is DocChip {
  return 'docId' in chip;
}

export function isFileChip(chip: ChatChip): chip is FileChip {
  return 'file' in chip && chip.file instanceof File;
}

export function isTagChip(chip: ChatChip): chip is TagChip {
  return 'tagId' in chip;
}

export function isCollectionChip(chip: ChatChip): chip is CollectionChip {
  return 'collectionId' in chip;
}

export function getChipKey(chip: ChatChip) {
  if (isDocChip(chip)) {
    return chip.docId;
  }
  if (isFileChip(chip)) {
    return chip.file.name;
  }
  if (isTagChip(chip)) {
    return chip.tagId;
  }
  if (isCollectionChip(chip)) {
    return chip.collectionId;
  }
  return null;
}

export function estimateTokenCount(text: string): number {
  const chinese = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const english = text.replace(/[\u4e00-\u9fa5]/g, '');
  // Split English text into words by whitespace
  const englishWords = english.trim().split(/\s+/).length;

  // Chinese characters: 1 character ≈ 2.5 tokens
  // English words: 1 word ≈ 1.3 tokens
  return Math.ceil(chinese * 2.5 + englishWords * 1.3);
}
