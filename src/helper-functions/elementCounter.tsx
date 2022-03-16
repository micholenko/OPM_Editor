class ElementCounter {
  private _value: number

  constructor(){
    this._value = -1
  }

  public get value(): string{
    this._value++
    return this._value.toString()
  }
}

export const eleCounter = new ElementCounter()