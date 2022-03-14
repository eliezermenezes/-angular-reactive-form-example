import { FormArray, FormControl } from "@angular/forms";

declare type CustomValidator = { [key: string]: any } | null;

export class CustomValidators {
    // após, mudar a forma como é obtido o endereço pelo cep
    static cep(formControl: FormControl): CustomValidator {
        const value = formControl.value;
        // if (!!value && /^[0-9]{8}$/.test(value)) {
        //     return null;
        // }
        // return { cepInvalid: true };

        return !!value && /^[0-9]{8}$/.test(value) ? null : { cepInvalid: true };
    }

    static requiredMinCheckbox(min = 1): CustomValidator {
        return (formArray: FormArray) => {
            const totalCheched = formArray.controls
                .map(control => control.value)
                .reduce((previousValue, currentValue) => currentValue ? previousValue + currentValue : previousValue, 0);
            return totalCheched >= min ? null : { requiredMin: true };
        };
    }
}
