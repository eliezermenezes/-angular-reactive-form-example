import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const FAILURE_MESSAGES = {
    required: 'Este campo é obrigatório',
    requiredMin: 'Marque pelo menos 1 item',
    email: 'O e-mail deve ser válido',
    cepInvalid: 'O cep deve ser válido'
};

@Component({
    selector: 'app-invalid-feedback',
    templateUrl: './invalid-feedback.component.html',
    styleUrls: ['./invalid-feedback.component.scss']
})
export class InvalidFeedbackComponent implements OnInit {
    @Input() control: AbstractControl;

    get invalid(): boolean {
        return this.control.invalid && (this.control.touched || this.control.dirty);
    }

    get failures(): string {
        for (const error in this.control.errors) {
            return FAILURE_MESSAGES[error];
        }
    }

    ngOnInit(): void { }
}
