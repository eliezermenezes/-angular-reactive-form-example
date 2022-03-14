import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StateBr } from '../models/state-br';
import { Address } from '../models/address';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    constructor(private readonly http: HttpClient) { }

    getStatesBr(): Observable<StateBr[]> {
        return this.http.get<StateBr[]>('assets/states-br.json');
    }

    getByCep(cep: string): Observable<Address> {
        cep = cep.replace(/\D/g, '');

        if (!!cep && /^[0-9]{8}$/.test(cep)) {
            return this.http.get<Address>(`https://viacep.com.br/ws/${cep}/json/`);
        }
        return of({} as Address);
    }
}
