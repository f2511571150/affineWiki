import { ShadowlessElement } from '@blocksuite/affine/block-std';
import { SignalWatcher, WithDisposable } from '@blocksuite/affine/global/lit';
import { CloseIcon, PlusIcon } from '@blocksuite/icons/lit';
import { css, html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import type { ChipState } from '../chat-context';

export class ChatPanelChip extends SignalWatcher(
  WithDisposable(ShadowlessElement)
) {
  static override styles = css`
    .chip-card {
      display: flex;
      height: 24px;
      align-items: center;
      justify-content: center;
      margin: 4px;
      padding: 0 4px;
      border-radius: 4px;
      border: 0.5px solid var(--affine-border-color);
      background: var(--affine-background-primary-color);
      box-sizing: border-box;
    }
    .chip-card[data-state='candidate'] {
      border-width: 1px;
      border-style: dashed;
      background: var(--affine-tag-white);
      color: var(--affine-icon-secondary);
    }
    .chip-card[data-state='candidate'] svg {
      color: var(--affine-icon-secondary);
    }
    .chip-card[data-state='failed'] {
      color: var(--affine-error-color);
      background: var(--affine-background-error-color);
    }
    .chip-card-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chip-card[data-state='failed'] svg {
      color: var(--affine-error-color);
    }
    .chip-card svg {
      width: 16px;
      height: 16px;
      color: var(--affine-v2-icon-primary);
    }
    .chip-card-title {
      display: inline-block;
      margin: 0 4px;
      font-size: 12px;
      min-width: 16px;
      max-width: 124px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chip-card[data-state='candidate'] .chip-card-title {
      cursor: pointer;
    }
    .chip-card-close {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 4px;
    }
    .chip-card-close:hover {
      background: var(--affine-hover-color);
    }
  `;

  @property({ attribute: false })
  accessor state!: ChipState;

  @property({ attribute: false })
  accessor name!: string;

  @property({ attribute: false })
  accessor tooltip!: string;

  @property({ attribute: false })
  accessor icon!: TemplateResult<1>;

  @property({ attribute: false })
  accessor closeable: boolean = false;

  @property({ attribute: false })
  accessor onChipDelete: () => void = () => {};

  @property({ attribute: false })
  accessor onChipClick: () => void = () => {};

  override render() {
    const isCandidate = this.state === 'candidate';
    return html`
      <div
        class="chip-card"
        data-testid="chat-panel-chip"
        data-state=${this.state}
      >
        <div class="chip-card-content">
          ${this.icon}
          <span class="chip-card-title" @click=${this.onChipClick}>
            <span data-testid="chat-panel-chip-title">${this.name}</span>
          </span>
          <affine-tooltip>${this.tooltip}</affine-tooltip>
        </div>
        ${isCandidate
          ? html`${PlusIcon()}`
          : this.closeable
            ? html`
                <div class="chip-card-close" @click=${this.onChipDelete}>
                  ${CloseIcon()}
                </div>
              `
            : ''}
      </div>
    `;
  }
}
