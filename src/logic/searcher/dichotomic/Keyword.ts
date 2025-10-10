export class Keyword {
  public static readonly MIN_WORD_LENGTH = 3

  static fromText(text: string): Array<Keyword> {
    const NON_WORD_REGEX = /\W+/g

    const sanitizedText = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim()

    return sanitizedText
      .split(NON_WORD_REGEX)
      .filter((word) => word.length > Keyword.MIN_WORD_LENGTH)
      .map((word) => new Keyword(word))
  }

  // Protected to force using the static factory method with sanitization
  protected constructor(public readonly text: string) {}
}
