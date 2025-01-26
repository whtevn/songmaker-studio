import { BaseObject } from "./BaseObject";

export class SongPrompt extends BaseObject {
  constructor(promptData = {}) {
    super(promptData); // Generate localId and handle base logic

    const defaultData = {
      text: "", // Default to empty text
    };

    Object.assign(this, defaultData, promptData);
  }

  // Optional: Add any utility methods for prompts here
  updateText(newText) {
    this.text = newText;
  }
}

