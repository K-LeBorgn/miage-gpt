import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  standalone: true,
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    // Use marked to convert markdown to HTML
    return <string>marked(value);
  }
}
