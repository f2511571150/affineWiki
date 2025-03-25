import type { TagMeta } from '@affine/core/components/page-list';
import { ShadowlessElement } from '@blocksuite/affine/block-std';
import { SignalWatcher, WithDisposable } from '@blocksuite/affine/global/lit';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';

import type { TagChip } from '../chat-context';
import { getChipIcon, getChipTooltip } from './utils';

export class ChatPanelTagChip extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = css`
    .tag-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tag-icon {
      border-radius: 50%;
      height: 8px;
      width: 8px;
      margin: 4px;
      background-color: var(--affine-color-secondary);
    }
  `;

  @property({ attribute: false })
  accessor chip!: TagChip;

  @property({ attribute: false })
  accessor removeChip!: (chip: TagChip) => void;

  @property({ attribute: false })
  accessor tag!: TagMeta;

  override render() {
    const { state } = this.chip;
    const { title, color } = this.tag;
    const isLoading = state === 'processing';
    const tooltip = getChipTooltip(state, title, this.chip.tooltip);
    const tagIcon = html`
      <div class="tag-icon-container">
        <div class="tag-icon" style="background-color: ${color};"></div>
      </div>
    `;
    const icon = getChipIcon(state, tagIcon);

    return html`<chat-panel-chip
      .state=${state}
      .name=${title}
      .tooltip=${tooltip}
      .icon=${icon}
      .closeable=${!isLoading}
      .onChipDelete=${this.onChipDelete}
    ></chat-panel-chip>`;
  }

  private readonly onChipDelete = () => {
    this.removeChip(this.chip);
  };
}
