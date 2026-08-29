export interface Flashcard { id: string; hindi: string; santali: string; image: string; }
export interface FlashcardSet { id: string; topic: string; cards: Flashcard[]; }
