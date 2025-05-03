import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentUrlService {

  apiUrlAddress: string = Environment.apiUrl;

  constructor() { }
}
