import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Address } from '../shared/models/address';
import { StateBr } from '../shared/models/state-br';
import { AddressService } from '../shared/services/address.service';
import { CustomValidators } from '../shared/services/custom-validators';

@Component({
    selector: 'app-reactive-form',
    templateUrl: './reactive-form.component.html',
    styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {
    form: FormGroup;
    // statesBr: StateBr[];
    statesBr$: Observable<StateBr[]>;

    technologies = ['Java', 'PHP', 'JavaScript', 'Python'];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly addressService: AddressService
    ) { }

    ngOnInit(): void {
        // this.form = new FormGroup({
        //   name: new FormControl(null),
        //   email: new FormControl(null),
        // });

        this.form = this.formBuilder.group({
            name: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            address: this.formBuilder.group({
                cep: [null, [Validators.required, CustomValidators.cep]],
                street: [null, Validators.required],
                district: [null, Validators.required],
                city: [null, Validators.required],
                state: [null, Validators.required]
            }),
            technologies: this._buildTechnologies(),
            contacts: this.formBuilder.array([this._buildContact()]),
        });

        // this.addressService.getStatesBr().subscribe(
        //     values => this.statesBr = values
        // );

        this.statesBr$ = this.addressService.getStatesBr();

        // this.form.get('address.cep').valueChanges.pipe(
        //     distinctUntilChanged(),
        //     debounceTime(200),
        //     switchMap(
        //         value => this.addressService.getByCep(value)
        //     )
        // ).subscribe(address => this._patchAddressValue(address));

        this.form.get('address.cep').statusChanges.pipe(
            distinctUntilChanged(),
            debounceTime(200),
            map(status => status === 'VALID'),
            switchMap(
                _ => this.addressService.getByCep(this.form.get('address.cep').value)
            )
        ).subscribe(address => this._patchAddressValue(address));
    }

    get contactGroup(): FormArray {
        return this.form.get('contacts') as FormArray;
    }

    onSubmit(): void {
        console.log(this.form);
        if (this.form.valid) {
            const value = { ...this.form.value };
            // obter os nomes das tecnologias
            value.technologies = value.technologies
                .map((item: boolean, index: number) => item ? this.technologies[index] : null)
                .filter((item: string) => item !== null);

            console.log(value);
        } else {
            this._validate(this.form);
        }
    }

    addContact(): void {
        this.contactGroup.push(this._buildContact());
    }

    removeContact(index: number): void {
        this.contactGroup.removeAt(index);
    }

    private _buildTechnologies(): any {
        const controls = this.technologies.map(
            _ => this.formBuilder.control(false)
        );
        return this.formBuilder.array(controls, CustomValidators.requiredMinCheckbox(2));
    }

    private _buildContact(): FormGroup {
        return this.formBuilder.group({
            name: ['', Validators.required],
            phone: [null, Validators.required]
        });
    }

    private _validate(formGroup: FormGroup | FormArray): void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            control.markAsDirty();

            if (control instanceof FormGroup || control instanceof FormArray) {
                this._validate(control);
            }
        });
    }

    private _patchAddressValue(data: Address): void {
        this.form.get('address').patchValue({
            street: data.logradouro,
            district: data.bairro,
            city: data.localidade,
            state: data.uf
        });
        // this.form.get('address.street').disable();
        // this.form.get('address.district').disable();
        // this.form.get('address.city').disable();
        // this.form.get('address.state').disable();

        const formGroup = this.form.get('address') as FormGroup;
        Object.keys(formGroup.controls)
            .filter(control => control !== 'cep')
            .forEach(control => formGroup.get(control).disable({ onlySelf: true }));
    }

    // cepQuery(): void {
    //     const cep = this.form.get('address.cep').value;
    //     if (!!cep) {
    //         this.addressService.getByCep(cep).subscribe(
    //             response => this.patchAddressValue(response)
    //         );
    //     }
    // }
}
