import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Electricity } from '../../../shared/models/Electricity';
import { DateFormatterPipe } from '../../../shared/pipes/date-formatter.pipe';
import { KWhAppenderPipe } from '../../../shared/pipes/k-wh-appender.pipe';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-readings-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, DateFormatterPipe, KWhAppenderPipe, MatTooltipModule],
  templateUrl: './readings-item.component.html',
  styleUrl: './readings-item.component.scss'
})

export class ReadingsItemComponent {
  @Input() reading!: Electricity;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.reading.id);
  }
}
