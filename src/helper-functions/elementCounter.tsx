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