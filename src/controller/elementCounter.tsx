/* 
 * Author: Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * Copyright: Copyright 2022, OPM Editor
 * Made for Bachelor's Thesis - Agile Model Editor
 * License: MIT
*/

export class ElementCounter {
  private _value: number

  constructor(){
    this._value = -1
  }

  public get value(): string{
    this._value++
    return this._value.toString()
  }

  public set value(newValue : string) {
    this._value = parseInt(newValue);
  }
  
}

export const eleCounter = new ElementCounter()