export default interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  type: 'chat' | 'img' | 'speech' | 'vision',
  img?: string[];
}
