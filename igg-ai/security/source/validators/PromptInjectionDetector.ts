export class PromptInjectionDetector {
  private readonly INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /system override/i,
    /forget all instructions/i,
    /you are now a/i,
    /disregard previous/i,
    /bypass rules/i,
  ];

  /**
   * Scans a text input for known prompt injection heuristic patterns.
   * Returns true if injection is detected.
   */
  public detect(input: string): boolean {
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  }
}
