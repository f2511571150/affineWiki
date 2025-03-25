import { AIOnboardingType } from './type';

function createStorageEvent(key: string, newValue: string) {
  const event = new StorageEvent('storage', {
    key,
    newValue,
    oldValue: localStorage.getItem(key),
    storageArea: localStorage,
  });
  window.dispatchEvent(event);
}

const setItem = function (key: string, value: string) {
  const oldValue = localStorage.getItem(key);
  localStorage.setItem(key, value);
  if (oldValue !== value) createStorageEvent(key, value);
};

// Initialize AI onboarding states to dismissed
setItem(AIOnboardingType.GENERAL, 'true');
setItem(AIOnboardingType.LOCAL, 'true');
setItem(AIOnboardingType.EDGELESS, 'true');

/**
 * Show/Hide AI onboarding manually
 */
export const toggleGeneralAIOnboarding = (show = true) => {
  setItem(AIOnboardingType.GENERAL, show ? 'false' : 'true');
};

/**
 * Show/Hide local AI toast manually
 */
export const toggleLocalAIOnboarding = (show = true) => {
  setItem(AIOnboardingType.LOCAL, show ? 'false' : 'true');
};

/**
 * Show/Hide edgeless AI toast manually
 */
export const toggleEdgelessAIOnboarding = (show = true) => {
  setItem(AIOnboardingType.EDGELESS, show ? 'false' : 'true');
};
