/**  
 * @file Element counter class that handles a global counter which is incremeneted
 *    everytime an element is created. This ensures unique IDs
 * @author Michal Zavadil, Brno University of Technology - Faculty of Information Technology
 * @copyright Copyright 2022, OPM Editor
 * @license MIT
 * Made for Bachelor's Thesis - Agile Model Editor
*/

export class ElementCounter {
  private _value: number

  constructor(){
    this._value = -1
  }

  /** 
   * Getter for the counter value, increment automatically everytime it is requested.
   */
  public get value(): string{
    this._value++
    return this._value.toString()
  }

  /**
   * Setter for the counter value. Set on importing from JSON.
   */
  public set value(newValue : string) {
    this._value = parseInt(newValue);
  }
  
}

export const eleCounter = new ElementCounter()