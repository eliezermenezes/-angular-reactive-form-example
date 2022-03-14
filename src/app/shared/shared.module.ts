import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './components/form-debug/form-debug.component';
import { InvalidFeedbackComponent } from './components/invalid-feedback/invalid-feedback.component';

@NgModule({
    declarations: [
        FormDebugComponent,
        InvalidFeedbackComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FormDebugComponent,
        InvalidFeedbackComponent
    ]
})
export class SharedModule { }
